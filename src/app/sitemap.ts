import { MetadataRoute } from 'next';
import { CURATED_COMPARISONS } from '@/app/compare/data/curated-comparisons';

const baseUrl = 'https://avgpay.com';

const staticRoutes = [
  '',
  '/analyze-offer',
  '/analyze-salary',
  '/salaries',
  '/companies',
  '/compare',
  '/guides',
  '/tools',
  '/about',
  '/privacy',
  '/methodology',
  '/pricing',
  '/contribute',
  '/submit',
  '/tools/inflation-calculator',
  '/tools/salary-comparison',
  '/tools/negotiation-email',
  '/tools/compensation-breakdown',
  '/tools/equity-simulator',
  '/tools/compare-offers',
  '/tools/percentile-calculator',
  '/tools/stock-calculator',
];

const guides = [
  'pm-compensation-2026',
  'negotiation',
  'equity',
  'swe-compensation-2026',
  'remote-pay',
  'startup-vs-bigtech',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? ('daily' as const) : ('weekly' as const),
    priority: route === '' ? 1 : route.startsWith('/tools') || route.startsWith('/guides') ? 0.9 : 0.8,
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

  return [...routes, ...guideRoutes, ...comparisons];
}
