import { MetadataRoute } from 'next';
import { COMPANIES, LOCATIONS, ROLES } from '@/lib/data';
import { INDEXABLE_ROUTES, toAbsoluteUrl } from '@/lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
    const staticRoutes = INDEXABLE_ROUTES.map((route) => ({
        url: toAbsoluteUrl(route),
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: route === '/' ? 1 : 0.8,
    }));

    const salaryRoutes = COMPANIES.flatMap((company) =>
        ROLES.flatMap((role) =>
            LOCATIONS.map((location) => {
                const encodedLocation = encodeURIComponent(location.replace(', ', '-'));
                return {
                    url: toAbsoluteUrl(`/${encodeURIComponent(company)}/${encodeURIComponent(role)}/${encodedLocation}`),
                    lastModified: new Date(),
                    changeFrequency: 'weekly' as const,
                    priority: 0.7,
                };
            })
        )
    );

    const deDuplicated = [...new Map([...staticRoutes, ...salaryRoutes].map((route) => [route.url, route])).values()];

    return deDuplicated.map((route) => ({
        ...route,
        lastModified: new Date(),
    }));
}
