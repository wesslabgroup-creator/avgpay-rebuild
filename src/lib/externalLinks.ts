/**
 * External Linking Strategy
 *
 * Every entity page should include 1-3 outbound links to authoritative
 * sources where appropriate. These links provide:
 * - Trust signals to search engines
 * - User value (where to find more information)
 * - Data source attribution
 *
 * Domains are pre-validated as reputable.
 */

export interface ExternalLink {
  href: string;
  label: string;
  source: string;
  description: string;
}

const TRUSTED_DOMAINS = new Set([
  'bls.gov',
  'irs.gov',
  'sec.gov',
  'numbeo.com',
  'census.gov',
  'dol.gov',
  'glassdoor.com',
  'payscale.com',
  'h1bdata.info',
  'ssa.gov',
]);

/**
 * Generate authoritative external links for a Job entity page.
 */
export function getJobExternalLinks(jobTitle: string): ExternalLink[] {
  const encodedTitle = encodeURIComponent(jobTitle);
  return [
    {
      href: `https://www.bls.gov/ooh/`,
      label: 'Bureau of Labor Statistics — Occupational Outlook',
      source: 'bls.gov',
      description: `Official BLS occupational data and employment projections that provide context for ${jobTitle} market demand.`,
    },
    {
      href: `https://h1bdata.info/index.php?em=&job=${encodedTitle}&city=&year=`,
      label: 'H-1B Visa Salary Data',
      source: 'h1bdata.info',
      description: `Public H-1B visa salary filings for ${jobTitle} positions, showing employer-disclosed compensation.`,
    },
    {
      href: `https://www.dol.gov/agencies/whd/minimum-wage`,
      label: 'U.S. Department of Labor — Wage Standards',
      source: 'dol.gov',
      description: 'Federal minimum wage standards and Fair Labor Standards Act information.',
    },
  ];
}

/**
 * Generate authoritative external links for a City entity page.
 */
export function getCityExternalLinks(cityName: string, state: string): ExternalLink[] {
  return [
    {
      href: `https://www.bls.gov/oes/current/oessrcst.htm`,
      label: 'BLS — Occupational Employment and Wage Statistics by State',
      source: 'bls.gov',
      description: `Official Bureau of Labor Statistics wage data for ${state}, providing government benchmark for ${cityName} area salaries.`,
    },
    {
      href: `https://www.numbeo.com/cost-of-living/`,
      label: 'Numbeo — Cost of Living Index',
      source: 'numbeo.com',
      description: `Cost of living data to help evaluate real purchasing power in ${cityName}. Compare housing, groceries, and transportation costs.`,
    },
    {
      href: `https://www.census.gov/quickfacts/`,
      label: 'U.S. Census Bureau — QuickFacts',
      source: 'census.gov',
      description: `Population, income, and economic data for ${cityName} from the U.S. Census Bureau.`,
    },
  ];
}

/**
 * Generate authoritative external links for a Company entity page.
 */
export function getCompanyExternalLinks(companyName: string): ExternalLink[] {
  const links: ExternalLink[] = [
    {
      href: `https://www.bls.gov/oes/`,
      label: 'BLS — Occupational Employment Statistics',
      source: 'bls.gov',
      description: `Industry-level wage data from the Bureau of Labor Statistics for benchmarking ${companyName} compensation.`,
    },
    {
      href: `https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&company=${encodeURIComponent(companyName)}&type=DEF+14A&dateb=&owner=include&count=10`,
      label: 'SEC EDGAR — Proxy Statements',
      source: 'sec.gov',
      description: `Public SEC filings for ${companyName} (if publicly traded), including executive compensation disclosures in DEF 14A proxy statements.`,
    },
    {
      href: `https://www.glassdoor.com/`,
      label: 'Glassdoor — Company Reviews and Salaries',
      source: 'glassdoor.com',
      description: `Additional employee-reported salary data and company reviews for cross-referencing ${companyName} compensation.`,
    },
  ];

  return links;
}

/**
 * Validate that a URL domain is in the trusted domains list.
 */
export function isTrustedDomain(url: string): boolean {
  try {
    const hostname = new URL(url).hostname.replace('www.', '');
    return TRUSTED_DOMAINS.has(hostname);
  } catch {
    return false;
  }
}
