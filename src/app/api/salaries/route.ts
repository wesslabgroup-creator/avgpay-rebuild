import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseClient';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const view = searchParams.get('view') || 'role_global';
    
    // Filters
    const companyFilter = searchParams.get('company');
    const roleFilter = searchParams.get('role');
    const locationFilter = searchParams.get('location');

    let query;

    switch (view) {
      case 'company':
        query = supabaseAdmin.from('companies').select('name, aggregated_data');
        if (companyFilter) {
          query = query.eq('name', companyFilter);
        }
        break;
      
      case 'role_location':
        // This view is trickier as data is aggregated by location. 
        // We'll fetch from the locations table and filter by role if needed.
        query = supabaseAdmin.from('locations').select('name, aggregated_data');
        if (locationFilter) {
          query = query.eq('name', locationFilter);
        }
        // Post-filtering by role will be needed if roleFilter is present
        break;

      case 'role_global':
      default:
        query = supabaseAdmin.from('jobs').select('title, global_median_comp, global_min_comp, global_max_comp, global_count');
        if (roleFilter) {
          query = query.eq('title', roleFilter);
        }
        break;
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(error.message);
    }

    // Format the data to match the expected AggregatedResult structure
    const results = data.map((item: any) => {
      if (view === 'company') {
        return {
          groupKey: item.name,
          medianTotalComp: item.aggregated_data?.medianTotalComp || 0,
          minComp: item.aggregated_data?.minComp || 0,
          maxComp: item.aggregated_data?.maxComp || 0,
          count: item.aggregated_data?.count || 0,
          levelsCount: 0, // Not tracked in this view
        };
      } else if (view === 'role_location') {
        // Here we'd need to parse the JSONB to get role-specific data if available
        // This simplified version just returns the location's overall aggregate
        const parts = item.name.split(' | ');
        return {
          groupKey: parts[0],
          secondaryKey: parts.length > 1 ? parts[1] : item.name,
          medianTotalComp: item.aggregated_data?.medianTotalComp || 0,
          minComp: item.aggregated_data?.minComp || 0,
          maxComp: item.aggregated_data?.maxComp || 0,
          count: item.aggregated_data?.count || 0,
          levelsCount: 0,
        };
      } else { // role_global
        return {
          groupKey: item.title,
          medianTotalComp: item.global_median_comp || 0,
          minComp: item.global_min_comp || 0,
          maxComp: item.global_max_comp || 0,
          count: item.global_count || 0,
          levelsCount: 0, // Not tracked in this view
        };
      }
    });

    return NextResponse.json(results);

  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
