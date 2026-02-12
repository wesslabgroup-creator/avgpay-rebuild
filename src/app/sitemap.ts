import { MetadataRoute } from 'next';
import { CURATED_COMPARISONS } from '@/app/compare/data/curated-comparisons';
import { supabaseAdmin } from '@/lib/supabaseClient';
import { evaluateIndexingEligibility, shouldTriggerEnrichment } from '@/lib/seo';
import { queueEnrichment } from '@/lib/enrichment';

const baseUrl = 'https://avgpay.com';

const staticRoutes = [
  '', '/analyze-offer', '/analyze-salary', '/salaries', '/companies', '/compare', '/guides', '/tools', '/about', '/privacy', '/methodology', '/pricing', '/contribute', '/submit', '/contact', '/terms', '/data-policy', '/editorial-policy'
];

const guides = ['pm-compensation-2026', 'negotiation', 'equity', 'swe-compensation-2026', 'remote-pay', 'startup-vs-bigtech'];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes = staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? ('daily' as const) : ('weekly' as const),
    priority: route === '' ? 1 : 0.8,
  }));

  const guideRoutes = guides.map((slug) => ({
    url: `${baseUrl}/guides/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  const comparisons = CURATED_COMPARISONS.map((comparison) => ({
    url: `${baseUrl}/compare/${comparison.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.85,
  }));

  const entityRoutes: MetadataRoute.Sitemap = [];

  const [roles, companies, cities] = await Promise.all([
    supabaseAdmin.from('Role').select('id,title,analysis,analysisGeneratedAt').limit(1000),
    supabaseAdmin.from('Company').select('id,name,analysis,analysisGeneratedAt').limit(1000),
    supabaseAdmin.from('Location').select('id,city,state,slug,analysis,analysisGeneratedAt').limit(1000),
  ]);

  if (roles.data) {
    for (const role of roles.data) {
      const { count } = await supabaseAdmin.from('Salary').select('id', { count: 'exact', head: true }).eq('roleId', role.id);
      const evaluation = evaluateIndexingEligibility({ entityType: 'Job', entityName: role.title, salarySubmissionCount: count || 0, hasRenderableAnalysis: !!role.analysis });
      if (evaluation.indexable) entityRoutes.push({ url: `${baseUrl}/jobs/${encodeURIComponent(role.title)}`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.75 });
      if (shouldTriggerEnrichment({ hasRenderableAnalysis: !!role.analysis, analysisGeneratedAt: role.analysisGeneratedAt, salarySubmissionCount: count || 0 })) {
        await queueEnrichment('Job', role.id, role.title);
      }
    }
  }

  if (companies.data) {
    for (const company of companies.data) {
      const { count } = await supabaseAdmin.from('Salary').select('id', { count: 'exact', head: true }).eq('companyId', company.id);
      const evaluation = evaluateIndexingEligibility({ entityType: 'Company', entityName: company.name, salarySubmissionCount: count || 0, hasRenderableAnalysis: !!company.analysis });
      if (evaluation.indexable) entityRoutes.push({ url: `${baseUrl}/company/${encodeURIComponent(company.name)}`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.75 });
    }
  }

  if (cities.data) {
    for (const city of cities.data) {
      const { count } = await supabaseAdmin.from('Salary').select('id', { count: 'exact', head: true }).eq('locationId', city.id);
      const evaluation = evaluateIndexingEligibility({ entityType: 'City', entityName: `${city.city}, ${city.state}`, salarySubmissionCount: count || 0, hasRenderableAnalysis: !!city.analysis });
      if (evaluation.indexable) entityRoutes.push({ url: `${baseUrl}/salaries/city/${city.slug}`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.75 });
    }
  }

  return [...routes, ...guideRoutes, ...comparisons, ...entityRoutes];
}
