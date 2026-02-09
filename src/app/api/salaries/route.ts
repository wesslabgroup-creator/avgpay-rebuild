// src/app/api/salaries/route.ts
import type { NextRequest } from 'next/server';
import { COMPANIES, ROLES, LOCATIONS, MARKET_DATA } from '@/lib/data'; // Assuming MARKET_DATA is structured appropriately

// Mock function to simulate fetching aggregated data
// In a real app, this would query a database based on filters
function getAggregatedSalaryData(filters: {
  company?: string;
  role?: string;
  location?: string;
  level?: string;
}) {
  const data: Array<{company: string, role: string, location: string, level: string, median: number, blsMedian: number}> = [];
  const companyList = filters.company ? [filters.company] : COMPANIES;
  const roleList = filters.role ? [filters.role] : ROLES;
  const locationList = filters.location ? [filters.location] : LOCATIONS;
  const levelList = filters.level ? [filters.level] : ["Junior (L1-L2)", "Mid (L3-L4)", "Senior (L5-L6)", "Staff+ (L7+)"];

  // Expand data based on filters
  companyList.forEach(comp => {
    roleList.forEach(rol => {
      locationList.forEach(loc => {
        levelList.forEach(lvl => {
          const companyData = MARKET_DATA[comp];
          if (companyData) {
            const roleData = companyData[rol];
            if (roleData) {
              const locationData = roleData[loc];
              if (locationData) {
                const levelData = locationData[lvl];
                if (levelData) {
                  data.push({
                    company: comp,
                    role: rol,
                    location: loc,
                    level: lvl,
                    ...levelData, // Spread median, blsMedian etc.
                  });
                }
              }
            }
          }
        });
      });
    });
  });

  // Simulate count and return basic structure
  return data.map(item => ({
    company: item.company,
    role: item.role,
    location: item.location,
    level: item.level,
    medianTotalComp: item.median,
    blsBenchmark: item.blsMedian,
    count: 1, // Each item is a unique mock entry for now
  }));
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const company = searchParams.get('company') ?? undefined;
  const role = searchParams.get('role') ?? undefined;
  const location = searchParams.get('location') ?? undefined;
  const level = searchParams.get('level') ?? undefined;

  const filters = { company, role, location, level };
  const salaryData = getAggregatedSalaryData(filters);

  return Response.json(salaryData);
}
