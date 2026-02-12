import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseClient';
import { getEnrichmentStatus, hasRenderableAnalysis, queueEnrichment } from '@/lib/enrichment';
import { buildEntityFaq, evaluateIndexingEligibility, shouldTriggerEnrichment } from '@/lib/seo';
import { generateIntentDrivenFaqs } from '@/lib/intentClassifier';
import { getJobExternalLinks } from '@/lib/externalLinks';

type CompanySalaryRow = { totalComp: number; Company: { name: string } | { name: string }[] | null };
type LocationSalaryRow = { totalComp: number; Location: { city: string; state: string } | { city: string; state: string }[] | null };
type SalaryMixRow = { totalComp: number; baseSalary: number | null; equity: number | null; bonus: number | null; yearsExp: number | null };

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

    const topCompanies = Array.from(companyMap.entries())
      .map(([name, comps]) => {
        comps.sort((a, b) => a - b);
        const median = comps[Math.floor(comps.length / 2)];
        return { company_name: name, total_comp: median };
      })
      .sort((a, b) => b.total_comp - a.total_comp)
      .slice(0, 10);


    // 3. Get Top 5 Locations (Aggregated)
    const { data: locSalaries, error: locSalariesError } = await (supabaseAdmin
      .from('Salary')
      .select('totalComp, Location!inner(city, state)')
      .eq('roleId', jobData.id)
      .order('totalComp', { ascending: false })
      .limit(200));

    if (locSalariesError) throw new Error(`Error fetching top locations: ${locSalariesError.message}`);

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
      .slice(0, 10);

    // 4. Get Bottom 5 Locations (Aggregated)
    const { data: bottomLocSalaries, error: bottomLocSalariesError } = await (supabaseAdmin
      .from('Salary')
      .select('totalComp, Location!inner(city, state)')
      .eq('roleId', jobData.id)
      .order('totalComp', { ascending: true })
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
      .sort((a, b) => a.total_comp - b.total_comp)
      .slice(0, 10);

    // 5. Get Salary Distribution Data + Comp Mix + YoE breakdown
    const { data: distributionData, error: distributionError } = await (supabaseAdmin
      .from('Salary')
      .select('totalComp, baseSalary, equity, bonus, yearsExp')
      .eq('roleId', jobData.id));

    if (distributionError) throw new Error(`Error fetching salary distribution: ${distributionError.message}`);

    const mixRows = (distributionData as SalaryMixRow[] | null) || [];
    const salaries = mixRows.map((s) => s.totalComp);
    const sortedSalaries = [...salaries].sort((a, b) => a - b);

    const count = salaries.length;
    const median = count > 0 ? sortedSalaries[Math.floor(count / 2)] : 0;
    const min = count > 0 ? sortedSalaries[0] : 0;
    const max = count > 0 ? sortedSalaries[count - 1] : 0;
    const p25 = count > 0 ? sortedSalaries[Math.floor(count * 0.25)] : 0;
    const p75 = count > 0 ? sortedSalaries[Math.floor(count * 0.75)] : 0;
    const p10 = count > 0 ? sortedSalaries[Math.floor(count * 0.1)] : 0;
    const p90 = count > 0 ? sortedSalaries[Math.floor(count * 0.9)] : 0;

    // Comp Mix Averages
    const withComp = mixRows.filter((r) => r.totalComp > 0);
    const avgBasePct = withComp.length > 0 ? withComp.reduce((sum, r) => sum + ((r.baseSalary || 0) / r.totalComp) * 100, 0) / withComp.length : 0;
    const avgEquityPct = withComp.length > 0 ? withComp.reduce((sum, r) => sum + ((r.equity || 0) / r.totalComp) * 100, 0) / withComp.length : 0;
    const avgBonusPct = withComp.length > 0 ? withComp.reduce((sum, r) => sum + ((r.bonus || 0) / r.totalComp) * 100, 0) / withComp.length : 0;

    // YoE Buckets
    const yoeBuckets: Record<string, number[]> = {};
    for (const row of mixRows) {
      if (row.yearsExp === null || row.yearsExp === undefined) continue;
      let bucket: string;
      if (row.yearsExp <= 2) bucket = '0-2';
      else if (row.yearsExp <= 5) bucket = '3-5';
      else if (row.yearsExp <= 10) bucket = '6-10';
      else if (row.yearsExp <= 15) bucket = '11-15';
      else bucket = '16+';
      if (!yoeBuckets[bucket]) yoeBuckets[bucket] = [];
      yoeBuckets[bucket].push(row.totalComp);
    }

    const yoeProgression = Object.entries(yoeBuckets)
      .map(([range, comps]) => {
        const sorted = [...comps].sort((a, b) => a - b);
        return {
          yoeRange: range,
          medianComp: sorted[Math.floor(sorted.length / 2)],
          count: sorted.length,
        };
      })
      .sort((a, b) => {
        const order = ['0-2', '3-5', '6-10', '11-15', '16+'];
        return order.indexOf(a.yoeRange) - order.indexOf(b.yoeRange);
      });

    const indexing = evaluateIndexingEligibility({
      entityType: 'Job',
      entityName: jobData.title,
      salarySubmissionCount: count,
      hasRenderableAnalysis: !!validAnalysis,
    });

    const shouldQueue = shouldTriggerEnrichment({
      hasRenderableAnalysis: !!validAnalysis,
      analysisGeneratedAt: jobData.analysisGeneratedAt || null,
      salarySubmissionCount: count,
    });

    if (shouldQueue && enrichmentStatus !== 'processing') {
      await queueEnrichment('Job', jobData.id, jobData.title);
      enrichmentStatus = 'pending';
    }

    // 6. Get Related Jobs
    const { data: relatedJobs, error: relatedJobsError } = await (supabaseAdmin
      .from('Role')
      .select('title')
      .neq('title', jobTitle)
      .limit(10));

    if (relatedJobsError) throw new Error(`Error fetching related jobs: ${relatedJobsError.message}`);

    // Build enriched FAQ (intent-driven + generic fallback)
    const intentFaqs = generateIntentDrivenFaqs('Job', jobData.title, {
      medianComp: median,
      submissionCount: count,
      p25,
      p75,
      topPayingEntity: topCompanies[0]?.company_name,
    });
    const genericFaqs = buildEntityFaq(jobData.title, 'Job', count, median);
    const seenQuestions = new Set(intentFaqs.map((f) => f.question));
    const combinedFaqs = [...intentFaqs, ...genericFaqs.filter((f) => !seenQuestions.has(f.question))];

    // External authority links
    const externalLinks = getJobExternalLinks(jobData.title);

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
      indexing,
      faq: combinedFaqs,
      // New DB-derived value modules
      percentiles: { p10, p25, p50: median, p75, p90 },
      compMix: {
        avgBasePct: Math.round(avgBasePct * 10) / 10,
        avgEquityPct: Math.round(avgEquityPct * 10) / 10,
        avgBonusPct: Math.round(avgBonusPct * 10) / 10,
      },
      yoeProgression,
      dataConfidence: {
        submissionCount: count,
        diversityScore: companyMap.size + locationMap.size,
        hasPercentileData: count >= 5,
        confidenceLabel: count >= 50 ? 'high' : count >= 20 ? 'moderate' : count >= 5 ? 'limited' : 'insufficient',
      },
      externalLinks,
    });

  } catch (error: unknown) {
    console.error('API Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
