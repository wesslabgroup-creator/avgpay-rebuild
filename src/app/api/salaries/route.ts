import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseClient';

export const dynamic = 'force-dynamic';

// Helper to calculate percentiles from a list of numbers
function calculateStats(values: number[]) {
  if (values.length === 0) return null;
  values.sort((a, b) => a - b);

  const getPercentile = (p: number) => {
    const index = Math.floor((p / 100) * values.length);
    return values[Math.min(index, values.length - 1)];
  };

  const sum = values.reduce((a, b) => a + b, 0);
  const avg = Math.round(sum / values.length);

  return {
    median: getPercentile(50),
    p10: getPercentile(10),
    p25: getPercentile(25),
    p75: getPercentile(75),
    p90: getPercentile(90),
    min: values[0],
    max: values[values.length - 1],
    avg,
    count: values.length
  };
}

interface SalaryData {
  totalComp: number;
  Company?: { name: string } | null;
  Role?: { title: string } | null;
  Location?: { city: string; state?: string } | null;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const view = searchParams.get('view');

    const company = searchParams.get('company');
    const role = searchParams.get('role');
    const location = searchParams.get('location');

    // Case 1: Specific Lookup (Offer Analyzer)
    // If company, role, location are provided, return MarketData object
    if (company && role && location) {
      const query = supabaseAdmin
        .from('Salary')
        .select(`
          totalComp,
          Company!inner(name),
          Role!inner(title),
          Location!inner(city, state)
        `)
        .ilike('Company.name', company)
        .ilike('Role.title', role);

      // Location matching is tricky due to "San Francisco, CA" format vs City/State
      // We'll try simple matching or just filter in memory if needed
      // For now, let's assume strict match on city/state string isn't easy via filters without splitting
      // So we fetch matching Company+Role and filter Location in memory or use fuzzy match

      const { data: rawSalaries, error } = await query;

      if (error) throw error;

      // Filter by location fuzzy match
      const locationParts = location.split(',').map(s => s.trim().toLowerCase());
      const filtered = (rawSalaries as unknown as SalaryData[])?.filter((s) => {
        // Check against city or state or combo
        if (!s.Location) return false;
        const cityMatch = s.Location.city && s.Location.city.toLowerCase().includes(locationParts[0]);
        return cityMatch;
      }) || [];

      const stats = calculateStats(filtered.map((s: SalaryData) => s.totalComp));

      if (!stats) {
        // Fallback to "National" data for that role if location match fails, or returning zeros
        // Ideally we should look for role-only match as fallback
        return NextResponse.json({
          median: 0, blsMedian: 0, min: 0, max: 0, p10: 0, p25: 0, p75: 0, p90: 0
        });
      }

      return NextResponse.json({
        median: stats.median,
        blsMedian: Math.round(stats.median * 0.7), // Mock BLS for now
        min: stats.min,
        max: stats.max,
        p10: stats.p10,
        p25: stats.p25,
        p75: stats.p75,
        p90: stats.p90,
      });
    }

    // Case 2: Aggregate Views (Charts)
    // view='company' -> group by company
    // view='role_global' -> group by role

    // For now, simplified implementation returning top-level aggregates
    // We fetch ALL salaries (limit 2000) and aggregate in memory for the beta 
    const { data: allSalaries, error: aggError } = await supabaseAdmin
      .from('Salary')
      .select(`
            totalComp,
            Company(name),
            Role(title),
            Location(city)
        `)
      .order('submittedAt', { ascending: false })
      .limit(5000);

    if (aggError) throw aggError;

    if (view === 'company') {
      // Group by Company
      const groups: Record<string, number[]> = {};
      (allSalaries as unknown as SalaryData[])?.forEach((s) => {
        const name = s.Company?.name;
        if (name) {
          if (!groups[name]) groups[name] = [];
          groups[name].push(s.totalComp);
        }
      });

      const results = Object.entries(groups).map(([key, values]) => {
        const s = calculateStats(values)!;
        return {
          groupKey: key,
          medianTotalComp: s.median,
          minComp: s.min,
          maxComp: s.max,
          count: s.count
        };
      });
      return NextResponse.json(results);
    }

    // Default: Group by Role
    const groups: Record<string, number[]> = {};
    (allSalaries as unknown as SalaryData[])?.forEach((s) => {
      const title = s.Role?.title;
      if (title) {
        if (!groups[title]) groups[title] = [];
        groups[title].push(s.totalComp);
      }
    });

    const results = Object.entries(groups).map(([key, values]) => {
      const s = calculateStats(values)!;
      return {
        groupKey: key,
        medianTotalComp: s.median,
        minComp: s.min,
        maxComp: s.max,
        count: s.count
      };
    });

    return NextResponse.json(results);

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    console.error('API Error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
