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
      question: `What is a typical ${entityName} salary?`,
      answer: data.medianComp
        ? `The median total compensation for ${entityName} is ${fmt(data.medianComp)}, based on ${data.submissionCount?.toLocaleString() ?? 'available'} salary records. This figure represents the midpoint of the market, including base salary, stock grants, and bonuses. The middle 50% of earners typically range between ${data.p25 ? fmt(data.p25) : 'N/A'} and ${data.p75 ? fmt(data.p75) : 'N/A'}.`
        : `We are currently aggregating salary data for ${entityName} to build a reliable market baseline. If you work in this role, submitting your salary helps improve transparency for everyone.`,
    });
    faqs.push({
      question: `Is my offer for ${entityName} competitive?`,
      answer: data.medianComp
        ? `To evaluate your offer, comparing against the median (${fmt(data.medianComp)}) is a good start. However, top-tier offers often fall above the 75th percentile (${data.p75 ? fmt(data.p75) : 'N/A'}). If your total package is below the 25th percentile (${data.p25 ? fmt(data.p25) : 'N/A'}), there may be significant room to negotiate, especially on equity or signing bonuses.`
        : `Once we have sufficient data, you can use the percentile bands on this page to benchmark your offer against the market distribution.`,
    });
    faqs.push({
      question: `Which companies pay the highest for ${entityName} roles?`,
      answer: data.topPayingEntity
        ? `Our data indicates that ${data.topPayingEntity} is currently one of the top-paying employers for ${entityName}. However, compensation leadership often shifts between tech giants and specialized startups. Check the company rankings table on this page for the most current leaderboard.`
        : `Browse the "Top Paying Companies" section on this page to see which employers are currently leading the market for ${entityName} compensation.`,
    });
    faqs.push({
      question: `What factors influence ${entityName} compensation the most?`,
      answer: `Beyond base salary, total compensation for ${entityName} is heavily driven by level (seniority), location (cost of labor), and equity performance. In many cases, stock grants (RSUs) can make up 30-50% of the total package at senior levels, creating a wide spread between cash-heavy and equity-heavy offers.`,
    });
  }

  if (entityType === 'City') {
    faqs.push({
      question: `What is the average tech salary in ${entityName}?`,
      answer: data.medianComp
        ? `In ${entityName}, the median total compensation for technology professionals is ${fmt(data.medianComp)}. This figure is derived from ${data.submissionCount?.toLocaleString() ?? 'available'} verified data points and reflects the local market rate for combined base, equity, and bonus.`
        : `We are actively building the salary dataset for ${entityName}. Contributing your compensation data helps create a clearer picture of the local market.`,
    });
    faqs.push({
      question: `How does ${entityName} compare to other tech hubs?`,
      answer: data.medianComp
        ? `With a median of ${fmt(data.medianComp)}, ${entityName} offers a distinct compensation profile. To understand the real value, compare this against Tier 1 hubs like SF or NYC while factoring in ${entityName}'s specific cost of living, tax advantages, and quality of life.`
        : `We need more data to provide a reliable comparison between ${entityName} and other major tech hubs.`,
    });
    faqs.push({
      question: `Is it worth relocating to ${entityName} for work?`,
      answer: `Relocation value depends on "effective income" rather than just the headline salary number. While ${entityName} may offer different nominal pay than coastal hubs, lower housing costs and taxes can often result in higher disposable income. Use the percentile data on this page to model your potential purchasing power.`,
    });
    faqs.push({
      question: `Which jobs pay the best in ${entityName}?`,
      answer: data.topPayingEntity
        ? `${data.topPayingEntity} is currently among the highest-compensated roles in the ${entityName} area. For a complete list of top-earning positions, refer to the "Highest Paying Jobs" table on this page.`
        : `Check the "Highest Paying Jobs" table on this page to see the current ranking of top-compensated roles in ${entityName}.`,
    });
  }

  if (entityType === 'Company') {
    faqs.push({
      question: `How much does ${entityName} pay?`,
      answer: data.medianComp
        ? `The median total compensation at ${entityName} is ${fmt(data.medianComp)}, based on ${data.submissionCount?.toLocaleString() ?? 'our'} data points. This figure accounts for base salary as well as stock grants and bonuses, which are significant components of the package at this level.`
        : `We are currently collecting more salary submissions for ${entityName} to provide a statistically significant estimate.`,
    });
    faqs.push({
      question: `Does ${entityName} pay above market rates?`,
      answer: data.medianComp
        ? `With a median package of ${fmt(data.medianComp)}, ${entityName} competes for top talent. Whether this is "above market" depends on the specific role and level. We recommend comparing these figures against direct competitors using the peer comparison tool on this page.`
        : `Once sufficient data is available, you will be able to benchmark ${entityName} against industry medians directly on this page.`,
    });
    faqs.push({
      question: `What is the compensation philosophy at ${entityName}?`,
      answer: `Companies like ${entityName} typically structure pay with a mix of guaranteed cash (base) and performance-based upside (equity/bonus). The "Compensation Mix" section on this page breaks down these components, showing whether ${entityName} leans more towards stable cash or high-growth equity.`,
    });
    faqs.push({
      question: `Which roles earn the most at ${entityName}?`,
      answer: data.topPayingEntity
        ? `At ${entityName}, the ${data.topPayingEntity} role currently tops our dataset for median compensation. You can view the full hierarchy of pay by role in the "Salary Overview" table below.`
        : `Refer to the "Salary Overview" table to see a detailed breakdown of compensation by job title at ${entityName}.`,
    });
  }

  return faqs;
}
