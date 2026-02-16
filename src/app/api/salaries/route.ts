import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseClient';
import { triggerOpportunisticEnrichment } from '@/lib/enrichment';

export const dynamic = 'force-dynamic';

const PAGE_SIZE = 1000;

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

async function fetchAllSalaries(): Promise<SalaryData[]> {
  const allRows: SalaryData[] = [];
  let from = 0;

  while (true) {
    const to = from + PAGE_SIZE - 1;
    const { data, error } = await supabaseAdmin
      .from('Salary')
      .select(`
        totalComp,
        Company(name),
        Role(title),
        Location(city)
      `)
      .order('id', { ascending: true })
      .range(from, to);

    if (error) throw error;

    const page = (data as unknown as SalaryData[]) || [];
    allRows.push(...page);

    if (page.length < PAGE_SIZE) break;
    from += PAGE_SIZE;
  }

  return allRows;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const view = searchParams.get('view');

    triggerOpportunisticEnrichment('api:salaries');

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

      const { data: rawSalaries, error } = await query;

      if (error) throw error;

      // Filter by location fuzzy match
      const locationParts = location.split(',').map(s => s.trim().toLowerCase());
      const filtered = (rawSalaries as unknown as SalaryData[])?.filter((s) => {
        if (!s.Location) return false;
        const cityMatch = s.Location.city && s.Location.city.toLowerCase().includes(locationParts[0]);
        return cityMatch;
      }) || [];

      const stats = calculateStats(filtered.map((s: SalaryData) => s.totalComp));

      if (!stats) {
        return NextResponse.json({
          median: 0, blsMedian: 0, min: 0, max: 0, p10: 0, p25: 0, p75: 0, p90: 0
        }, {
          headers: { 'Cache-Control': 'no-store, max-age=0' },
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
      }, {
        headers: { 'Cache-Control': 'no-store, max-age=0' },
      });
    }

    // Case 2: Aggregate Views (Charts)
    // view='company' -> group by company
    // view='role_global' -> group by role
    const allSalaries = await fetchAllSalaries();

    if (view === 'company') {
      const groups: Record<string, number[]> = {};
      allSalaries.forEach((s) => {
        const name = s.Company?.name;
        if (name) {
          if (!groups[name]) groups[name] = [];
          groups[name].push(s.totalComp);
        }
      });

      const results = Object.entries(groups)
        .map(([key, values]) => {
          const s = calculateStats(values)!;
          return {
            groupKey: key,
            medianTotalComp: s.median,
            minComp: s.min,
            maxComp: s.max,
            count: s.count
          };
        })
        .sort((a, b) => b.count - a.count || b.medianTotalComp - a.medianTotalComp);

      return NextResponse.json(results, {
        headers: { 'Cache-Control': 'no-store, max-age=0' },
      });
    }

    const groups: Record<string, number[]> = {};
    allSalaries.forEach((s) => {
      const title = s.Role?.title;
      if (title) {
        if (!groups[title]) groups[title] = [];
        groups[title].push(s.totalComp);
      }
    });

    const results = Object.entries(groups)
      .map(([key, values]) => {
        const s = calculateStats(values)!;
        return {
          groupKey: key,
          medianTotalComp: s.median,
          minComp: s.min,
          maxComp: s.max,
          count: s.count
        };
      })
      .sort((a, b) => b.count - a.count || b.medianTotalComp - a.medianTotalComp);

    return NextResponse.json(results, {
      headers: { 'Cache-Control': 'no-store, max-age=0' },
    });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    console.error('API Error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
