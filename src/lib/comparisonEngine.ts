import { generateTimelessAnalysis, type ComparisonAnalysis, type AnalysisResult } from '@/lib/enrichment';
import { supabaseAdmin } from '@/lib/supabaseClient';
import { type EntityMetricsScope } from '@/lib/marketStats';

const COMPARISON_ANALYSIS_TABLE = process.env.COMPARISON_ANALYSIS_TABLE ?? 'Comparison';
const NARRATIVE_FIELDS = ['generatedAnalysis', 'generated_analysis', 'analysis', 'narrative'];

export interface CompanySimilarityMatch {
  company: string;
  similarityScore: number;
  medianComp: number;
  sampleSize: number;
}

function slugifyEntity(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function ensureComparisonSlug(entityA: string, entityB: string): string {
  return `${slugifyEntity(entityA)}-vs-${slugifyEntity(entityB)}`;
}

function normalizeRecordValue(value: unknown) {
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) return value.join(' ');
  return '';
}

function getNarrativeField(record: Record<string, unknown>, keys: string[], fallback: string) {
  for (const key of keys) {
    const candidate = normalizeRecordValue(record[key]);
    if (candidate.trim().length > 0) return candidate;
  }

  return fallback;
}


function shouldSkipLlmDuringBuild(): boolean {
  return process.env.NEXT_PHASE === 'phase-production-build' || process.env.SKIP_LLM_DURING_BUILD === 'true';
}

function normalizeComparisonNarrative(analysis: AnalysisResult, entityA: string, entityB: string): ComparisonAnalysis {
  const narrativeSource = analysis as Record<string, unknown>;

  return {
    philosophical_divergence: getNarrativeField(
      narrativeSource,
      ['philosophical_divergence', 'Philosophical Divergence', 'philosophicalDivergence'],
      `${entityA} and ${entityB} optimize compensation using different risk/reward levers.`,
    ),
    cultural_tradeoff: getNarrativeField(
      narrativeSource,
      ['cultural_tradeoff', 'Cultural Trade-off', 'culturalTradeOff'],
      `In contrast, one environment usually favors predictable execution while the other rewards operating in ambiguity.`,
    ),
    winner_profile: getNarrativeField(
      narrativeSource,
      ['winner_profile', 'Winner Profile', 'winnerProfile'],
      `The winner profile differs: professionals optimizing stability may prefer one path, whereas upside seekers may prefer the other.`,
    ),
  };
}

async function readCachedComparison(slug: string): Promise<ComparisonAnalysis | null> {
  const { data } = await supabaseAdmin
    .from(COMPARISON_ANALYSIS_TABLE)
    .select(`slug, ${NARRATIVE_FIELDS.join(', ')}`)
    .eq('slug', slug)
    .maybeSingle();

  const comparisonRecord = data as Record<string, unknown> | null;
  const rawNarrative = NARRATIVE_FIELDS
    .map((field) => comparisonRecord?.[field])
    .find((value) => typeof value === 'object' && value !== null) as Record<string, unknown> | undefined;

  if (!rawNarrative) return null;

  return {
    philosophical_divergence: getNarrativeField(rawNarrative, ['philosophical_divergence', 'Philosophical Divergence'], ''),
    cultural_tradeoff: getNarrativeField(rawNarrative, ['cultural_tradeoff', 'Cultural Trade-off'], ''),
    winner_profile: getNarrativeField(rawNarrative, ['winner_profile', 'Winner Profile'], ''),
  };
}

async function cacheComparisonNarrative(slug: string, payload: ComparisonAnalysis, entityA: string, entityB: string, role: string) {
  const upsertPayload: Record<string, unknown> = {
    slug,
    generatedAnalysis: payload,
    generated_analysis: payload,
    entityA,
    entityB,
    role,
    generatedAt: new Date().toISOString(),
  };

  const { error } = await supabaseAdmin
    .from(COMPARISON_ANALYSIS_TABLE)
    .upsert(upsertPayload, { onConflict: 'slug' });

  if (error) {
    console.warn(`Unable to cache comparison narrative for ${slug}: ${error.message}`);
  }
}

export async function generateComparisonAnalysis(entityA: string, entityB: string, role: string, slug?: string): Promise<ComparisonAnalysis> {
  const comparisonSlug = slug ?? ensureComparisonSlug(entityA, entityB);

  const cached = await readCachedComparison(comparisonSlug);
  if (cached?.philosophical_divergence && cached.cultural_tradeoff && cached.winner_profile) {
    return cached;
  }

  const context: {
    comparison: {
      entityA: EntityMetricsScope;
      entityB: EntityMetricsScope;
      labelA: string;
      labelB: string;
    };
    additionalContext: string;
  } = {
    comparison: {
      entityA: { entityType: 'Company', entityName: entityA, company: entityA, role },
      entityB: { entityType: 'Company', entityName: entityB, company: entityB, role },
      labelA: entityA,
      labelB: entityB,
    },
    additionalContext:
      `Interpret trade-offs explicitly using comparative language. Focus on what candidates gain and lose between ${entityA} and ${entityB} for ${role}.`,
  };

  if (shouldSkipLlmDuringBuild()) {
    const deterministic: ComparisonAnalysis = {
      philosophical_divergence: `${entityA} and ${entityB} reward different compensation priorities, whereas one tends to emphasize stable cash flow and the other leans on upside-heavy components.`,
      cultural_tradeoff: `In contrast, candidates choosing between ${entityA} and ${entityB} usually trade predictability for operating velocity, alternatively prioritizing day-to-day certainty over growth optionality.`,
      winner_profile: `Professionals who thrive in structured execution loops may prefer one path, whereas candidates comfortable with ambiguity and upside risk may prefer the alternative.`,
    };

    await cacheComparisonNarrative(comparisonSlug, deterministic, entityA, entityB, role);
    return deterministic;
  }

  try {
    const { analysis } = await generateTimelessAnalysis('Comparison', `${entityA} vs ${entityB}`, context);
    const normalized = normalizeComparisonNarrative(analysis, entityA, entityB);

    await cacheComparisonNarrative(comparisonSlug, normalized, entityA, entityB, role);

    return normalized;
  } catch (error) {
    console.warn(`Falling back to deterministic comparison narrative for ${comparisonSlug}:`, error);
    return {
      philosophical_divergence: `${entityA} and ${entityB} reward different compensation priorities, whereas one tends to emphasize stable cash flow and the other leans on upside-heavy components.`,
      cultural_tradeoff: `In contrast, candidates choosing between ${entityA} and ${entityB} usually trade predictability for operating velocity, alternatively prioritizing day-to-day certainty over growth optionality.`,
      winner_profile: `Professionals who thrive in structured execution loops may prefer one path, whereas candidates comfortable with ambiguity and upside risk may prefer the alternative.`,
    };
  }
}

interface CompanySalaryAggregate {
  companyId: string;
  companyName: string;
  medianComp: number;
  sampleSize: number;
  p25Comp: number;
  p75Comp: number;
}

function median(values: number[]) {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? Math.round((sorted[mid - 1] + sorted[mid]) / 2) : sorted[mid];
}

function percentile(values: number[], p: number) {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const index = Math.floor((p / 100) * (sorted.length - 1));
  return sorted[index] ?? 0;
}

function computeSimilarityScore(source: CompanySalaryAggregate, target: CompanySalaryAggregate) {
  const medianGap = Math.abs(source.medianComp - target.medianComp);
  const sourceBand = Math.max(source.p75Comp - source.p25Comp, 1);
  const targetBand = Math.max(target.p75Comp - target.p25Comp, 1);
  const bandGap = Math.abs(sourceBand - targetBand);

  const normalizedMedianGap = medianGap / Math.max(source.medianComp, 1);
  const normalizedBandGap = bandGap / Math.max(sourceBand, 1);

  const score = Math.max(0, 100 - (normalizedMedianGap * 75 + normalizedBandGap * 25) * 100);
  return Number(score.toFixed(1));
}

export async function getTopSimilarCompaniesBySalaryBands(companyName: string, limit = 3): Promise<CompanySimilarityMatch[]> {
  const { data: rows, error } = await supabaseAdmin
    .from('Salary')
    .select('totalComp, companyId, Company!inner(name)')
    .not('totalComp', 'is', null)
    .limit(10000);

  if (error || !rows?.length) {
    return [];
  }

  const grouped = new Map<string, { companyName: string; totals: number[] }>();

  for (const row of rows as Array<{ totalComp: number; companyId: string; Company?: { name?: string } | { name?: string }[] }>) {
    const totalComp = row.totalComp;
    if (typeof totalComp !== 'number') continue;

    const companyId = row.companyId;
    const relatedCompany = Array.isArray(row.Company) ? row.Company[0] : row.Company;
    const normalizedName = relatedCompany?.name;
    if (!companyId || !normalizedName) continue;

    const existing = grouped.get(companyId) ?? { companyName: normalizedName, totals: [] };
    existing.totals.push(totalComp);
    grouped.set(companyId, existing);
  }

  const aggregates: CompanySalaryAggregate[] = Array.from(grouped.entries())
    .map(([companyId, info]) => {
      const totals = info.totals.sort((a, b) => a - b);
      return {
        companyId,
        companyName: info.companyName,
        medianComp: median(totals),
        sampleSize: totals.length,
        p25Comp: percentile(totals, 25),
        p75Comp: percentile(totals, 75),
      };
    })
    .filter((item) => item.sampleSize >= 5);

  const source = aggregates.find((item) => item.companyName.toLowerCase() === companyName.toLowerCase());
  if (!source) return [];

  return aggregates
    .filter((item) => item.companyId !== source.companyId)
    .map((item) => ({
      company: item.companyName,
      similarityScore: computeSimilarityScore(source, item),
      medianComp: item.medianComp,
      sampleSize: item.sampleSize,
    }))
    .sort((a, b) => b.similarityScore - a.similarityScore)
    .slice(0, limit);
}

export function getComparisonSlug(entityA: string, entityB: string) {
  return ensureComparisonSlug(entityA, entityB);
}
