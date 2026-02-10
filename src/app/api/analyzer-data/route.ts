import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseClient';

export async function GET(request: Request) {
  // Return mock data during build or if Supabase is not configured
  if (process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('placeholder') || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return NextResponse.json({
      roles: ["Software Engineer", "Product Manager", "Data Scientist", "UX Designer"],
      locations: ["San Francisco, CA", "New York, NY", "Seattle, WA", "Austin, TX"],
      companies: ["Google", "Meta", "Amazon", "Apple", "Microsoft"],
    });
  }

  try {
    const { data: jobs, error: jobsError } = await supabaseAdmin
      .from('jobs')
      .select('title')
      .order('title', { ascending: true });

    if (jobsError) throw new Error(`Error fetching jobs: ${jobsError.message}`);

    const { data: locations, error: locationsError } = await supabaseAdmin
      .from('locations')
      .select('name')
      .order('name', { ascending: true });

    if (locationsError) throw new Error(`Error fetching locations: ${locationsError.message}`);

    const { data: companies, error: companiesError } = await supabaseAdmin
      .from('companies')
      .select('name')
      .order('name', { ascending: true });

    if (companiesError) throw new Error(`Error fetching companies: ${companiesError.message}`);

    return NextResponse.json({
      roles: jobs.map(j => j.title),
      locations: locations.map(l => l.name),
      companies: companies.map(c => c.name),
    });

  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
