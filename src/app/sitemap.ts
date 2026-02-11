import { MetadataRoute } from 'next';
import { CURATED_COMPARISONS } from '@/app/compare/data/curated-comparisons';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://avgpay.com'; // Replace with actual production URL if different

    // Static routes
    const routes = [
        '',
        '/analyze-offer',
        '/salaries',
        '/guides',
        '/about',
        '/privacy',
        '/methodology',
        '/pricing',
        '/tools/inflation-calculator',
        '/tools/salary-comparison',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    // Guide routes - ideal world this comes from a database or file system
    // For now, hardcoding the known guides to ensure they are indexed
    const guides = [
        'pm-compensation-2026',
        'negotiation',
        'equity',
        'swe-compensation-2026',
        'remote-pay',
        'startup-vs-bigtech'
    ].map((slug) => ({
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

    return [...routes, ...guides, ...comparisons];
}
