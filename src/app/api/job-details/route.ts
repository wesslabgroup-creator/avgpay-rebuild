import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseClient';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const jobTitle = searchParams.get('jobTitle');

  if (!jobTitle) {
    return NextResponse.json({ error: 'Job title is required' }, { status: 400 });
  }

  try {
    // 1. Get Job Details (Global Aggregates)
    const { data: jobData, error: jobError } = await supabaseAdmin
      .from('jobs')
      .select('*, description, seo_meta_title, seo_meta_description')
      .eq('title', jobTitle)
      .single();

    if (jobError) throw new Error(`Job not found: ${jobError.message}`);

    // 2. Get Top 5 Companies
    const { data: topCompanies, error: topCompaniesError } = await supabaseAdmin
      .from('salaries')
      .select('company_name, total_comp')
      .eq('job_title', jobTitle)
      .order('total_comp', { ascending: false })
      .limit(5);

    if (topCompaniesError) throw new Error(`Error fetching top companies: ${topCompaniesError.message}`);

    // 3. Get Top 5 Locations
    const { data: topLocations, error: topLocationsError } = await supabaseAdmin
      .from('salaries')
      .select('location, total_comp')
      .eq('job_title', jobTitle)
      .order('total_comp', { ascending: false })
      .limit(5);
      
    if (topLocationsError) throw new Error(`Error fetching top locations: ${topLocationsError.message}`);
      
    // 4. Get Bottom 5 Locations
    const { data: bottomLocations, error: bottomLocationsError } = await supabaseAdmin
      .from('salaries')
      .select('location, total_comp')
      .eq('job_title', jobTitle)
      .order('total_comp', { ascending: true })
      .limit(5);

    if (bottomLocationsError) throw new Error(`Error fetching bottom locations: ${bottomLocationsError.message}`);

    // 5. Get Salary Distribution Data (simplified for now)
    const { data: salaryDistribution, error: distributionError } = await supabaseAdmin
      .from('salaries')
      .select('total_comp')
      .eq('job_title', jobTitle);
      
    if (distributionError) throw new Error(`Error fetching salary distribution: ${distributionError.message}`);

    // 6. Get Related Jobs (simplified logic for now)
    const { data: relatedJobs, error: relatedJobsError } = await supabaseAdmin
      .from('jobs')
      .select('title')
      .neq('title', jobTitle)
      .limit(5);

    if (relatedJobsError) throw new Error(`Error fetching related jobs: ${relatedJobsError.message}`);


    return NextResponse.json({
      jobData,
      topCompanies,
      topLocations,
      bottomLocations,
      salaryDistribution,
      relatedJobs,
    });

  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
