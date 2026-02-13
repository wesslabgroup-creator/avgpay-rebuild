import { MetadataRoute } from 'next';
import { CURATED_COMPARISONS } from '@/app/compare/data/curated-comparisons';
import { supabaseAdmin } from '@/lib/supabaseClient';
import { evaluateIndexingEligibility } from '@/lib/seo';
import { thinContentScoreToSitemapPriority, hasMinimumViableContent } from '@/lib/thinContentScoring';
import { getPopularComparisons } from '@/lib/comparisonEngine';

const baseUrl = 'https://avgpay.com';

const staticRoutes = [
  '', '/analyze-offer', '/analyze-salary', '/salaries', '/companies', '/compare', '/guides', '/tools', '/about', '/privacy', '/methodology', '/pricing', '/contribute', '/submit', '/contact', '/terms', '/data-policy', '/editorial-policy'
];

const guides = ['pm-compensation-2026', 'negotiation', 'equity', 'swe-compensation-2026', 'remote-pay', 'startup-vs-bigtech'];

/**
 * Lightweight sitemap priority approximation based on submission count and analysis presence.
 * We avoid running the full thin content scorer here because it would be too slow
 * for sitemap generation across all entities. Instead, we use a simple heuristic
 * that maps count + analysis to an approximate thin content score, then convert
 * that to a sitemap priority value.
 */
function approximateSitemapPriority(count: number, hasAnalysis: boolean): number | null {
  if (count >= 50 && hasAnalysis) return thinContentScoreToSitemapPriority(85);  // 0.9
  if (count >= 20 && hasAnalysis) return thinContentScoreToSitemapPriority(65);  // 0.75
  if (count >= 10)                return thinContentScoreToSitemapPriority(50);  // 0.6
  if (count >= 5 && hasAnalysis)  return thinContentScoreToSitemapPriority(40);  // 0.6
  // Below threshold — exclude from sitemap
  return null;
}

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

  const curatedComparisons = CURATED_COMPARISONS.map((comparison) => ({
    url: `${baseUrl}/compare/${comparison.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.85,
  }));

  // Dynamic popular comparisons (only those with sufficient data)
  let dynamicComparisons: MetadataRoute.Sitemap = [];
  try {
    const popular = await getPopularComparisons(20);
    const curatedSlugs = new Set(CURATED_COMPARISONS.map(c => c.slug));
    dynamicComparisons = popular
      .filter(c => !curatedSlugs.has(c.slug) && c.totalSampleSize >= 20)
      .map(c => ({
        url: `${baseUrl}/compare/${c.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }));
  } catch {
    // Non-critical: skip dynamic comparisons in sitemap
  }

  const comparisons = [...curatedComparisons, ...dynamicComparisons];

  const entityRoutes: MetadataRoute.Sitemap = [];

  const [roles, companies, cities] = await Promise.all([
    supabaseAdmin.from('Role').select('id,title,analysis,analysisGeneratedAt').limit(1000),
    supabaseAdmin.from('Company').select('id,name,analysis,analysisGeneratedAt').limit(1000),
    supabaseAdmin.from('Location').select('id,city,state,slug,analysis,analysisGeneratedAt').limit(1000),
  ]);

  if (roles.data) {
    for (const role of roles.data) {
      const { count } = await supabaseAdmin.from('Salary').select('id', { count: 'exact', head: true }).eq('roleId', role.id);
      const salaryCount = count || 0;
      const hasAnalysis = !!role.analysis;
      const evaluation = evaluateIndexingEligibility({ entityType: 'Job', entityName: role.title, salarySubmissionCount: salaryCount, hasRenderableAnalysis: hasAnalysis });
      if (!evaluation.indexable) continue;
      if (!hasMinimumViableContent(salaryCount, hasAnalysis, salaryCount >= 3)) continue;
      const priority = approximateSitemapPriority(salaryCount, hasAnalysis);
      if (priority === null) continue;
      entityRoutes.push({ url: `${baseUrl}/jobs/${encodeURIComponent(role.title)}`, lastModified: new Date(), changeFrequency: 'weekly', priority });
    }
  }

  if (companies.data) {
    for (const company of companies.data) {
      const { count } = await supabaseAdmin.from('Salary').select('id', { count: 'exact', head: true }).eq('companyId', company.id);
      const salaryCount = count || 0;
      const hasAnalysis = !!company.analysis;
      const evaluation = evaluateIndexingEligibility({ entityType: 'Company', entityName: company.name, salarySubmissionCount: salaryCount, hasRenderableAnalysis: hasAnalysis });
      if (!evaluation.indexable) continue;
      if (!hasMinimumViableContent(salaryCount, hasAnalysis, salaryCount >= 3)) continue;
      const priority = approximateSitemapPriority(salaryCount, hasAnalysis);
      if (priority === null) continue;
      entityRoutes.push({ url: `${baseUrl}/company/${encodeURIComponent(company.name)}`, lastModified: new Date(), changeFrequency: 'weekly', priority });
    }
  }

  if (cities.data) {
    for (const city of cities.data) {
      const { count } = await supabaseAdmin.from('Salary').select('id', { count: 'exact', head: true }).eq('locationId', city.id);
      const salaryCount = count || 0;
      const hasAnalysis = !!city.analysis;
      const evaluation = evaluateIndexingEligibility({ entityType: 'City', entityName: `${city.city}, ${city.state}`, salarySubmissionCount: salaryCount, hasRenderableAnalysis: hasAnalysis });
      if (!evaluation.indexable) continue;
      if (!hasMinimumViableContent(salaryCount, hasAnalysis, salaryCount >= 3)) continue;
      const priority = approximateSitemapPriority(salaryCount, hasAnalysis);
      if (priority === null) continue;
      entityRoutes.push({ url: `${baseUrl}/salaries/city/${city.slug}`, lastModified: new Date(), changeFrequency: 'weekly', priority });
    }
  }

  return [...routes, ...guideRoutes, ...comparisons, ...entityRoutes];
}
