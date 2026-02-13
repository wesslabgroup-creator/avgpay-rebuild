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

/**
 * Read-only: returns cached comparison narrative or null.
 * Never triggers LLM generation — safe for use in page renders.
 */
export async function getCachedComparisonAnalysis(entityA: string, entityB: string, slug?: string): Promise<ComparisonAnalysis | null> {
  const comparisonSlug = slug ?? ensureComparisonSlug(entityA, entityB);
  return readCachedComparison(comparisonSlug);
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


// ── Job Similarity Engine ──────────────────────────────────────────────
// getSimilarJobs: deterministic similarity based on salary band overlap
// and job family heuristics (shared keywords in role titles).

export interface SimilarJobMatch {
  jobTitle: string;
  slug: string;
  medianComp: number;
  sampleSize: number;
  similarityScore: number;
  reason: string;
}

interface RoleAggregate {
  roleId: string;
  title: string;
  medianComp: number;
  p25Comp: number;
  p75Comp: number;
  sampleSize: number;
  slug: string;
}

// Heuristic: extract key "family" tokens from a job title
function extractJobFamilyTokens(title: string): string[] {
  const normalized = title.toLowerCase();
  const stopwords = new Set(['of', 'the', 'and', 'a', 'an', 'in', 'for', 'at', 'to', 'or', 'with', 'i', 'ii', 'iii', 'iv', 'v', 'vi']);
  return normalized
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length > 1 && !stopwords.has(t));
}

function jobFamilyOverlap(tokensA: string[], tokensB: string[]): number {
  if (!tokensA.length || !tokensB.length) return 0;
  const setB = new Set(tokensB);
  const shared = tokensA.filter(t => setB.has(t)).length;
  return shared / Math.max(tokensA.length, tokensB.length);
}

export async function getSimilarJobs(jobSlugOrTitle: string, limit = 6, cityFilter?: string): Promise<SimilarJobMatch[]> {
  // Build query — optionally filter by city
  let query = supabaseAdmin
    .from('Salary')
    .select('totalComp, roleId, Role!inner(title), Location!inner(city, state)')
    .not('totalComp', 'is', null)
    .limit(10000);

  if (cityFilter) {
    query = query.ilike('Location.city', cityFilter);
  }

  const { data: rows, error } = await query;
  if (error || !rows?.length) return [];

  // Group salary data by role
  const grouped = new Map<string, { title: string; totals: number[] }>();
  for (const row of rows as Array<{ totalComp: number; roleId: string; Role?: { title?: string } | { title?: string }[] }>) {
    const role = Array.isArray(row.Role) ? row.Role[0] : row.Role;
    if (!role?.title || typeof row.totalComp !== 'number') continue;
    const key = row.roleId;
    const existing = grouped.get(key) ?? { title: role.title, totals: [] };
    existing.totals.push(row.totalComp);
    grouped.set(key, existing);
  }

  // Build role aggregates
  const aggregates: RoleAggregate[] = Array.from(grouped.entries())
    .map(([roleId, info]) => {
      const sorted = [...info.totals].sort((a, b) => a - b);
      return {
        roleId,
        title: info.title,
        medianComp: median(sorted),
        p25Comp: percentile(sorted, 25),
        p75Comp: percentile(sorted, 75),
        sampleSize: sorted.length,
        slug: slugifyEntity(info.title),
      };
    })
    .filter(a => a.sampleSize >= 1);

  // Find the source job
  const normalizedInput = jobSlugOrTitle.toLowerCase().replace(/-/g, ' ');
  const source = aggregates.find(
    a => a.title.toLowerCase() === normalizedInput || a.slug === jobSlugOrTitle.toLowerCase()
  );

  if (!source) {
    // Fallback: return top roles by sample size
    return aggregates
      .sort((a, b) => b.sampleSize - a.sampleSize)
      .slice(0, limit)
      .map(a => ({
        jobTitle: a.title,
        slug: a.slug,
        medianComp: a.medianComp,
        sampleSize: a.sampleSize,
        similarityScore: 50,
        reason: 'Top role by data volume',
      }));
  }

  const sourceTokens = extractJobFamilyTokens(source.title);

  // Score each other role against source
  const scored = aggregates
    .filter(a => a.roleId !== source.roleId)
    .map(target => {
      // Salary band similarity (same formula as company similarity)
      const salaryScore = computeSimilarityScore(
        { companyId: '', companyName: '', ...source, medianComp: source.medianComp, p25Comp: source.p25Comp, p75Comp: source.p75Comp, sampleSize: source.sampleSize },
        { companyId: '', companyName: '', ...target, medianComp: target.medianComp, p25Comp: target.p25Comp, p75Comp: target.p75Comp, sampleSize: target.sampleSize }
      );

      // Job family overlap
      const targetTokens = extractJobFamilyTokens(target.title);
      const familyScore = jobFamilyOverlap(sourceTokens, targetTokens) * 100;

      // Combined: 40% salary similarity + 60% family overlap
      const combinedScore = Number((salaryScore * 0.4 + familyScore * 0.6).toFixed(1));

      let reason = 'Similar compensation band';
      if (familyScore > 50) reason = 'Same job family';
      else if (familyScore > 20 && salaryScore > 70) reason = 'Related role & similar pay';

      return {
        jobTitle: target.title,
        slug: target.slug,
        medianComp: target.medianComp,
        sampleSize: target.sampleSize,
        similarityScore: combinedScore,
        reason,
      };
    })
    .sort((a, b) => b.similarityScore - a.similarityScore);

  return scored.slice(0, limit);
}

// ── Dynamic Compare Data Fetcher ──────────────────────────────────────
// Fetch comparison data for any two entities (job, company, or city)
// with optional city filter

export interface CompareEntityProfile {
  name: string;
  slug: string;
  medianTotalComp: number;
  medianBaseSalary: number;
  medianNonBaseComp: number;
  p25TotalComp: number;
  p75TotalComp: number;
  minTotalComp: number;
  maxTotalComp: number;
  sampleSize: number;
  topLocations: { location: string; sampleSize: number }[];
  topCompanies: { company: string; sampleSize: number }[];
}

type CompareEntityType = 'job' | 'company' | 'city';

function detectEntityType(entity: string): CompareEntityType {
  const jobKeywords = /engineer|manager|director|analyst|developer|designer|scientist|architect|lead|coordinator|specialist|consultant|administrator|intern|vp|head|chief/i;
  const cityPattern = /,\s*[A-Z]{2}$/;
  if (cityPattern.test(entity)) return 'city';
  if (jobKeywords.test(entity)) return 'job';
  return 'company';
}

export async function getCompareProfile(entityName: string, cityFilter?: string): Promise<CompareEntityProfile> {
  const entityType = detectEntityType(entityName);
  const empty: CompareEntityProfile = {
    name: entityName,
    slug: slugifyEntity(entityName),
    medianTotalComp: 0, medianBaseSalary: 0, medianNonBaseComp: 0,
    p25TotalComp: 0, p75TotalComp: 0, minTotalComp: 0, maxTotalComp: 0,
    sampleSize: 0, topLocations: [], topCompanies: [],
  };

  let query = supabaseAdmin
    .from('Salary')
    .select('totalComp, baseSalary, Company!inner(name), Role!inner(title), Location!inner(city, state)')
    .not('totalComp', 'is', null)
    .limit(2000);

  if (entityType === 'company') {
    query = query.ilike('Company.name', entityName);
  } else if (entityType === 'job') {
    query = query.ilike('Role.title', entityName);
  } else {
    const [cityName, state] = entityName.split(',').map(s => s.trim());
    query = query.ilike('Location.city', cityName);
    if (state) query = query.ilike('Location.state', state);
  }

  if (cityFilter && entityType !== 'city') {
    query = query.ilike('Location.city', cityFilter);
  }

  const { data, error } = await query;
  if (error || !data?.length) return empty;

  type SalaryRow = {
    totalComp: number;
    baseSalary: number | null;
    Company?: { name?: string } | { name?: string }[];
    Role?: { title?: string } | { title?: string }[];
    Location?: { city?: string; state?: string } | { city?: string; state?: string }[];
  };

  const records = data as unknown as SalaryRow[];

  const totalCompValues = records.map(r => r.totalComp).filter((v): v is number => typeof v === 'number');
  const baseValues = records.map(r => r.baseSalary ?? 0).filter((v): v is number => typeof v === 'number');

  if (!totalCompValues.length) return empty;

  const sorted = [...totalCompValues].sort((a, b) => a - b);
  const medTotal = median(totalCompValues);
  const medBase = median(baseValues);

  // Top locations
  const locCounts = new Map<string, number>();
  for (const r of records) {
    const loc = Array.isArray(r.Location) ? r.Location[0] : r.Location;
    if (!loc?.city) continue;
    const label = loc.state ? `${loc.city}, ${loc.state}` : loc.city;
    locCounts.set(label, (locCounts.get(label) ?? 0) + 1);
  }

  // Top companies
  const compCounts = new Map<string, number>();
  for (const r of records) {
    const comp = Array.isArray(r.Company) ? r.Company[0] : r.Company;
    if (!comp?.name) continue;
    compCounts.set(comp.name, (compCounts.get(comp.name) ?? 0) + 1);
  }

  return {
    name: entityName,
    slug: slugifyEntity(entityName),
    medianTotalComp: medTotal,
    medianBaseSalary: medBase,
    medianNonBaseComp: Math.max(medTotal - medBase, 0),
    p25TotalComp: percentile(sorted, 25),
    p75TotalComp: percentile(sorted, 75),
    minTotalComp: sorted[0] ?? 0,
    maxTotalComp: sorted[sorted.length - 1] ?? 0,
    sampleSize: totalCompValues.length,
    topLocations: Array.from(locCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([location, sampleSize]) => ({ location, sampleSize })),
    topCompanies: Array.from(compCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([company, sampleSize]) => ({ company, sampleSize })),
  };
}

// ── Confidence & Indexing for Compare Pages ───────────────────────────

export interface ComparePageConfidence {
  totalSampleSize: number;
  confidenceScore: number;
  shouldIndex: boolean;
  confidenceLabel: 'high' | 'moderate' | 'limited' | 'insufficient';
}

export function computeCompareConfidence(sampleA: number, sampleB: number): ComparePageConfidence {
  const total = sampleA + sampleB;
  const minSide = Math.min(sampleA, sampleB);

  // Score: based on total and balance between sides
  let score = 0;
  if (total >= 100) score += 40;
  else if (total >= 50) score += 30;
  else if (total >= 20) score += 20;
  else if (total >= 10) score += 10;

  if (minSide >= 20) score += 30;
  else if (minSide >= 10) score += 20;
  else if (minSide >= 5) score += 10;

  // Both sides need data
  if (sampleA > 0 && sampleB > 0) score += 30;
  else score += 0;

  const confidenceLabel: ComparePageConfidence['confidenceLabel'] =
    score >= 80 ? 'high' :
    score >= 50 ? 'moderate' :
    score >= 25 ? 'limited' :
    'insufficient';

  // Index if total >= 20 and both sides have data
  const shouldIndex = total >= 20 && sampleA > 0 && sampleB > 0;

  return { totalSampleSize: total, confidenceScore: score, shouldIndex, confidenceLabel };
}

// ── Popular Comparisons (Dynamic) ─────────────────────────────────────

export interface PopularComparison {
  entityA: string;
  entityB: string;
  slug: string;
  type: 'company' | 'job';
  totalSampleSize: number;
}

export async function getPopularComparisons(limit = 12): Promise<PopularComparison[]> {
  // Fetch top entities by data volume and pair them
  const { data: companyRows } = await supabaseAdmin
    .from('Salary')
    .select('Company!inner(name)')
    .not('totalComp', 'is', null)
    .limit(5000);

  const { data: roleRows } = await supabaseAdmin
    .from('Salary')
    .select('Role!inner(title)')
    .not('totalComp', 'is', null)
    .limit(5000);

  // Count companies
  const companyCounts = new Map<string, number>();
  for (const row of (companyRows || []) as Array<{ Company?: { name?: string } | { name?: string }[] }>) {
    const comp = Array.isArray(row.Company) ? row.Company[0] : row.Company;
    if (!comp?.name) continue;
    companyCounts.set(comp.name, (companyCounts.get(comp.name) ?? 0) + 1);
  }

  // Count roles
  const roleCounts = new Map<string, number>();
  for (const row of (roleRows || []) as Array<{ Role?: { title?: string } | { title?: string }[] }>) {
    const role = Array.isArray(row.Role) ? row.Role[0] : row.Role;
    if (!role?.title) continue;
    roleCounts.set(role.title, (roleCounts.get(role.title) ?? 0) + 1);
  }

  const topCompanies = Array.from(companyCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  const topRoles = Array.from(roleCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  const comparisons: PopularComparison[] = [];

  // Pair top companies
  for (let i = 0; i < topCompanies.length && comparisons.length < limit; i++) {
    for (let j = i + 1; j < topCompanies.length && comparisons.length < limit; j++) {
      const [nameA, countA] = topCompanies[i];
      const [nameB, countB] = topCompanies[j];
      comparisons.push({
        entityA: nameA,
        entityB: nameB,
        slug: ensureComparisonSlug(nameA, nameB),
        type: 'company',
        totalSampleSize: countA + countB,
      });
    }
  }

  // Pair top roles
  for (let i = 0; i < topRoles.length && comparisons.length < limit * 2; i++) {
    for (let j = i + 1; j < topRoles.length && comparisons.length < limit * 2; j++) {
      const [titleA, countA] = topRoles[i];
      const [titleB, countB] = topRoles[j];
      comparisons.push({
        entityA: titleA,
        entityB: titleB,
        slug: ensureComparisonSlug(titleA, titleB),
        type: 'job',
        totalSampleSize: countA + countB,
      });
    }
  }

  // Sort by total data and return top N
  return comparisons
    .sort((a, b) => b.totalSampleSize - a.totalSampleSize)
    .slice(0, limit);
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
  // Simple heuristic to detect type
  const isCity = (s: string) => s.includes(',') && /[A-Z]{2}/.test(s); // e.g. "Austin, TX"
  const isJob = (s: string) => /Engineer|Manager|Director|Analyst|Developer|Designer/i.test(s) && !isCity(s);

  let type = 'Company';
  if (isCity(entityA) || isCity(entityB)) type = 'City';
  else if (isJob(entityA) || isJob(entityB)) type = 'Job';

  if (type === 'City') {
    return {
      title: `${entityA} vs ${entityB} Cost of Living & Salary Comparison`,
      description: `Compare salaries and cost of living between ${entityA} vs ${entityB}. See where your paycheck goes further based on location-adjusted compensation data.`,
      whyPopular: `${entityA} and ${entityB} are common relocation options for tech professionals considering detailed cost-of-living adjustments.`,
      faqs: [
        {
          question: `Is the cost of living higher in ${entityA} or ${entityB}?`,
          answer: `Salary data suggests distinct market rates. Review the median total compensation breakdown to see which location offers better purchasing power for your role.`
        },
        {
          question: `Which city pays more: ${entityA} or ${entityB}?`,
          answer: `While gross salaries may differ, consider the 'effective' take-home pay after factoring in state taxes and housing costs in ${entityA} vs ${entityB}.`
        }
      ],
      takeaways: [
        `Compare not just base salary but total compensation locally available in each market.`,
        `Consider remote work opportunities that might allow you to earn ${entityA} rates while living in a lower cost area.`,
        `Look at the volume of data points to gauge the activity level of the tech scene in each city.`
      ]
    };
  }

  if (type === 'Job') {
    return {
      title: `${entityA} vs ${entityB} Salary & Career Path Comparison`,
      description: `Compare ${entityA} vs ${entityB} compensation packages. Understand the career trajectory, pay ceiling, and demand for these roles.`,
      whyPopular: `Professionals often evaluate the switch between ${entityA} and ${entityB} to maximize earnings and career growth.`,
      faqs: [
        {
          question: `Does ${entityA} pay more than ${entityB}?`,
          answer: `Generally, compensation bands vary by specialization. Check the median and 75th percentile data on this page to see the earnings potential for each role.`
        },
        {
          question: `Is it hard to switch from ${entityA} to ${entityB}?`,
          answer: `Many skills overlap. Compare the 'Skills & Requirements' trends implies by the top paying employers for these roles.`
        }
      ],
      takeaways: [
        `Review the spread between the 25th and 75th percentiles to understand the pay range width for each role.`,
        `Consider the equity component, as some roles (like ${entityA}) may rely more heavily on stock grants than others.`,
        `Check the hiring volume to see which role has more open opportunities in the current market.`
      ]
    };
  }

  // Default to Company
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

