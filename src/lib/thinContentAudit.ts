import { supabaseAdmin } from '@/lib/supabaseClient';

interface BaseEntity {
  id: string;
  analysis?: unknown;
  enrichmentStatus?: string;
}

function hasAnalysis(analysis: unknown) {
  return !!analysis && typeof analysis === 'object' && Object.keys(analysis as Record<string, unknown>).length > 0;
}

async function computeRiskForEntities(entityType: 'Job' | 'Company' | 'City', entities: BaseEntity[], salaryField: 'roleId' | 'companyId' | 'locationId') {
  let thinCount = 0;
  let highRiskCount = 0;

  for (const entity of entities) {
    const { count } = await supabaseAdmin
      .from('Salary')
      .select('id', { count: 'exact', head: true })
      .eq(salaryField, entity.id);

    const submissions = count ?? 0;
    const analysisPresent = hasAnalysis(entity.analysis);

    if (submissions < 10 && !analysisPresent) thinCount += 1;
    if (submissions < 5 && !analysisPresent) highRiskCount += 1;
  }

  return {
    entityType,
    totalEntities: entities.length,
    thinContentRisk: thinCount,
    highRisk: highRiskCount,
  };
}

export async function computeThinContentRiskSummary() {
  const [jobs, companies, cities] = await Promise.all([
    supabaseAdmin.from('Role').select('id,analysis,enrichmentStatus').limit(250),
    supabaseAdmin.from('Company').select('id,analysis,enrichmentStatus').limit(250),
    supabaseAdmin.from('Location').select('id,analysis,enrichmentStatus').limit(250),
  ]);

  const [jobRisk, companyRisk, cityRisk] = await Promise.all([
    computeRiskForEntities('Job', (jobs.data || []) as BaseEntity[], 'roleId'),
    computeRiskForEntities('Company', (companies.data || []) as BaseEntity[], 'companyId'),
    computeRiskForEntities('City', (cities.data || []) as BaseEntity[], 'locationId'),
  ]);

  return {
    generatedAt: new Date().toISOString(),
    sampleLimitPerEntityType: 250,
    summary: [jobRisk, companyRisk, cityRisk],
  };
}
