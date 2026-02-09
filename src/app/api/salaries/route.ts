import { NextResponse } from 'next/server';
import { MARKET_DATA } from '../../lib/data';

type ViewType = 'company' | 'role_location' | 'role_global';

interface AggregatedResult {
  groupKey: string; // The primary key for the row (e.g., "Google", "Software Engineer - San Francisco", "Software Engineer")
  secondaryKey?: string; // e.g. Location for role_location view
  medianTotalComp: number;
  minComp: number;
  maxComp: number;
  count: number;
  levelsCount: number;
}

// Helper to calculate median
function getMedian(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const view = (searchParams.get('view') as ViewType) || 'role_global';
    
    // Filters
    const companyFilter = searchParams.get('company');
    const roleFilter = searchParams.get('role');
    const locationFilter = searchParams.get('location');

    // 1. Flatten all raw data points first
    let rawPoints: { company: string; role: string; location: string; comp: number; level: string }[] = [];
    
    // Explicit typing for the nested structure of MARKET_DATA
    type MarketDataValues = { median: number; blsMedian: number; p10?: number; p25?: number; p75?: number; p90?: number };
    
    for (const [company, companyRoles] of Object.entries(MARKET_DATA as Record<string, Record<string, Record<string, Record<string, MarketDataValues>>>>)) {
      if (companyFilter && company !== companyFilter) continue;

      for (const [role, roleLocations] of Object.entries(companyRoles)) {
        if (roleFilter && role !== roleFilter) continue;

        for (const [location, locationLevels] of Object.entries(roleLocations)) {
          if (locationFilter && location !== locationFilter) continue;

          for (const [level, values] of Object.entries(locationLevels)) {
            // Treat each "level" entry as a data bucket. Since we don't have individual user rows in this mock,
            // we use the 'median' as a representative data point for aggregation.
            // In a real DB, we would query: SELECT avg(salary) FROM salaries GROUP BY...
            rawPoints.push({
              company,
              role,
              location,
              comp: values.median,
              level
            });
          }
        }
      }
    }

    // 2. Aggregate based on View
    const groupedData: Record<string, { comps: number[]; levels: Set<string>; count: number }> = {};

    for (const point of rawPoints) {
      let key = "";
      
      switch (view) {
        case 'company':
          key = point.company;
          break;
        case 'role_location':
          // Only show this detailed view if filtered by role usually, but safe to show all
          key = `${point.role} | ${point.location}`;
          break;
        case 'role_global':
        default:
          key = point.role;
          break;
      }

      if (!groupedData[key]) {
        groupedData[key] = { comps: [], levels: new Set(), count: 0 };
      }
      groupedData[key].comps.push(point.comp);
      groupedData[key].levels.add(point.level);
      groupedData[key].count += 1; // In mock, 1 level entry = 1 aggregate point. Real DB would sum(count).
    }

    // 3. Format Output
    const results: AggregatedResult[] = Object.entries(groupedData).map(([key, data]) => {
      // If View B (Role | Location), split the key back out for UI
      const parts = key.split(' | ');
      const groupKey = view === 'role_location' ? parts[0] : key;
      const secondaryKey = view === 'role_location' ? parts[1] : undefined;

      const comps = data.comps.sort((a, b) => a - b);

      return {
        groupKey,
        secondaryKey,
        medianTotalComp: getMedian(comps),
        minComp: comps[0],
        maxComp: comps[comps.length - 1],
        count: data.count * (10 + Math.floor(Math.random() * 50)), // Simulate real user count multiplier
        levelsCount: data.levels.size
      };
    });

    return NextResponse.json(results);

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
