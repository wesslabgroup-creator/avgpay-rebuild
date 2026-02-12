import type { EntityType } from '@/lib/types/enrichment';

export interface IndexingEvaluationInput {
  entityType: Extract<EntityType, 'Company' | 'City' | 'Job'>;
  entityName: string;
  salarySubmissionCount: number;
  hasRenderableAnalysis: boolean;
}

const TIER1_CITY_KEYWORDS = ['new york', 'san francisco', 'seattle', 'austin', 'los angeles', 'boston', 'chicago'];
const TIER1_COMPANY_KEYWORDS = ['google', 'meta', 'microsoft', 'amazon', 'apple', 'netflix', 'openai'];
const TIER1_JOB_KEYWORDS = ['software engineer', 'product manager', 'data scientist', 'machine learning engineer'];

const STALE_ANALYSIS_DAYS = 90;

function isTier1Entity({ entityType, entityName }: Pick<IndexingEvaluationInput, 'entityType' | 'entityName'>): boolean {
  const normalized = entityName.trim().toLowerCase();

  if (entityType === 'City') {
    return TIER1_CITY_KEYWORDS.some((keyword) => normalized.includes(keyword));
  }

  if (entityType === 'Company') {
    return TIER1_COMPANY_KEYWORDS.some((keyword) => normalized.includes(keyword));
  }

  return TIER1_JOB_KEYWORDS.some((keyword) => normalized.includes(keyword));
}

export function evaluateIndexingEligibility(input: IndexingEvaluationInput) {
  const tier1 = isTier1Entity(input);
  const meetsMinSubmissions = input.salarySubmissionCount >= 10;
  const meetsHybridThreshold = input.salarySubmissionCount >= 5 && input.hasRenderableAnalysis;
  const indexable = meetsMinSubmissions || meetsHybridThreshold || tier1;

  return {
    indexable,
    shouldNoIndex: !indexable,
    reason: indexable
      ? meetsMinSubmissions
        ? 'submission_threshold_met'
        : meetsHybridThreshold
          ? 'hybrid_threshold_met'
          : 'tier1_entity'
      : 'insufficient_salary_density',
    tier1,
  };
}

export function shouldTriggerEnrichment(options: {
  analysisGeneratedAt?: string | null;
  hasRenderableAnalysis: boolean;
  salarySubmissionCount: number;
}) {
  if (!options.hasRenderableAnalysis) return true;

  if (options.salarySubmissionCount >= 5 && options.salarySubmissionCount % 25 === 0) {
    return true;
  }

  if (!options.analysisGeneratedAt) return true;

  const generatedAt = new Date(options.analysisGeneratedAt);
  if (Number.isNaN(generatedAt.getTime())) return true;

  const ageMs = Date.now() - generatedAt.getTime();
  const maxAgeMs = STALE_ANALYSIS_DAYS * 24 * 60 * 60 * 1000;
  return ageMs > maxAgeMs;
}

export function buildEntityFaq(entityName: string, entityType: 'Company' | 'City' | 'Job', salaryCount: number, medianComp: number) {
  const compText = medianComp > 0 ? `$${Math.round(medianComp / 1000)}k` : 'not yet stable';

  return [
    {
      question: `How reliable is the ${entityName} salary dataset?`,
      answer: `AvgPay currently uses ${salaryCount.toLocaleString()} submissions for ${entityName}. Reliability improves as sample depth grows across levels and compensation components.`
    },
    {
      question: `What does median compensation mean for ${entityName}?`,
      answer: `The median is the midpoint of reported total compensation packages. For ${entityName}, the current median reference point is ${compText}.`
    },
    {
      question: `Are these salaries self-reported?`,
      answer: 'Yes. AvgPay includes self-reported compensation and other public compensation sources, then normalizes records before aggregation.'
    },
    {
      question: `How should I use ${entityName} salary data in negotiation?`,
      answer: `Use percentile ranges and peer context for ${entityName} to set a target range rather than relying on a single number.`
    },
    {
      question: `Why can compensation for ${entityName} vary so much?`,
      answer: `Compensation changes with level, equity mix, location, and company stage. AvgPay highlights distribution instead of only one headline average.`
    }
  ];
}
