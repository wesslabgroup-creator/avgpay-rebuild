/**
 * Intent Classification System
 *
 * Every entity page must satisfy at least one explicit user intent.
 * This system assigns intents to entity pages and identifies
 * which intents are satisfied vs missing.
 *
 * If a page does not clearly satisfy intent, it is considered thin
 * and must be upgraded.
 */

export type UserIntent =
  | 'salary_benchmarking'      // "what should I make?"
  | 'offer_evaluation'         // "is my offer good?"
  | 'negotiation'              // "what should I negotiate?"
  | 'career_progression'       // "how does pay grow?"
  | 'relocation_comparison'    // "should I move?"
  | 'company_comparison'       // "who pays better?"
  | 'cost_of_living'           // "what's the real take-home?"
  | 'market_overview'          // "what does the market look like?"
  | 'equity_analysis'          // "how much equity should I expect?"
  | 'role_exploration';        // "what roles pay well here?"

export interface IntentDefinition {
  id: UserIntent;
  label: string;
  question: string;
  description: string;
}

export const INTENT_DEFINITIONS: Record<UserIntent, IntentDefinition> = {
  salary_benchmarking: {
    id: 'salary_benchmarking',
    label: 'Salary Benchmarking',
    question: 'What should I earn?',
    description: 'User wants to understand the typical compensation range for a given entity.',
  },
  offer_evaluation: {
    id: 'offer_evaluation',
    label: 'Offer Evaluation',
    question: "Is my offer good?",
    description: 'User wants to assess whether a specific offer is competitive.',
  },
  negotiation: {
    id: 'negotiation',
    label: 'Negotiation Guidance',
    question: 'What should I negotiate?',
    description: 'User wants actionable negotiation leverage based on market data.',
  },
  career_progression: {
    id: 'career_progression',
    label: 'Career Progression',
    question: 'How does pay grow?',
    description: 'User wants to understand how compensation scales with experience.',
  },
  relocation_comparison: {
    id: 'relocation_comparison',
    label: 'Relocation Comparison',
    question: 'Should I move?',
    description: 'User wants to compare compensation across locations adjusted for cost of living.',
  },
  company_comparison: {
    id: 'company_comparison',
    label: 'Company Comparison',
    question: 'Who pays better?',
    description: 'User wants to compare compensation across companies.',
  },
  cost_of_living: {
    id: 'cost_of_living',
    label: 'Cost of Living Analysis',
    question: "What's the real take-home?",
    description: 'User wants to understand effective purchasing power after local costs.',
  },
  market_overview: {
    id: 'market_overview',
    label: 'Market Overview',
    question: 'What does the market look like?',
    description: 'User wants a broad understanding of compensation trends.',
  },
  equity_analysis: {
    id: 'equity_analysis',
    label: 'Equity Analysis',
    question: 'How much equity should I expect?',
    description: 'User wants to understand equity/RSU compensation patterns.',
  },
  role_exploration: {
    id: 'role_exploration',
    label: 'Role Exploration',
    question: 'What roles pay well here?',
    description: 'User wants to discover which roles or specializations are highest-paying.',
  },
};

/**
 * Required intents per entity type.
 * Each entity page must satisfy at least 3 intents from its list.
 */
export const REQUIRED_INTENTS: Record<'Company' | 'City' | 'Job', UserIntent[]> = {
  Job: [
    'salary_benchmarking',    // what should I earn?
    'offer_evaluation',       // is my offer good?
    'negotiation',            // what should I negotiate?
    'career_progression',     // how does pay grow?
    'company_comparison',     // who pays the most for this role?
    'equity_analysis',        // equity expectations for this role
  ],
  City: [
    'salary_benchmarking',    // is pay higher here?
    'relocation_comparison',  // should I move?
    'cost_of_living',         // real take-home after costs
    'role_exploration',       // what pays best here?
    'company_comparison',     // who pays most here?
    'market_overview',        // local market landscape
  ],
  Company: [
    'salary_benchmarking',    // what does this company pay?
    'offer_evaluation',       // is my company offer good?
    'negotiation',            // what to negotiate at this company
    'company_comparison',     // how does this compare to competitors?
    'equity_analysis',        // is this company equity-heavy?
    'role_exploration',       // what roles pay best here?
  ],
};

export interface IntentSatisfactionInput {
  entityType: 'Company' | 'City' | 'Job';
  /** Has salary range/percentile data displayed */
  hasSalaryRange: boolean;
  /** Has comparison section (vs peers, vs national, etc.) */
  hasComparisons: boolean;
  /** Has negotiation-relevant content (leverage points, ranges) */
  hasNegotiationContext: boolean;
  /** Has career/level progression data */
  hasProgressionData: boolean;
  /** Has cost of living / buying power analysis */
  hasCostOfLiving: boolean;
  /** Has role-level breakdowns or rankings */
  hasRoleBreakdowns: boolean;
  /** Has company-level breakdowns or rankings */
  hasCompanyBreakdowns: boolean;
  /** Has equity/comp mix analysis */
  hasEquityAnalysis: boolean;
  /** Has analysis/enrichment content */
  hasAnalysis: boolean;
}

export interface IntentSatisfactionResult {
  /** List of intents this page satisfies */
  satisfied: UserIntent[];
  /** List of intents this page fails to satisfy */
  missing: UserIntent[];
  /** Ratio of satisfied to total required intents (0.0 - 1.0) */
  satisfactionRatio: number;
  /** Whether the page meets minimum intent threshold (3+ intents) */
  meetsMinimumIntent: boolean;
  /** Specific modules recommended to fill intent gaps */
  recommendations: string[];
}

/**
 * Evaluate which user intents a page satisfies based on available content signals.
 */
export function evaluateIntentSatisfaction(input: IntentSatisfactionInput): IntentSatisfactionResult {
  const required = REQUIRED_INTENTS[input.entityType];
  const satisfied: UserIntent[] = [];
  const missing: UserIntent[] = [];
  const recommendations: string[] = [];

  for (const intent of required) {
    const isSatisfied = checkIntentSatisfied(intent, input);
    if (isSatisfied) {
      satisfied.push(intent);
    } else {
      missing.push(intent);
      recommendations.push(getIntentRecommendation(intent, input.entityType));
    }
  }

  const satisfactionRatio = required.length > 0 ? satisfied.length / required.length : 0;

  return {
    satisfied,
    missing,
    satisfactionRatio,
    meetsMinimumIntent: satisfied.length >= 3,
    recommendations,
  };
}

function checkIntentSatisfied(intent: UserIntent, input: IntentSatisfactionInput): boolean {
  switch (intent) {
    case 'salary_benchmarking':
      return input.hasSalaryRange;
    case 'offer_evaluation':
      return input.hasSalaryRange && (input.hasComparisons || input.hasAnalysis);
    case 'negotiation':
      return input.hasNegotiationContext || (input.hasSalaryRange && input.hasAnalysis);
    case 'career_progression':
      return input.hasProgressionData || input.hasAnalysis;
    case 'relocation_comparison':
      return input.hasCostOfLiving || input.hasComparisons;
    case 'company_comparison':
      return input.hasCompanyBreakdowns || input.hasComparisons;
    case 'cost_of_living':
      return input.hasCostOfLiving;
    case 'market_overview':
      return input.hasSalaryRange && (input.hasRoleBreakdowns || input.hasCompanyBreakdowns);
    case 'equity_analysis':
      return input.hasEquityAnalysis;
    case 'role_exploration':
      return input.hasRoleBreakdowns;
    default:
      return false;
  }
}

function getIntentRecommendation(intent: UserIntent, entityType: string): string {
  const rec: Record<UserIntent, string> = {
    salary_benchmarking: `Add percentile salary bands (P25/P50/P75) for ${entityType.toLowerCase()}`,
    offer_evaluation: `Add offer context section comparing this ${entityType.toLowerCase()} to market median`,
    negotiation: `Add negotiation leverage section with data-backed ranges`,
    career_progression: `Add YoE-based progression ladder or level-based compensation scaling`,
    relocation_comparison: `Add cost-of-living adjusted comparison with similar cities`,
    company_comparison: `Add peer company comparison section with median comp deltas`,
    cost_of_living: `Add buying power analysis with tax and cost-of-living adjustments`,
    market_overview: `Add market overview section with top roles and companies`,
    equity_analysis: `Add compensation mix breakdown showing base/equity/bonus split`,
    role_exploration: `Add ranked role list with median compensation per role`,
  };
  return rec[intent] || `Address ${intent} intent for ${entityType}`;
}

/**
 * Generate intent-driven FAQ questions based on entity type and data.
 * These are more targeted than the generic buildEntityFaq in seo.ts.
 */
export function generateIntentDrivenFaqs(
  entityType: 'Company' | 'City' | 'Job',
  entityName: string,
  data: {
    medianComp?: number;
    submissionCount?: number;
    p25?: number;
    p75?: number;
    topPayingEntity?: string;
  },
): { question: string; answer: string }[] {
  const fmt = (n: number) => `$${Math.round(n / 1000)}k`;
  const faqs: { question: string; answer: string }[] = [];

  if (entityType === 'Job') {
    faqs.push({
      question: `What is the average ${entityName} salary?`,
      answer: data.medianComp
        ? `Based on ${data.submissionCount?.toLocaleString() ?? 'available'} salary submissions, the median total compensation for ${entityName} is ${fmt(data.medianComp)}. The middle 50% of earners fall between ${data.p25 ? fmt(data.p25) : 'N/A'} and ${data.p75 ? fmt(data.p75) : 'N/A'}.`
        : `We are still collecting enough salary data for ${entityName} to provide a reliable estimate. Submit your salary to help grow this dataset.`,
    });
    faqs.push({
      question: `Is my ${entityName} offer competitive?`,
      answer: data.medianComp
        ? `Compare your offer against the median of ${fmt(data.medianComp)}. If your total compensation (base + equity + bonus) is above the 75th percentile (${data.p75 ? fmt(data.p75) : 'N/A'}), your offer is strong. Below the 25th percentile signals room for negotiation.`
        : `Use the percentile ranges on this page to benchmark your offer once we have sufficient data.`,
    });
    faqs.push({
      question: `Which company pays ${entityName} the most?`,
      answer: data.topPayingEntity
        ? `In our dataset, ${data.topPayingEntity} currently shows the highest median compensation for ${entityName} roles. However, total comp varies significantly by level, location, and equity structure.`
        : `Browse the company rankings table on this page to see which employers offer the highest total compensation for ${entityName}.`,
    });
    faqs.push({
      question: `How should I negotiate a ${entityName} salary?`,
      answer: `Use the percentile bands on this page to set your target range. Aim for the 75th percentile as your initial ask, and treat the median as your walk-away floor. Factor in equity, sign-on bonuses, and RSU vesting schedules beyond base salary alone.`,
    });
  }

  if (entityType === 'City') {
    faqs.push({
      question: `What is the average salary in ${entityName}?`,
      answer: data.medianComp
        ? `The median total compensation in ${entityName} is ${fmt(data.medianComp)} across ${data.submissionCount?.toLocaleString() ?? 'available'} salary data points. The interquartile range spans ${data.p25 ? fmt(data.p25) : 'N/A'} to ${data.p75 ? fmt(data.p75) : 'N/A'}.`
        : `We are building the ${entityName} salary dataset. Submit your salary to contribute.`,
    });
    faqs.push({
      question: `Is ${entityName} a good city for tech salaries?`,
      answer: data.medianComp
        ? `${entityName} shows a median tech compensation of ${fmt(data.medianComp)}. To evaluate whether this is "good," compare against your current location's median and factor in local cost of living, state taxes, and housing costs.`
        : `We need more salary submissions for ${entityName} before providing a reliable assessment.`,
    });
    faqs.push({
      question: `Should I relocate to ${entityName} for a higher salary?`,
      answer: `Headline salary numbers can be misleading without cost-of-living adjustments. A high nominal salary in an expensive city may yield lower disposable income than a moderate salary in an affordable market. Use this page's data alongside a cost-of-living calculator.`,
    });
    faqs.push({
      question: `What jobs pay the most in ${entityName}?`,
      answer: data.topPayingEntity
        ? `${data.topPayingEntity} is among the highest-paying roles in ${entityName}. See the full job rankings table on this page for a complete breakdown by role and median compensation.`
        : `Check the job rankings table on this page for the most current data.`,
    });
  }

  if (entityType === 'Company') {
    faqs.push({
      question: `What is the average salary at ${entityName}?`,
      answer: data.medianComp
        ? `Across ${data.submissionCount?.toLocaleString() ?? 'available'} salary submissions, the median total compensation at ${entityName} is ${fmt(data.medianComp)}. This includes base salary, equity/RSUs, and annual bonuses.`
        : `We are still collecting salary data for ${entityName}. Submit your compensation to help.`,
    });
    faqs.push({
      question: `Does ${entityName} pay above market rate?`,
      answer: data.medianComp
        ? `At ${fmt(data.medianComp)} median total comp, compare ${entityName} to peer companies on this page. Above-market compensation depends on role, level, and location. Use the comparison links to benchmark against specific competitors.`
        : `Once we have sufficient data, this page will show how ${entityName} compares to market medians.`,
    });
    faqs.push({
      question: `Is ${entityName} equity-heavy or base-heavy?`,
      answer: `The compensation mix at ${entityName} varies by role and level. Senior roles and engineering positions typically carry more equity weighting. Check the compensation breakdown section for base/equity/bonus split details.`,
    });
    faqs.push({
      question: `What roles pay the most at ${entityName}?`,
      answer: data.topPayingEntity
        ? `${data.topPayingEntity} is the highest-compensated role at ${entityName} in our dataset. Browse the salary overview table for a full role-by-role breakdown.`
        : `See the salary overview table on this page for role-level compensation data at ${entityName}.`,
    });
  }

  return faqs;
}
