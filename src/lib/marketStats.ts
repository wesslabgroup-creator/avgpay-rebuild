import { supabaseAdmin } from '@/lib/supabaseClient';

export interface EntityMetricsScope {
  company?: string;
  role?: string;
  location?: string;
  level?: string;
  entityType?: 'Company' | 'City' | 'Job';
  entityName?: string;
  state?: string;
}

interface SalaryPoint {
  totalComp: number;
  baseSalary: number | null;
  equity: number | null;
  bonus: number | null;
}

export interface AggregateMetrics {
  sampleSize: number;
  avgTotalComp: number;
  medianTotalComp: number;
  avgBaseMixPct: number;
  avgEquityMixPct: number;
  avgBonusMixPct: number;
  inferred401kMatchPct: number | null;
  inferredTaxBurdenIndex: number;
  cityAdjustedCostIndex: number;
}

export interface EntityMetricsSnapshot {
  scope: EntityMetricsScope;
  metrics: AggregateMetrics;
  generatedAt: string;
}

const NO_INCOME_TAX_STATES = new Set([
  'AK', 'FL', 'NV', 'NH', 'SD', 'TN', 'TX', 'WA', 'WY',
  'ALASKA', 'FLORIDA', 'NEVADA', 'NEW HAMPSHIRE', 'SOUTH DAKOTA',
  'TENNESSEE', 'TEXAS', 'WASHINGTON', 'WYOMING',
]);

const CITY_COST_INDEX: Record<string, number> = {
  'san francisco': 1.35,
  'new york': 1.28,
  'seattle': 1.18,
  'los angeles': 1.22,
  'boston': 1.2,
  'austin': 1.08,
  'chicago': 1.07,
  'atlanta': 1.03,
  'miami': 1.1,
  'denver': 1.12,
};

function toMedian(nums: number[]): number {
  if (nums.length === 0) return 0;
  const sorted = [...nums].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    return Math.round((sorted[mid - 1] + sorted[mid]) / 2);
  }
  return sorted[mid];
}

function toAvg(nums: number[]): number {
  if (nums.length === 0) return 0;
  return Math.round(nums.reduce((sum, n) => sum + n, 0) / nums.length);
}

function normalizeCity(location?: string): string {
  if (!location) return '';
  return location.split(',')[0].trim().toLowerCase();
}

function inferTaxBurdenIndex(state?: string): number {
  if (!state) return 1;
  const normalized = state.trim().toUpperCase();
  return NO_INCOME_TAX_STATES.has(normalized) ? 0.95 : 1.07;
}

function inferCostIndex(location?: string): number {
  const city = normalizeCity(location);
  if (!city) return 1;
  return CITY_COST_INDEX[city] ?? 1;
}

function formatCurrency(value: number): string {
  return `$${Math.round(value).toLocaleString()}`;
}

function formatPct(value: number): string {
  return `${value.toFixed(1)}%`;
}

function buildFilters(scope: EntityMetricsScope) {
  const company = scope.company || (scope.entityType === 'Company' ? scope.entityName : undefined);
  const role = scope.role || (scope.entityType === 'Job' ? scope.entityName : undefined);
  const location = scope.location || (scope.entityType === 'City' ? scope.entityName : undefined);

  return { company, role, location, level: scope.level };
}

export async function computeAggregateMetrics(scope: EntityMetricsScope): Promise<EntityMetricsSnapshot> {
  const { company, role, location, level } = buildFilters(scope);

  let query = supabaseAdmin
    .from('Salary')
    .select('totalComp, baseSalary, equity, bonus, level, Company!inner(name), Role!inner(title), Location!inner(city, state)')
    .limit(5000);

  if (company) query = query.ilike('Company.name', company);
  if (role) query = query.ilike('Role.title', role);

  const { data } = await query;
  const rawRows = (data || []) as Array<SalaryPoint & {
    level?: string;
    Location?: { city?: string; state?: string };
  }>;

  const locationCity = normalizeCity(location);
  const filtered = rawRows.filter((row) => {
    const levelMatch = level
      ? ((row.level || '').toLowerCase().includes(level.toLowerCase()) || level.toLowerCase().includes((row.level || '').toLowerCase()))
      : true;

    const cityMatch = locationCity
      ? (row.Location?.city || '').toLowerCase().includes(locationCity)
      : true;

    return levelMatch && cityMatch;
  });

  const points = filtered.length > 0 ? filtered : rawRows;

  const totals = points.map((p) => p.totalComp || 0).filter(Boolean);
  const baseMix = points.map((p) => p.totalComp > 0 ? ((p.baseSalary || 0) / p.totalComp) * 100 : 0);
  const equityMix = points.map((p) => p.totalComp > 0 ? ((p.equity || 0) / p.totalComp) * 100 : 0);
  const bonusMix = points.map((p) => p.totalComp > 0 ? ((p.bonus || 0) / p.totalComp) * 100 : 0);

  const state = scope.state || points[0]?.Location?.state;

  const metrics: AggregateMetrics = {
    sampleSize: points.length,
    avgTotalComp: toAvg(totals),
    medianTotalComp: toMedian(totals),
    avgBaseMixPct: Number((baseMix.length ? baseMix.reduce((a, b) => a + b, 0) / baseMix.length : 0).toFixed(1)),
    avgEquityMixPct: Number((equityMix.length ? equityMix.reduce((a, b) => a + b, 0) / equityMix.length : 0).toFixed(1)),
    avgBonusMixPct: Number((bonusMix.length ? bonusMix.reduce((a, b) => a + b, 0) / bonusMix.length : 0).toFixed(1)),
    inferred401kMatchPct: null,
    inferredTaxBurdenIndex: inferTaxBurdenIndex(state),
    cityAdjustedCostIndex: inferCostIndex(location),
  };

  return {
    scope: { ...scope, state },
    metrics,
    generatedAt: new Date().toISOString(),
  };
}

export function buildEntityMetricsContextBlock(snapshot: EntityMetricsSnapshot, label: string): string {
  const { metrics } = snapshot;

  return [
    `### ${label} Metrics Snapshot`,
    `- Sample size: ${metrics.sampleSize}`,
    `- Median total comp: ${formatCurrency(metrics.medianTotalComp)}`,
    `- Average total comp: ${formatCurrency(metrics.avgTotalComp)}`,
    `- Base / Equity / Bonus mix: ${formatPct(metrics.avgBaseMixPct)} / ${formatPct(metrics.avgEquityMixPct)} / ${formatPct(metrics.avgBonusMixPct)}`,
    `- Benefits proxy (401k match): ${metrics.inferred401kMatchPct === null ? 'not available in current dataset' : formatPct(metrics.inferred401kMatchPct)}`,
    `- Tax burden index (1.00 = neutral): ${metrics.inferredTaxBurdenIndex.toFixed(2)}`,
    `- City-adjusted cost index (1.00 = baseline): ${metrics.cityAdjustedCostIndex.toFixed(2)}`,
  ].join('\n');
}

export function buildComparisonMetricsContextBlock(
  entityA: EntityMetricsSnapshot,
  entityB: EntityMetricsSnapshot,
  labelA: string,
  labelB: string
): string {
  const a = entityA.metrics;
  const b = entityB.metrics;

  const deltaMedian = a.medianTotalComp - b.medianTotalComp;
  const deltaAvg = a.avgTotalComp - b.avgTotalComp;
  const deltaBase = a.avgBaseMixPct - b.avgBaseMixPct;
  const deltaEquity = a.avgEquityMixPct - b.avgEquityMixPct;
  const deltaBonus = a.avgBonusMixPct - b.avgBonusMixPct;
  const deltaTax = a.inferredTaxBurdenIndex - b.inferredTaxBurdenIndex;
  const deltaCost = a.cityAdjustedCostIndex - b.cityAdjustedCostIndex;

  const sign = (n: number) => (n >= 0 ? '+' : '');

  return [
    '### Comparison Context: Entity A metrics vs Entity B metrics',
    buildEntityMetricsContextBlock(entityA, `Entity A (${labelA})`),
    buildEntityMetricsContextBlock(entityB, `Entity B (${labelB})`),
    '#### Explicit Deltas (A - B)',
    `- Median total comp delta: ${sign(deltaMedian)}${formatCurrency(deltaMedian)}`,
    `- Average total comp delta: ${sign(deltaAvg)}${formatCurrency(deltaAvg)}`,
    `- Base mix delta: ${sign(deltaBase)}${deltaBase.toFixed(1)} pts`,
    `- Equity mix delta: ${sign(deltaEquity)}${deltaEquity.toFixed(1)} pts`,
    `- Bonus mix delta: ${sign(deltaBonus)}${deltaBonus.toFixed(1)} pts`,
    `- Tax burden index delta: ${sign(deltaTax)}${deltaTax.toFixed(2)}`,
    `- City-adjusted cost index delta: ${sign(deltaCost)}${deltaCost.toFixed(2)}`,
    'Use these deltas to explain practical trade-offs, not just absolute rankings.',
  ].join('\n');
}
