/**
 * Comprehensive Thin Content Scoring System
 *
 * Scores entity pages on multiple signals to determine thin content risk.
 * Score range: 0 (completely thin) to 100 (rich, valuable content).
 *
 * Used by:
 * - Sitemap generation (exclude/deprioritize thin pages)
 * - Admin thin content dashboard
 * - Entity page noindex decisions
 * - Enrichment queue prioritization
 */

export interface ThinContentSignals {
  /** Number of salary submissions backing this entity */
  submissionCount: number;
  /** Whether LLM-generated analysis exists and is renderable */
  hasAnalysis: boolean;
  /** Number of keys in the analysis object (depth of analysis) */
  analysisKeyCount: number;
  /** Whether FAQ blocks exist (from enrichment or fallback) */
  hasFaq: boolean;
  /** Number of FAQ items */
  faqCount: number;
  /** Number of internal links rendered on the page (related entities) */
  internalLinkCount: number;
  /** Whether structured data (JSON-LD) includes Dataset schema */
  hasDatasetSchema: boolean;
  /** Whether structured data includes FAQPage schema */
  hasFaqSchema: boolean;
  /** Number of distinct comparison/related entity links available */
  relatedEntityCount: number;
  /** Whether percentile data (P25/P50/P75) is computable */
  hasPercentileData: boolean;
  /** Whether comp mix breakdown data exists (base/equity/bonus split) */
  hasCompMixData: boolean;
  /** Number of distinct companies or roles represented (data diversity) */
  dataDiversityCount: number;
  /** Whether external authoritative links are present */
  hasExternalLinks: boolean;
  /** Whether a disclaimer about data methodology is present */
  hasDisclaimer: boolean;
  /** Entity type for type-specific scoring */
  entityType: 'Company' | 'City' | 'Job';
}

export interface ThinContentScore {
  /** Overall score 0-100 */
  score: number;
  /** Risk level classification */
  riskLevel: 'critical' | 'high' | 'medium' | 'low' | 'healthy';
  /** Whether the page should be noindexed */
  shouldNoIndex: boolean;
  /** Whether the page should be excluded from sitemap */
  excludeFromSitemap: boolean;
  /** Breakdown of individual signal scores */
  breakdown: Record<string, number>;
  /** Specific issues found */
  issues: string[];
  /** Priority for enrichment (higher = more urgent) */
  enrichmentPriority: number;
}

/**
 * Weight configuration for each scoring signal.
 * Total weights sum to 100.
 */
const SIGNAL_WEIGHTS = {
  submissionDepth: 20,      // Core: enough data points?
  analysisPresence: 15,     // Has LLM enrichment?
  faqCoverage: 10,          // Has FAQ content?
  internalLinking: 10,      // Internal link depth
  percentileData: 10,       // Can show percentiles?
  compMixData: 8,           // Has comp breakdown?
  dataDiversity: 8,         // Multiple companies/roles/cities?
  schemaCompleteness: 7,    // Structured data present?
  externalAuthority: 5,     // External trust links?
  disclaimerPresence: 4,    // Transparency signal?
  relatedEntities: 3,       // Cross-linking breadth
} as const;

function scoreSubmissionDepth(count: number): number {
  if (count >= 50) return 100;
  if (count >= 25) return 85;
  if (count >= 10) return 65;
  if (count >= 5) return 40;
  if (count >= 3) return 20;
  if (count >= 1) return 10;
  return 0;
}

function scoreAnalysis(hasAnalysis: boolean, keyCount: number): number {
  if (!hasAnalysis) return 0;
  if (keyCount >= 8) return 100;
  if (keyCount >= 5) return 80;
  if (keyCount >= 3) return 60;
  return 40;
}

function scoreFaq(hasFaq: boolean, count: number): number {
  if (!hasFaq) return 0;
  if (count >= 8) return 100;
  if (count >= 5) return 80;
  if (count >= 3) return 50;
  return 30;
}

function scoreInternalLinks(count: number): number {
  if (count >= 15) return 100;
  if (count >= 10) return 80;
  if (count >= 5) return 55;
  if (count >= 2) return 30;
  return 0;
}

function scoreDataDiversity(count: number): number {
  if (count >= 10) return 100;
  if (count >= 5) return 70;
  if (count >= 3) return 45;
  if (count >= 1) return 20;
  return 0;
}

function scoreSchemaCompleteness(hasDataset: boolean, hasFaqSchema: boolean): number {
  let score = 0;
  if (hasDataset) score += 50;
  if (hasFaqSchema) score += 50;
  return score;
}

export function computeThinContentScore(signals: ThinContentSignals): ThinContentScore {
  const breakdown: Record<string, number> = {};
  const issues: string[] = [];

  // Compute individual signal scores (0-100 each)
  breakdown.submissionDepth = scoreSubmissionDepth(signals.submissionCount);
  breakdown.analysisPresence = scoreAnalysis(signals.hasAnalysis, signals.analysisKeyCount);
  breakdown.faqCoverage = scoreFaq(signals.hasFaq, signals.faqCount);
  breakdown.internalLinking = scoreInternalLinks(signals.internalLinkCount);
  breakdown.percentileData = signals.hasPercentileData ? 100 : 0;
  breakdown.compMixData = signals.hasCompMixData ? 100 : 0;
  breakdown.dataDiversity = scoreDataDiversity(signals.dataDiversityCount);
  breakdown.schemaCompleteness = scoreSchemaCompleteness(signals.hasDatasetSchema, signals.hasFaqSchema);
  breakdown.externalAuthority = signals.hasExternalLinks ? 100 : 0;
  breakdown.disclaimerPresence = signals.hasDisclaimer ? 100 : 0;
  breakdown.relatedEntities = signals.relatedEntityCount >= 3 ? 100 : signals.relatedEntityCount >= 1 ? 50 : 0;

  // Compute weighted total
  const weightEntries = Object.entries(SIGNAL_WEIGHTS) as [keyof typeof SIGNAL_WEIGHTS, number][];
  let totalScore = 0;
  for (const [key, weight] of weightEntries) {
    totalScore += (breakdown[key] / 100) * weight;
  }
  const score = Math.round(totalScore);

  // Identify issues
  if (signals.submissionCount < 5) issues.push('Critically low submission count (< 5)');
  else if (signals.submissionCount < 10) issues.push('Low submission count (< 10)');
  if (!signals.hasAnalysis) issues.push('Missing LLM analysis enrichment');
  if (!signals.hasFaq || signals.faqCount < 3) issues.push('Insufficient FAQ coverage');
  if (signals.internalLinkCount < 5) issues.push('Weak internal linking (< 5 links)');
  if (!signals.hasPercentileData) issues.push('No percentile data computable');
  if (!signals.hasCompMixData) issues.push('No compensation mix breakdown');
  if (signals.dataDiversityCount < 3) issues.push('Low data diversity');
  if (!signals.hasDatasetSchema || !signals.hasFaqSchema) issues.push('Incomplete schema markup');
  if (!signals.hasExternalLinks) issues.push('No external authority links');
  if (!signals.hasDisclaimer) issues.push('Missing data methodology disclaimer');

  // Classify risk level
  let riskLevel: ThinContentScore['riskLevel'];
  if (score >= 75) riskLevel = 'healthy';
  else if (score >= 55) riskLevel = 'low';
  else if (score >= 35) riskLevel = 'medium';
  else if (score >= 20) riskLevel = 'high';
  else riskLevel = 'critical';

  // Noindex threshold: pages below 25 should not be indexed
  const shouldNoIndex = score < 25;

  // Sitemap exclusion: pages below 15 waste crawl budget
  const excludeFromSitemap = score < 15;

  // Enrichment priority: inversely proportional to score, boosted by submission count
  // Pages with more submissions but low scores are higher priority (more data to work with)
  const submissionBoost = Math.min(signals.submissionCount / 10, 3);
  const enrichmentPriority = Math.round((100 - score) * (1 + submissionBoost * 0.3));

  return {
    score,
    riskLevel,
    shouldNoIndex,
    excludeFromSitemap,
    breakdown,
    issues,
    enrichmentPriority,
  };
}

/**
 * Quick check to determine if a page has minimum viable content.
 * Used for fast filtering without computing the full score.
 */
export function hasMinimumViableContent(
  submissionCount: number,
  hasAnalysis: boolean,
  hasFaq: boolean,
): boolean {
  // At least 3 submissions AND (analysis OR FAQ)
  return submissionCount >= 3 && (hasAnalysis || hasFaq);
}

/**
 * Compute a sitemap priority value (0.0 - 1.0) from thin content score.
 */
export function thinContentScoreToSitemapPriority(score: number): number {
  if (score >= 80) return 0.9;
  if (score >= 60) return 0.75;
  if (score >= 40) return 0.6;
  if (score >= 25) return 0.4;
  return 0.2;
}
