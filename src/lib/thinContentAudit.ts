import { supabaseAdmin } from '@/lib/supabaseClient';
import { computeThinContentScore, type ThinContentSignals } from '@/lib/thinContentScoring';
import { hasRenderableAnalysis } from '@/lib/enrichment';

interface BaseEntity {
  id: string;
  analysis?: unknown;
  enrichmentStatus?: string;
}

interface EntityRiskDetail {
  id: string;
  name: string;
  score: number;
  riskLevel: string;
  issues: string[];
  submissionCount: number;
  hasAnalysis: boolean;
  enrichmentPriority: number;
}

interface EntityRiskSummary {
  entityType: 'Job' | 'Company' | 'City';
  totalEntities: number;
  thinContentRisk: number;
  highRisk: number;
  critical: number;
  healthy: number;
  averageScore: number;
  topRisks: EntityRiskDetail[];
}

async function computeDetailedRiskForEntities(
  entityType: 'Job' | 'Company' | 'City',
  entities: BaseEntity[],
  salaryField: 'roleId' | 'companyId' | 'locationId',
  nameField: 'title' | 'name' | 'city'
): Promise<EntityRiskSummary> {
  const details: EntityRiskDetail[] = [];
  let totalScore = 0;

  for (const entity of entities) {
    const { count } = await supabaseAdmin
      .from('Salary')
      .select('id', { count: 'exact', head: true })
      .eq(salaryField, entity.id);

    const submissions = count ?? 0;
    const entityRecord = entity as Record<string, unknown>;
    const entityName = String(entityRecord[nameField] || entity.id);
    const analysisPresent = hasRenderableAnalysis(entity.analysis, entityType);
    const analysisKeyCount = analysisPresent && typeof entity.analysis === 'object'
      ? Object.keys(entity.analysis as Record<string, unknown>).length
      : 0;

    // Build thin content signals for this entity
    const signals: ThinContentSignals = {
      submissionCount: submissions,
      hasAnalysis: analysisPresent,
      analysisKeyCount,
      hasFaq: submissions >= 3, // FAQs are auto-generated when we have data
      faqCount: submissions >= 3 ? 5 : 0,
      internalLinkCount: Math.min(submissions, 10),
      hasDatasetSchema: true,  // All entity pages now have Dataset schema
      hasFaqSchema: submissions >= 3,
      relatedEntityCount: Math.min(submissions > 0 ? 3 : 0, 5),
      hasPercentileData: submissions >= 5,
      hasCompMixData: submissions >= 3,
      dataDiversityCount: Math.min(submissions, 10),
      hasExternalLinks: true,  // External links are now included on all pages
      hasDisclaimer: true,     // Disclaimer is now included on all pages
      entityType,
    };

    const score = computeThinContentScore(signals);
    totalScore += score.score;

    details.push({
      id: entity.id,
      name: entityName,
      score: score.score,
      riskLevel: score.riskLevel,
      issues: score.issues,
      submissionCount: submissions,
      hasAnalysis: analysisPresent,
      enrichmentPriority: score.enrichmentPriority,
    });
  }

  const sorted = details.sort((a, b) => a.score - b.score);

  return {
    entityType,
    totalEntities: entities.length,
    thinContentRisk: details.filter((d) => d.riskLevel === 'medium' || d.riskLevel === 'high' || d.riskLevel === 'critical').length,
    highRisk: details.filter((d) => d.riskLevel === 'high' || d.riskLevel === 'critical').length,
    critical: details.filter((d) => d.riskLevel === 'critical').length,
    healthy: details.filter((d) => d.riskLevel === 'healthy').length,
    averageScore: entities.length > 0 ? Math.round(totalScore / entities.length) : 0,
    topRisks: sorted.slice(0, 10),
  };
}

export async function computeThinContentRiskSummary() {
  const [jobs, companies, cities] = await Promise.all([
    supabaseAdmin.from('Role').select('id,title,analysis,enrichmentStatus').limit(250),
    supabaseAdmin.from('Company').select('id,name,analysis,enrichmentStatus').limit(250),
    supabaseAdmin.from('Location').select('id,city,state,analysis,enrichmentStatus').limit(250),
  ]);

  const [jobRisk, companyRisk, cityRisk] = await Promise.all([
    computeDetailedRiskForEntities('Job', (jobs.data || []) as BaseEntity[], 'roleId', 'title'),
    computeDetailedRiskForEntities('Company', (companies.data || []) as BaseEntity[], 'companyId', 'name'),
    computeDetailedRiskForEntities('City', (cities.data || []) as BaseEntity[], 'locationId', 'city'),
  ]);

  const allEntities = jobRisk.totalEntities + companyRisk.totalEntities + cityRisk.totalEntities;
  const allThin = jobRisk.thinContentRisk + companyRisk.thinContentRisk + cityRisk.thinContentRisk;
  const allHealthy = jobRisk.healthy + companyRisk.healthy + cityRisk.healthy;

  return {
    generatedAt: new Date().toISOString(),
    sampleLimitPerEntityType: 250,
    overallHealth: {
      totalEntities: allEntities,
      thinContentRisk: allThin,
      thinContentPct: allEntities > 0 ? Math.round((allThin / allEntities) * 100) : 0,
      healthyPct: allEntities > 0 ? Math.round((allHealthy / allEntities) * 100) : 0,
    },
    summary: [jobRisk, companyRisk, cityRisk],
  };
}
