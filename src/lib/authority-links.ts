
export interface AuthorityLink {
    text: string;
    url: string;
    source: string;
    rel: string;
}

export function getAuthoritativeLinks(
    entityType: 'Company' | 'Role' | 'Location',
    entityName: string
): AuthorityLink[] {
    const links: AuthorityLink[] = [];

    if (entityType === 'Role') {
        // BLS Occupational Outlook Handbook
        // We can't deep-link perfectly without a map, so we link to OOH search or main page with specific text
        links.push({
            text: `Bureau of Labor Statistics: ${entityName} Outlook`,
            url: `https://www.bls.gov/ooh/search?q=${encodeURIComponent(entityName)}`,
            source: 'BLS.gov',
            rel: 'noopener noreferrer nofollow' // Nofollow for search results is safer SEO-wise until we have direct links
        });

        // O*NET Online
        links.push({
            text: `O*NET OnLine: ${entityName} Details`,
            url: `https://www.onetonline.org/find/result?s=${encodeURIComponent(entityName)}`,
            source: 'O*NET',
            rel: 'noopener noreferrer nofollow'
        });
    }

    if (entityType === 'Company') {
        // LinkedIn Company Page Search (proxy for authority if we don't have direct URL)
        // Or SEC EDGAR for public companies if we had tickers.
        // For now, let's stick to generic high-trust searches or news
        links.push({
            text: `${entityName} on LinkedIn`,
            url: `https://www.linkedin.com/company/${entityName.toLowerCase().replace(/ /g, '-')}`,
            source: 'LinkedIn',
            rel: 'noopener noreferrer nofollow'
        });

        links.push({
            text: `${entityName} Careers Page`,
            url: `https://www.google.com/search?q=${encodeURIComponent(entityName + ' careers')}`,
            source: 'Google Search',
            rel: 'noopener noreferrer nofollow'
        });
    }

    if (entityType === 'Location') {
        // BLS OEWS (Occupational Employment and Wage Statistics) for the area
        // Again, search is the safest scalable fallback without a complex map
        links.push({
            text: `BLS Employment Statistics for ${entityName}`,
            url: `https://www.bls.gov/oes/current/oes_stru.htm`, // General structure page is better than 404
            source: 'BLS.gov',
            rel: 'noopener noreferrer'
        });

        // Census Bureau QuickFacts
        links.push({
            text: `US Census Bureau QuickFacts: ${entityName}`,
            url: `https://www.census.gov/quickfacts/fact/table/US/PST045221`, // Main QuickFacts
            source: 'Census.gov',
            rel: 'noopener noreferrer'
        });
    }

    return links;
}
