/**
 * Internal Linking Engine
 *
 * Programmatic internal linking system that strengthens topical clusters
 * and eliminates orphan pages. All links are:
 * - Crawlable (standard <a> tags)
 * - Server-renderable
 * - Intent-relevant
 * - Derived from DB rankings when possible
 */

export interface InternalLink {
  href: string;
  label: string;
  context: string;
}

// ============================================================
// Job Page Internal Links
// ============================================================

export function buildJobPageLinks(params: {
  jobTitle: string;
  topCompanies: { company_name: string; total_comp: number }[];
  topLocations: { location: string; total_comp: number }[];
  bottomLocations: { location: string; total_comp: number }[];
  relatedJobs: { title: string }[];
}): {
  topPayingCompanies: InternalLink[];
  topPayingCities: InternalLink[];
  relatedRoles: InternalLink[];
  actionLinks: InternalLink[];
} {
  const topPayingCompanies = params.topCompanies.slice(0, 8).map((c) => ({
    href: `/company/${encodeURIComponent(c.company_name)}`,
    label: c.company_name,
    context: `${c.company_name} ${params.jobTitle} salaries`,
  }));

  const allLocations = [
    ...params.topLocations.slice(0, 5),
    ...params.bottomLocations.slice(0, 3),
  ];
  const seenLocations = new Set<string>();
  const topPayingCities = allLocations
    .filter((loc) => {
      if (seenLocations.has(loc.location)) return false;
      seenLocations.add(loc.location);
      return true;
    })
    .map((loc) => ({
      href: `/salaries/city/${loc.location.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
      label: loc.location,
      context: `${params.jobTitle} salaries in ${loc.location}`,
    }));

  const relatedRoles = params.relatedJobs.slice(0, 10).map((j) => ({
    href: `/jobs/${encodeURIComponent(j.title)}`,
    label: j.title,
    context: `${j.title} salary data`,
  }));

  const actionLinks: InternalLink[] = [
    { href: '/analyze-offer', label: 'Analyze My Offer', context: `Evaluate your ${params.jobTitle} offer` },
    { href: '/contribute', label: 'Submit Your Salary', context: `Help grow ${params.jobTitle} salary data` },
    { href: '/tools/negotiation-email', label: 'Negotiation Email Tool', context: 'Generate a negotiation email' },
    { href: '/tools/percentile-calculator', label: 'Percentile Calculator', context: 'Find your percentile rank' },
  ];

  return { topPayingCompanies, topPayingCities, relatedRoles, actionLinks };
}

// ============================================================
// City Page Internal Links
// ============================================================

/** Well-known similar cities for basic geographic/market clustering */
const CITY_CLUSTERS: Record<string, string[]> = {
  'san francisco': ['san jose', 'oakland', 'seattle', 'los angeles', 'new york'],
  'new york': ['boston', 'philadelphia', 'chicago', 'san francisco', 'washington'],
  'seattle': ['portland', 'san francisco', 'austin', 'denver', 'san jose'],
  'austin': ['dallas', 'houston', 'denver', 'san antonio', 'raleigh'],
  'chicago': ['detroit', 'minneapolis', 'st. louis', 'indianapolis', 'new york'],
  'boston': ['new york', 'cambridge', 'philadelphia', 'hartford', 'providence'],
  'los angeles': ['san diego', 'san francisco', 'irvine', 'orange county', 'phoenix'],
  'denver': ['boulder', 'colorado springs', 'austin', 'salt lake city', 'seattle'],
  'atlanta': ['charlotte', 'raleigh', 'nashville', 'tampa', 'miami'],
  'miami': ['fort lauderdale', 'tampa', 'orlando', 'atlanta', 'austin'],
  'dallas': ['austin', 'houston', 'san antonio', 'fort worth', 'denver'],
  'houston': ['dallas', 'austin', 'san antonio', 'new orleans', 'atlanta'],
  'washington': ['baltimore', 'richmond', 'philadelphia', 'new york', 'raleigh'],
  'phoenix': ['tucson', 'las vegas', 'los angeles', 'denver', 'albuquerque'],
  'portland': ['seattle', 'vancouver', 'san francisco', 'eugene', 'boise'],
  'san jose': ['san francisco', 'oakland', 'santa clara', 'sunnyvale', 'palo alto'],
  'raleigh': ['durham', 'charlotte', 'atlanta', 'richmond', 'austin'],
  'san diego': ['los angeles', 'irvine', 'phoenix', 'las vegas', 'san francisco'],
  'minneapolis': ['chicago', 'madison', 'milwaukee', 'des moines', 'omaha'],
  'nashville': ['atlanta', 'charlotte', 'memphis', 'louisville', 'birmingham'],
};

export function buildCityPageLinks(params: {
  cityName: string;
  state: string;
  topCompanies: { company_name: string; median_comp: number; data_points: number }[];
  topJobs: { job_title: string; median_comp: number; data_points: number }[];
}): {
  topCompaniesInCity: InternalLink[];
  topJobsInCity: InternalLink[];
  nearbyCities: InternalLink[];
  actionLinks: InternalLink[];
} {
  const cityLabel = `${params.cityName}, ${params.state}`;

  const topCompaniesInCity = params.topCompanies.slice(0, 8).map((c) => ({
    href: `/company/${encodeURIComponent(c.company_name)}`,
    label: c.company_name,
    context: `${c.company_name} salaries in ${cityLabel}`,
  }));

  const topJobsInCity = params.topJobs.slice(0, 8).map((j) => ({
    href: `/jobs/${encodeURIComponent(j.job_title)}`,
    label: j.job_title,
    context: `${j.job_title} salary in ${cityLabel}`,
  }));

  const normalizedCity = params.cityName.toLowerCase().trim();
  const similarCities = CITY_CLUSTERS[normalizedCity] || [];
  const nearbyCities = similarCities.map((city) => ({
    href: `/salaries/city/${city.replace(/\s+/g, '-')}`,
    label: city.split(' ').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
    context: `Compare salaries: ${cityLabel} vs ${city}`,
  }));

  const actionLinks: InternalLink[] = [
    { href: '/salaries', label: 'All Salary Data', context: 'Browse salaries across all cities' },
    { href: '/contribute', label: 'Submit Your Salary', context: `Help grow the ${params.cityName} dataset` },
    { href: '/analyze-offer', label: 'Analyze My Offer', context: 'Evaluate your offer' },
    { href: '/compare', label: 'Compare Offers', context: 'Compare two offers side by side' },
  ];

  return { topCompaniesInCity, topJobsInCity, nearbyCities, actionLinks };
}

// ============================================================
// Company Page Internal Links
// ============================================================

export function buildCompanyPageLinks(params: {
  companyName: string;
  topJobs: { role: string; medianComp: number; dataPoints: number }[];
  topCities: { city: string; medianComp: number; dataPoints: number }[];
  similarCompanies: { company: string; slug: string; href: string }[];
}): {
  topJobsAtCompany: InternalLink[];
  topCitiesForCompany: InternalLink[];
  competitorLinks: InternalLink[];
  actionLinks: InternalLink[];
} {
  const topJobsAtCompany = params.topJobs.slice(0, 8).map((j) => ({
    href: `/jobs/${encodeURIComponent(j.role)}`,
    label: j.role,
    context: `${j.role} at ${params.companyName}`,
  }));

  const topCitiesForCompany = params.topCities.slice(0, 8).map((c) => ({
    href: `/salaries/city/${c.city.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    label: c.city,
    context: `${params.companyName} salaries in ${c.city}`,
  }));

  const competitorLinks = params.similarCompanies.slice(0, 8).map((c) => ({
    href: `/company/${encodeURIComponent(c.company)}`,
    label: c.company,
    context: `Compare ${params.companyName} vs ${c.company}`,
  }));

  const actionLinks: InternalLink[] = [
    { href: '/analyze-offer', label: 'Analyze My Offer', context: `Evaluate your ${params.companyName} offer` },
    { href: '/contribute', label: 'Submit Your Salary', context: `Add ${params.companyName} salary data` },
    { href: '/companies', label: 'All Companies', context: 'Browse all company salary pages' },
    { href: '/tools/negotiation-email', label: 'Negotiation Email Tool', context: 'Prepare your negotiation' },
  ];

  return { topJobsAtCompany, topCitiesForCompany, competitorLinks, actionLinks };
}

// ============================================================
// Breadcrumb Generation
// ============================================================

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function buildBreadcrumbs(
  entityType: 'Company' | 'City' | 'Job',
  entityName: string,
): BreadcrumbItem[] {
  const crumbs: BreadcrumbItem[] = [
    { label: 'Home', href: '/' },
  ];

  switch (entityType) {
    case 'Company':
      crumbs.push({ label: 'Companies', href: '/companies' });
      crumbs.push({ label: entityName });
      break;
    case 'City':
      crumbs.push({ label: 'Salaries', href: '/salaries' });
      crumbs.push({ label: entityName });
      break;
    case 'Job':
      crumbs.push({ label: 'Salaries', href: '/salaries' });
      crumbs.push({ label: entityName });
      break;
  }

  return crumbs;
}
