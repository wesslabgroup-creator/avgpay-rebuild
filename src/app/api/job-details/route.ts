import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseClient';
import { getEnrichmentStatus, hasRenderableAnalysis, queueEnrichment } from '@/lib/enrichment';
import { buildPageValueBlocks } from '@/lib/value-expansion';

type CompanySalaryRow = { totalComp: number; Company: { name: string } | { name: string }[] | null };
type LocationSalaryRow = { totalComp: number; Location: { city: string; state: string } | { city: string; state: string }[] | null };
type DistributionRow = { totalComp: number };

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
      .single());

    if (jobError) throw new Error(`Job not found: ${jobError.message}`);

    const validAnalysis = hasRenderableAnalysis(jobData.analysis, 'Job')
      ? jobData.analysis
      : null;

    // Ensure enrichment is queued if analysis is missing/blank or previously failed.
    let enrichmentStatus = 'completed';
    if (!validAnalysis) {
      const status = await getEnrichmentStatus('Job', jobData.id);
      if (!status || status.status === 'failed') {
        await queueEnrichment('Job', jobData.id, jobData.title);
        enrichmentStatus = 'pending';
      } else {
        enrichmentStatus = status.status;
      }
    }

    // 2. Get Top Companies (Aggregated)
    // Fetch more rows to allow for aggregation
    const { data: topSalaries, error: topSalariesError } = await (supabaseAdmin
      .from('Salary')
      .select('totalComp, Company!inner(name)')
      .eq('roleId', jobData.id)
      .order('totalComp', { ascending: false })
      .limit(200));

    if (topSalariesError) throw new Error(`Error fetching top companies: ${topSalariesError.message}`);

    // Aggregate by Company Name
    const companyMap = new Map<string, number[]>();
    (topSalaries as CompanySalaryRow[] | null)?.forEach((s) => {
      const companyName = Array.isArray(s.Company) ? s.Company[0]?.name : s.Company?.name;
      if (companyName) {
        if (!companyMap.has(companyName)) {
          companyMap.set(companyName, []);
        }
        companyMap.get(companyName)?.push(s.totalComp);
      }
    });

    // Calculate median for each company and sort
    const topCompanies = Array.from(companyMap.entries())
      .map(([name, comps]) => {
        comps.sort((a, b) => a - b);
        const median = comps[Math.floor(comps.length / 2)];
        return { company_name: name, total_comp: median };
      })
      .sort((a, b) => b.total_comp - a.total_comp)
      .slice(0, 5);


    // 3. Get Top 5 Locations (Aggregated)
    const { data: locSalaries, error: locSalariesError } = await (supabaseAdmin
      .from('Salary')
      .select('totalComp, Location!inner(city, state)')
      .eq('roleId', jobData.id)
      .order('totalComp', { ascending: false })
      .limit(200));

    if (locSalariesError) throw new Error(`Error fetching top locations: ${locSalariesError.message}`);

    // Aggregate by Location
    const locationMap = new Map<string, number[]>();
    (locSalaries as LocationSalaryRow[] | null)?.forEach((s) => {
      const locObj = Array.isArray(s.Location) ? s.Location[0] : s.Location;
      if (locObj) {
        const locName = `${locObj.city}, ${locObj.state}`;
        if (!locationMap.has(locName)) {
          locationMap.set(locName, []);
        }
        locationMap.get(locName)?.push(s.totalComp);
      }
    });

    const topLocations = Array.from(locationMap.entries())
      .map(([loc, comps]) => {
        comps.sort((a, b) => a - b);
        const median = comps[Math.floor(comps.length / 2)];
        return { location: loc, total_comp: median };
      })
      .sort((a, b) => b.total_comp - a.total_comp)
      .slice(0, 5);

    // 4. Get Bottom 5 Locations (Aggregated)
    // We reuse the same location aggregation logic but sort ascending,
    // however, to get the TRUE bottom, we should probably fetch from the bottom.
    // For simplicity and performance, let's fetch bottom 200 sorted ASC.
    const { data: bottomLocSalaries, error: bottomLocSalariesError } = await (supabaseAdmin
      .from('Salary')
      .select('totalComp, Location!inner(city, state)')
      .eq('roleId', jobData.id)
      .order('totalComp', { ascending: true }) // Validation: Order ASC for bottom
      .limit(200));

    if (bottomLocSalariesError) throw new Error(`Error fetching bottom locations: ${bottomLocSalariesError.message}`);

    const bottomLocationMap = new Map<string, number[]>();
    (bottomLocSalaries as LocationSalaryRow[] | null)?.forEach((s) => {
      const locObj = Array.isArray(s.Location) ? s.Location[0] : s.Location;
      if (locObj) {
        const locName = `${locObj.city}, ${locObj.state}`;
        if (!bottomLocationMap.has(locName)) {
          bottomLocationMap.set(locName, []);
        }
        bottomLocationMap.get(locName)?.push(s.totalComp);
      }
    });

    const bottomLocations = Array.from(bottomLocationMap.entries())
      .map(([loc, comps]) => {
        comps.sort((a, b) => a - b);
        const median = comps[Math.floor(comps.length / 2)];
        return { location: loc, total_comp: median };
      })
      .sort((a, b) => a.total_comp - b.total_comp) // Sort ASC
      .slice(0, 5);

    // 5. Get Salary Distribution Data
    const { data: distributionData, error: distributionError } = await (supabaseAdmin
      .from('Salary')
      .select('totalComp')
      .eq('roleId', jobData.id));

    if (distributionError) throw new Error(`Error fetching salary distribution: ${distributionError.message}`);

    const salaries = (distributionData as DistributionRow[] | null)?.map((s) => s.totalComp) || [];
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
      .limit(5));

    if (relatedJobsError) throw new Error(`Error fetching related jobs: ${relatedJobsError.message}`);

    return NextResponse.json({
      jobData: {
        ...jobData,
        analysis: validAnalysis,
        analysisGeneratedAt: jobData.analysisGeneratedAt || null,
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
      enrichmentStatus,
      valueBlocks: await buildPageValueBlocks('Role', jobData.id, jobTitle),
    });

  } catch (error: unknown) {
    console.error('API Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
