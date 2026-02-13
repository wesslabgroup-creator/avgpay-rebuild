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
    .filter((item) => item.sampleSize >= 1); // Loosened from 5 to 1 for visibility

  const source = aggregates.find((item) => item.companyName.toLowerCase() === companyName.toLowerCase());

  // Fallback: If source company has no data, or no peers found, just return top companies by sample size
  if (!source) {
    return aggregates
      .sort((a, b) => b.sampleSize - a.sampleSize)
      .slice(0, limit)
      .map((item) => ({
        company: item.companyName,
        similarityScore: 50, // Default mid-score
        medianComp: item.medianComp,
        sampleSize: item.sampleSize,
      }));
  }

  const peers = aggregates
    .filter((item) => item.companyId !== source.companyId)
    .map((item) => ({
      company: item.companyName,
      similarityScore: computeSimilarityScore(source, item),
      medianComp: item.medianComp,
      sampleSize: item.sampleSize,
    }))
    .sort((a, b) => b.similarityScore - a.similarityScore);

  // If we found strict peers, return them.
  if (peers.length > 0) return peers.slice(0, limit);

  // If strict filtering yielded nothing, just return top other companies (fallback)
  return aggregates
    .filter((item) => item.companyId !== source.companyId)
    .sort((a, b) => b.sampleSize - a.sampleSize)
    .slice(0, limit)
    .map((item) => ({
      company: item.companyName,
      similarityScore: 0,
      medianComp: item.medianComp,
      sampleSize: item.sampleSize,
    }));
}

export async function getCompanyPeers(companyName: string, limit = 4): Promise<(CompanySimilarityMatch & { reason: string })[]> {
  // Use existing salary band logic as the primary signal for now
  const salaryPeers = await getTopSimilarCompaniesBySalaryBands(companyName, limit * 2);

  return salaryPeers
    .map(peer => ({
      ...peer,
      reason: 'Similar compensation structure'
    }))
    .slice(0, limit);
}

export interface JobpeerMatch {
  company: string;
  medianComp: number;
  sampleSize: number;
  slug: string;
  reason: string;
}

export async function getJobPeers(jobTitle: string, limit = 5): Promise<JobpeerMatch[]> {
  // Find companies that hire for this specific job title
  const { data: rows, error } = await supabaseAdmin
    .from('Salary')
    .select('totalComp, companyId, Company!inner(name), Role!inner(title)')
    .eq('Role.title', jobTitle)
    .not('totalComp', 'is', null)
    .limit(2000);

  if (error || !rows?.length) return [];

  const grouped = new Map<string, { companyName: string; totals: number[] }>();

  for (const row of rows as Array<{ totalComp: number; companyId: string; Company?: { name?: string } | { name?: string }[] }>) {
    const totalComp = row.totalComp;
    const relatedCompany = Array.isArray(row.Company) ? row.Company[0] : row.Company;
    const companyName = relatedCompany?.name;

    if (!companyName || typeof totalComp !== 'number') continue;

    const existing = grouped.get(companyName) ?? { companyName, totals: [] };
    existing.totals.push(totalComp);
    grouped.set(companyName, existing);
  }

  const aggregates = Array.from(grouped.values())
    .map(info => ({
      company: info.companyName,
      medianComp: median(info.totals),
      sampleSize: info.totals.length,
      slug: slugifyEntity(info.companyName),
      reason: 'Hires for this role'
    }))
    .filter(item => item.sampleSize >= 2) // Filtering out very thin data
    .sort((a, b) => b.sampleSize - a.sampleSize) // Prioritize volume for "Top Employers"
    .slice(0, limit);

  return aggregates;
}

export interface CityPeerMatch {
  city: string;
  state: string;
  slug: string;
  medianComp: number;
  sampleSize: number;
  reason: string;
}

export async function getCityPeers(city: string, state: string, limit = 6): Promise<CityPeerMatch[]> {
  // Strategy: Find cities in the same state (Regional Peers) AND cities with similar median pay (COL Peers)
  // For simplicity/performance in this iteration, we'll fetch a batch of city stats and filter in memory.

  const { data: rows, error } = await supabaseAdmin
    .from('Salary')
    .select('totalComp, Location!inner(city, state)')
    .not('totalComp', 'is', null)
    .limit(5000);

  if (error || !rows?.length) return [];

  const cityStats = new Map<string, { city: string; state: string; totals: number[] }>();

  for (const row of rows as Array<{ totalComp: number; Location?: { city?: string; state?: string } | { city?: string; state?: string }[] }>) {
    const loc = Array.isArray(row.Location) ? row.Location[0] : row.Location;
    if (!loc?.city || !loc?.state) continue;

    const key = `${loc.city.toLowerCase()}-${loc.state.toLowerCase()}`;
    const existing = cityStats.get(key) ?? { city: loc.city, state: loc.state, totals: [] };
    existing.totals.push(row.totalComp);
    cityStats.set(key, existing);
  }

  const targetKey = `${city.toLowerCase()}-${state.toLowerCase()}`;
  const targetStats = cityStats.get(targetKey);
  const targetMedian = targetStats ? median(targetStats.totals) : 0;

  const peers = Array.from(cityStats.values())
    .filter(c => `${c.city.toLowerCase()}-${c.state.toLowerCase()}` !== targetKey)
    .map(c => {
      const med = median(c.totals);
      let reason = 'Market peer';
      let score = 0;

      if (c.state === state) {
        reason = 'Regional peer';
        score += 10;
      }

      const priceDiff = Math.abs(med - targetMedian);
      if (targetMedian > 0 && priceDiff < targetMedian * 0.15) {
        reason = c.state === state ? 'Regional & Pay peer' : 'Similar pay band';
        score += 5;
      }

      return {
        city: c.city,
        state: c.state,
        slug: `${slugifyEntity(c.city)}-${slugifyEntity(c.state)}`, // Standard city slug format
        medianComp: med,
        sampleSize: c.totals.length,
        reason,
        score
      };
    })
    .filter(p => p.sampleSize >= 3)
    .sort((a, b) => b.score - a.score || b.sampleSize - a.sampleSize)
    .slice(0, limit);

  return peers;
}


export function getComparisonSlug(entityA: string, entityB: string) {
  return ensureComparisonSlug(entityA, entityB);
}

export interface ComparisonMetadata {
  title: string;
  description: string;
  whyPopular: string;
  faqs: { question: string; answer: string }[];
  takeaways: string[];
}

export function generateComparisonMetadata(entityA: string, entityB: string): ComparisonMetadata {
  return {
    title: `${entityA} vs ${entityB} Compensation Comparison`,
    description: `Compare ${entityA} vs ${entityB} salaries, bonuses, and stock grants. See which company pays more for your role and level based on verified data.`,
    whyPopular: `${entityA} and ${entityB} are frequently compared by candidates evaluating offers in the same market sector.`,
    faqs: [
      {
        question: `Does ${entityA} pay more than ${entityB}?`,
        answer: `Compensation varies by role and level. Review the specific salary bands on this page to see which company leads for your target position.`
      },
      {
        question: `How do I negotiate between ${entityA} and ${entityB}?`,
        answer: `Use the median total compensation and percentile data here to anchor your expectations. Competing offers from peer companies like these are your strongest leverage.`
      }
    ],
    takeaways: [
      `Compare the total compensation mix (Base vs. Equity) to understand risk/reward profiles.`,
      `Look at the salary ranges (spread) to gauge how much flexibility each company has for your level.`,
      `Consider recent submission volume as a signal of active hiring and data freshness.`
    ]
  };
}

