import { genAI } from '@/lib/geminiClient';
import { getComparisonBySlug } from '@/app/compare/data/curated-comparisons';
import { supabaseAdmin } from '@/lib/supabaseClient';

export type ComparisonEntityType = 'Company' | 'Role' | 'Location';

export interface ComparisonEntity {
  id: string;
  type: ComparisonEntityType;
  name: string;
  slug: string;
}

export interface ComparisonAnalysisRecord {
  id: string;
  entityAType: string;
  entityAId: string;
  entityAName: string;
  entityASlug: string;
  entityBType: string;
  entityBId: string;
  entityBName: string;
  entityBSlug: string;
  statsSnapshot: Record<string, unknown>;
  insights: Record<string, string>;
  status: string;
  generatedAt: string;
}

const COMPARISON_STALE_MS = 1000 * 60 * 60 * 24 * 14;

function canonicalizePair(entityA: ComparisonEntity, entityB: ComparisonEntity) {
  const leftKey = `${entityA.type}:${entityA.slug}`;
  const rightKey = `${entityB.type}:${entityB.slug}`;

  if (leftKey <= rightKey) {
    return { primary: entityA, secondary: entityB };
  }

  return { primary: entityB, secondary: entityA };
}

function median(values: number[]) {
  if (values.length === 0) return null;

  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);

  if (sorted.length % 2 === 0) {
    return Math.round((sorted[middle - 1] + sorted[middle]) / 2);
  }

  return sorted[middle];
}

async function getEntitySalarySnapshot(entity: ComparisonEntity) {
  if (entity.type !== 'Company') {
    return {
      sampleSize: 0,
      totalCompMedian: null,
      totalCompAvg: null,
      baseMedian: null,
      equityMedian: null,
      bonusMedian: null,
    };
  }

  const { data, error } = await supabaseAdmin
    .from('Salary')
    .select('baseSalary, equity, bonus, totalComp')
    .eq('companyId', entity.id)
    .limit(2000);

  if (error || !data) {
    return {
      sampleSize: 0,
      totalCompMedian: null,
      totalCompAvg: null,
      baseMedian: null,
      equityMedian: null,
      bonusMedian: null,
    };
  }

  const totals = data.map((row) => row.totalComp).filter((value): value is number => typeof value === 'number');
  const bases = data.map((row) => row.baseSalary).filter((value): value is number => typeof value === 'number');
  const equities = data.map((row) => row.equity ?? 0).filter((value): value is number => typeof value === 'number');
  const bonuses = data.map((row) => row.bonus ?? 0).filter((value): value is number => typeof value === 'number');

  return {
    sampleSize: totals.length,
    totalCompMedian: median(totals),
    totalCompAvg: totals.length > 0 ? Math.round(totals.reduce((a, b) => a + b, 0) / totals.length) : null,
    baseMedian: median(bases),
    equityMedian: median(equities),
    bonusMedian: median(bonuses),
  };
}

async function generateComparisonInsights(
  entityA: ComparisonEntity,
  entityB: ComparisonEntity,
  statsSnapshot: Record<string, unknown>
): Promise<Record<string, string>> {
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    generationConfig: {
      temperature: 0.3,
      responseMimeType: 'application/json',
    },
  });

  const prompt = `You are an experienced compensation analyst.
Generate concise, high-signal comparison analysis in JSON only.

Entity A: ${entityA.name} (${entityA.type})
Entity B: ${entityB.name} (${entityB.type})
Stats Snapshot: ${JSON.stringify(statsSnapshot)}

Return valid JSON with exactly these keys:
- summary
- compensation_delta
- risk_reward_profile
- negotiation_angle
Each value should be 2 sentences max, no markdown.`;

  const result = await model.generateContent(prompt);
  const responseText = result.response.text();

  return JSON.parse(responseText) as Record<string, string>;
}

export async function getOrGenerateComparisonAnalysis(
  entityA: ComparisonEntity,
  entityB: ComparisonEntity
): Promise<ComparisonAnalysisRecord> {
  const { primary, secondary } = canonicalizePair(entityA, entityB);

  const { data: existing } = await supabaseAdmin
    .from('Comparison')
    .select('*')
    .eq('entityAType', primary.type)
    .eq('entityAId', primary.id)
    .eq('entityBType', secondary.type)
    .eq('entityBId', secondary.id)
    .maybeSingle();

  const isStale = !existing?.generatedAt
    || (Date.now() - new Date(existing.generatedAt).getTime() > COMPARISON_STALE_MS)
    || existing.status !== 'completed';

  if (existing && !isStale) {
    return existing as ComparisonAnalysisRecord;
  }

  const statsSnapshot = {
    entityA: await getEntitySalarySnapshot(primary),
    entityB: await getEntitySalarySnapshot(secondary),
  };

  let insights: Record<string, string> = {
    summary: `${primary.name} and ${secondary.name} have sparse compensation data. Add more salary entries for higher-confidence benchmarking.`,
    compensation_delta: 'Current sample is too limited to claim a stable compensation gap.',
    risk_reward_profile: 'Use role scope and level calibration as primary decision factors until more data accrues.',
    negotiation_angle: 'Anchor on written competing offers and request level-based compensation bands.',
  };
  let status = 'completed';

  try {
    insights = await generateComparisonInsights(primary, secondary, statsSnapshot);
  } catch (error) {
    console.error('Gemini comparison generation failed:', error);
    status = 'failed';
  }

  const payload = {
    entityAType: primary.type,
    entityAId: primary.id,
    entityAName: primary.name,
    entityASlug: primary.slug,
    entityBType: secondary.type,
    entityBId: secondary.id,
    entityBName: secondary.name,
    entityBSlug: secondary.slug,
    statsSnapshot,
    insights,
    status,
    generatedAt: new Date().toISOString(),
  };

  const { data: saved, error: upsertError } = await supabaseAdmin
    .from('Comparison')
    .upsert(payload, {
      onConflict: 'entityAType,entityAId,entityBType,entityBId',
    })
    .select('*')
    .single();

  if (upsertError) {
    throw new Error(`Failed to save comparison analysis: ${upsertError.message}`);
  }

  return saved as ComparisonAnalysisRecord;
}

export async function resolveComparisonEntitiesFromSlug(slug: string): Promise<{
  entityA: ComparisonEntity;
  entityB: ComparisonEntity;
  role?: ComparisonEntity;
} | null> {
  const [leftPart, rightPart] = slug.split('-vs-');

  if (!leftPart || !rightPart) {
    return null;
  }

  const { data: companyB } = await supabaseAdmin
    .from('Company')
    .select('id, name, slug')
    .eq('slug', rightPart)
    .maybeSingle();

  if (!companyB) {
    return null;
  }

  const { data: companies } = await supabaseAdmin
    .from('Company')
    .select('id, name, slug');

  const companyA = companies?.find((company) => leftPart === company.slug || leftPart.endsWith(`-${company.slug}`));
  if (!companyA) {
    return null;
  }

  const roleSlug = leftPart === companyA.slug
    ? ''
    : leftPart.slice(0, -(companyA.slug.length + 1));

  let role: ComparisonEntity | undefined;
  if (roleSlug) {
    const { data: roleData } = await supabaseAdmin
      .from('Role')
      .select('id, title, slug')
      .eq('slug', roleSlug)
      .maybeSingle();

    if (roleData) {
      role = {
        id: roleData.id,
        type: 'Role',
        name: roleData.title,
        slug: roleData.slug,
      };
    }
  }

  return {
    entityA: {
      id: companyA.id,
      type: 'Company',
      name: companyA.name,
      slug: companyA.slug,
    },
    entityB: {
      id: companyB.id,
      type: 'Company',
      name: companyB.name,
      slug: companyB.slug,
    },
    role,
  };
}

export async function resolveComparisonTitle(slug: string): Promise<string> {
  const curated = getComparisonBySlug(slug);
  if (curated) {
    return curated.title;
  }

  const entities = await resolveComparisonEntitiesFromSlug(slug);
  if (!entities) {
    return 'Comparison Not Found';
  }

  if (entities.role) {
    return `${entities.role.name}: ${entities.entityA.name} vs ${entities.entityB.name}`;
  }

  return `${entities.entityA.name} vs ${entities.entityB.name}`;
}
