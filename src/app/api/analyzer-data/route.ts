import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseClient';

export async function GET(request: Request) {
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

    return NextResponse.json({
      roles: jobs.map(j => j.title),
      locations: locations.map(l => l.name),
    });

  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
