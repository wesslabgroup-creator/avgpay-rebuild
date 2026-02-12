import { supabaseAdmin } from './supabaseClient';
import 'server-only';
import {
  MARKET_DATA,
  DEFAULT_DATA,
  MarketData,
  COMPANIES,
  ROLES,
  LOCATIONS,
  LEVELS,
  calculateGrade
} from './shared-data';

export { MARKET_DATA, COMPANIES, ROLES, LOCATIONS, LEVELS, calculateGrade, type MarketData };

/**
 * getMarketData:
 * Retrieves salary market data for a specific company, role, location, and experience level.
 * Queries Supabase first, falls back to static MARKET_DATA.
 */
export async function getMarketData(
  company: string,
  role: string,
  location: string,
  level: string
): Promise<MarketData> {
  try {
    // 1. Try Supabase
    // We fetch ALL salaries for this Company+Role combination to handle fuzzy matching for location/level in memory
    // This reduces DB roundtrips/complex filtering for this small dataset
    // 2. Filter by Location (fuzzy match)
    // location param is "San Francisco, CA"
    const locationParts = location.split(',').map(s => s.trim().toLowerCase());
    const cityFilter = locationParts[0];

    interface SalaryRecord {
      totalComp: number;
      baseSalary: number;
      equity: number;
      bonus: number;
      level: string;
      Company: { name: string };
      Role: { title: string };
      Location: { city: string; state: string };
    }

    const { data: rawData } = await supabaseAdmin
      .from('Salary')
      .select(`
            totalComp,
            baseSalary,
            equity,
            bonus,
            level,
            Company!inner(name),
            Role!inner(title),
            Location!inner(city, state)
        `)
      .ilike('Company.name', company)
      .ilike('Role.title', role) as { data: SalaryRecord[] | null, error: unknown };


    const rawSalaries = rawData || [];

    if (!rawSalaries || rawSalaries.length === 0) {
      // if error, fallback
      return MARKET_DATA[company]?.[role]?.[location]?.[level] ?? DEFAULT_DATA;
    }

    const locationFiltered = rawSalaries.filter((s: SalaryRecord) => {
      return s.Location?.city?.toLowerCase().includes(cityFilter);
    });

    if (locationFiltered.length === 0) {
      return MARKET_DATA[company]?.[role]?.[location]?.[level] ?? DEFAULT_DATA;
    }

    // 3. Filter by Level (fuzzy match)
    // level param might be "L3-L4" or "Mid (L3-L4)"
    const levelFiltered = locationFiltered.filter((s: SalaryRecord) => {
      return s.level.toLowerCase().includes(level.toLowerCase()) ||
        level.toLowerCase().includes(s.level.toLowerCase());
    });

    // If no exact level match, we can either return average of all levels or fallback
    // Since we want accurate data for the page, if we can't find that level, fallback to mock data which MUST have it
    if (levelFiltered.length === 0) {
      return MARKET_DATA[company]?.[role]?.[location]?.[level] ?? DEFAULT_DATA;
    }

    // 4. Calculate Stats from the matching row(s)
    // Typically there is only 1 row for specific level in our seed data
    // But if we have multiple (e.g. user submissions), we aggregate
    const salary = levelFiltered[0]; // Take the first one for now (or average)

    // We need to shape it into MarketData
    // Our seed data stores 'median' in 'totalComp'
    // We can simulate percentiles from the median if we don't have raw distribution
    // Seed data: base, equity, bonus, totalComp

    const median = salary.totalComp;

    return {
      median: median,
      blsMedian: Math.round(median * 0.7), // Mock BLS
      min: Math.round(median * 0.8),
      max: Math.round(median * 1.2),
      p10: Math.round(median * 0.85),
      p25: Math.round(median * 0.9),
      p75: Math.round(median * 1.1),
      p90: Math.round(median * 1.15),
    };

  } catch (err) {
    console.error('getMarketData error:', err);
    return MARKET_DATA[company]?.[role]?.[location]?.[level] ?? DEFAULT_DATA;
  }
}

// Export constants derived from the MARKET_DATA for dynamic generation of options/paths.
// We keep these static for now to avoid async complexity in client components during Phase 1.

/**
 * calculateTotalDataPoints:
 * Counts the total number of salary data points in MARKET_DATA
 * for displaying accurate stats on the homepage.
 * NOW: Fetches real count from Supabase.
 */
export async function calculateTotalDataPoints(): Promise<number> {
  try {
    const { count, error } = await supabaseAdmin
      .from('Salary')
      .select('*', { count: 'exact', head: true });

    if (error) throw error;
    return count || 0;
  } catch {
    console.warn('Failed to fetch real count, falling back to estimate');
    // Fallback to a realistic "beta" number if DB is empty or fails
    return 150;
  }
}

/**
 * getDistinctCompanies:
 * Fetches list of unique companies from DB.
 */
export async function getDistinctCompanies(): Promise<string[]> {
  try {
    // We use a distinct query or just fetch all and Set
    // optimize: create a separate table or materialized view for this in prod
    const { data, error } = await supabaseAdmin
      .from('Company')
      .select('name');

    if (error) throw error;
    if (!data) return COMPANIES; // fallback

    const names = Array.from(new Set(data.map((d: { name: string }) => d.name))).sort() as string[];
    return names.length > 0 ? names : COMPANIES;
  } catch {
    return COMPANIES;
  }
}

/**
 * getDistinctRoles:
 * Fetches list of unique roles from DB.
 */
export async function getDistinctRoles(): Promise<string[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from('Role')
      .select('title');

    if (error) throw error;
    if (!data) return ROLES; // fallback

    const titles = Array.from(new Set(data.map((d: { title: string }) => d.title))).sort() as string[];
    return titles.length > 0 ? titles : ROLES;
  } catch {
    return ROLES;
  }
}
