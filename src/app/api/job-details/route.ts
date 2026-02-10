import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseClient';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const jobTitle = searchParams.get('jobTitle');

  if (!jobTitle) {
    return NextResponse.json({ error: 'Job title is required' }, { status: 400 });
  }

  try {
    // 1. Get Job Details (Role)
    const { data: jobData, error: jobError } = await (supabaseAdmin
      .from('Role')
      .select('*')
      .eq('title', jobTitle)
      .single() as any);

    if (jobError) throw new Error(`Job not found: ${jobError.message}`);

    // 2. Get Top 5 Companies
    const { data: topSalaries, error: topSalariesError } = await (supabaseAdmin
      .from('Salary')
      .select('totalComp, Company!inner(name)')
      .eq('roleId', jobData.id)
      .order('totalComp', { ascending: false })
      .limit(5) as any);

    if (topSalariesError) throw new Error(`Error fetching top companies: ${topSalariesError.message}`);

    const topCompanies = topSalaries?.map((s: any) => ({
      company_name: s.Company?.name,
      total_comp: s.totalComp
    }));

    // 3. Get Top 5 Locations
    const { data: locSalaries, error: locSalariesError } = await (supabaseAdmin
      .from('Salary')
      .select('totalComp, Location!inner(city, state)')
      .eq('roleId', jobData.id)
      .order('totalComp', { ascending: false })
      .limit(5) as any);

    if (locSalariesError) throw new Error(`Error fetching top locations: ${locSalariesError.message}`);

    const topLocations = locSalaries?.map((s: any) => ({
      location: `${s.Location?.city}, ${s.Location?.state}`,
      total_comp: s.totalComp
    }));

    // 4. Get Bottom 5 Locations
    const { data: bottomLocSalaries, error: bottomLocSalariesError } = await (supabaseAdmin
      .from('Salary')
      .select('totalComp, Location!inner(city, state)')
      .eq('roleId', jobData.id)
      .order('totalComp', { ascending: true })
      .limit(5) as any);

    if (bottomLocSalariesError) throw new Error(`Error fetching bottom locations: ${bottomLocSalariesError.message}`);

    const bottomLocations = bottomLocSalaries?.map((s: any) => ({
      location: `${s.Location?.city}, ${s.Location?.state}`,
      total_comp: s.totalComp
    }));

    // 5. Get Salary Distribution Data
    const { data: distributionData, error: distributionError } = await (supabaseAdmin
      .from('Salary')
      .select('totalComp')
      .eq('roleId', jobData.id) as any);

    if (distributionError) throw new Error(`Error fetching salary distribution: ${distributionError.message}`);

    const salaries = distributionData?.map((s: any) => s.totalComp) || [];
    const sortedSalaries = [...salaries].sort((a, b) => a - b);

    const count = salaries.length;
    const median = count > 0 ? sortedSalaries[Math.floor(count / 2)] : 0;
    const min = count > 0 ? sortedSalaries[0] : 0;
    const max = count > 0 ? sortedSalaries[count - 1] : 0;

    // 6. Get Related Jobs
    const { data: relatedJobs, error: relatedJobsError } = await (supabaseAdmin
      .from('Role')
      .select('title')
      .neq('title', jobTitle)
      .limit(5) as any);

    if (relatedJobsError) throw new Error(`Error fetching related jobs: ${relatedJobsError.message}`);

    return NextResponse.json({
      jobData: {
        ...jobData,
        global_count: count,
        global_median_comp: median,
        global_min_comp: min,
        global_max_comp: max,
      },
      topCompanies,
      topLocations,
      bottomLocations,
      salaryDistribution: salaries.map((s: number) => ({ total_comp: s })),
      relatedJobs,
    });

  } catch (error: unknown) {
    console.error('API Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
