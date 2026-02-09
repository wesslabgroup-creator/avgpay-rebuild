import { NextResponse } from 'next/server';
import { MARKET_DATA } from '../../../lib/data';

interface SalaryResult {
  company: string;
  role: string;
  location: string;
  level: string;
  medianTotalComp: number;
  blsBenchmark: number;
  count: number;
}

function flattenMarketData(): SalaryResult[] {
  const results: SalaryResult[] = [];
  for (const [company, companyRoles] of Object.entries(MARKET_DATA)) {
    for (const [role, roleLocations] of Object.entries(companyRoles)) {
      for (const [location, locationLevels] of Object.entries(roleLocations)) {
        for (const [level, values] of Object.entries<{ median: number; blsMedian: number }>(locationLevels)) {
          results.push({
            company,
            role,
            location,
            level,
            medianTotalComp: values.median,
            blsBenchmark: values.blsMedian,
            count: Math.floor(Math.random() * 100) + 10, // Mock count 10-110
          });
        }
      }
    }
  }
  return results;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    let data = flattenMarketData();

    // Filter logic
    const companyFilter = searchParams.get('company');
    if (companyFilter) {
      data = data.filter((item) => item.company.toLowerCase() === companyFilter.toLowerCase());
    }

    const roleFilter = searchParams.get('role');
    if (roleFilter) {
      data = data.filter((item) => item.role === roleFilter);
    }

    const locationFilter = searchParams.get('location');
    if (locationFilter) {
      data = data.filter((item) => item.location === locationFilter);
    }

    const levelFilter = searchParams.get('level');
    if (levelFilter) {
      // Note: LEVELS values are 'Junior', but data keys are 'Junior (L1-L2)'. Mapping needed for full fix.
      // Quick mock: match partial
      data = data.filter((item) => 
        item.level.toLowerCase().startsWith(levelFilter.toLowerCase())
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
