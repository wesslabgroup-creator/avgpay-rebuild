import { NextResponse } from 'next/server';
import { buildCityContextData, getEnrichmentStatus, hasRenderableAnalysis, queueEnrichment } from '@/lib/enrichment';
import { supabaseAdmin } from '@/lib/supabaseClient';
<<<<<<< HEAD
import { getNearbyCities } from '@/lib/internal-linking';
import { buildPageValueBlocks } from '@/lib/value-expansion';
=======
import { buildEntityFaq, evaluateIndexingEligibility, shouldTriggerEnrichment } from '@/lib/seo';
import { generateIntentDrivenFaqs } from '@/lib/intentClassifier';
import { getCityExternalLinks } from '@/lib/externalLinks';
>>>>>>> eb7d5f5d3d22cb5cadb1aa47a83d0ebc4e6d001d

type SalaryWithCompanyAndRole = {
  totalComp: number;
  baseSalary: number | null;
  equity: number | null;
  bonus: number | null;
  level: string | null;
  Company: { name: string } | { name: string }[] | null;
  Role: { title: string } | { title: string }[] | null;
};

/**
 * GET /api/city-details?city=atlanta
 *
 * Returns city/location metadata, salary stats, top companies, top jobs,
 * and the Gemini-generated analysis if available.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const citySlug = searchParams.get('city');

  if (!citySlug) {
    return NextResponse.json({ error: 'City slug is required' }, { status: 400 });
  }

  try {
    // 1. Find the Location by slug (case-insensitive)
    const { data: locationData, error: locationError } = await supabaseAdmin
      .from('Location')
      .select('*')
      .ilike('slug', citySlug)
      .single();

    if (locationError) {
      // Try matching by city name as fallback
      const cityName = citySlug.replace(/-/g, ' ');
      const { data: fallbackData, error: fallbackError } = await supabaseAdmin
        .from('Location')
        .select('*')
        .ilike('city', cityName)
        .limit(1)
        .maybeSingle();

      if (fallbackError || !fallbackData) {
        return NextResponse.json(
          { error: `City not found: ${citySlug}` },
          { status: 404 }
        );
      }

      return await buildCityResponse(fallbackData);
    }

    return await buildCityResponse(locationData);
  } catch (error) {
    console.error('City details API error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

async function buildCityResponse(locationData: {
  id: string;
  city: string;
  state: string;
  country: string;
  metro: string;
  slug: string;
  analysis?: Record<string, string> | null;
  analysisGeneratedAt?: string | null;
}) {
  const locationId = locationData.id;

  const validAnalysis = hasRenderableAnalysis(locationData.analysis, 'City')
    ? locationData.analysis
    : null;

  let enrichmentStatus = 'completed';
  if (!validAnalysis) {
    const status = await getEnrichmentStatus('City', locationId);

    if (!status || status.status === 'failed') {
      const contextData = buildCityContextData({
        city: locationData.city,
        state: locationData.state,
      });
      await queueEnrichment('City', locationId, `${locationData.city}, ${locationData.state}`, contextData);
      enrichmentStatus = 'pending';
    } else {
      enrichmentStatus = status.status;
    }
  }

  // 2. Fetch all salaries for this location with company and role info
  const { data: rawSalaries, error: salaryError } = await supabaseAdmin
    .from('Salary')
    .select('totalComp, baseSalary, equity, bonus, level, Company!inner(name), Role!inner(title)')
    .eq('locationId', locationId)
    .limit(500);

  if (salaryError) {
    return NextResponse.json(
      { error: `Error fetching salary data: ${salaryError.message}` },
      { status: 500 }
    );
  }

  const salaries = (rawSalaries as SalaryWithCompanyAndRole[] | null) || [];

  // 3. Aggregate stats
  const allComps = salaries.map(s => s.totalComp).sort((a, b) => a - b);
  const count = allComps.length;
  const median = count > 0 ? allComps[Math.floor(count / 2)] : 0;
  const min = count > 0 ? allComps[0] : 0;
  const max = count > 0 ? allComps[count - 1] : 0;

  // Full percentiles
  const p10 = count > 0 ? allComps[Math.floor(count * 0.10)] : 0;
  const p25 = count > 0 ? allComps[Math.floor(count * 0.25)] : 0;
  const p75 = count > 0 ? allComps[Math.floor(count * 0.75)] : 0;
  const p90 = count > 0 ? allComps[Math.floor(count * 0.90)] : 0;

  // Comp Mix Averages
  const withComp = salaries.filter((r) => r.totalComp > 0);
  const avgBasePct = withComp.length > 0 ? withComp.reduce((sum, r) => sum + ((r.baseSalary || 0) / r.totalComp) * 100, 0) / withComp.length : 0;
  const avgEquityPct = withComp.length > 0 ? withComp.reduce((sum, r) => sum + ((r.equity || 0) / r.totalComp) * 100, 0) / withComp.length : 0;
  const avgBonusPct = withComp.length > 0 ? withComp.reduce((sum, r) => sum + ((r.bonus || 0) / r.totalComp) * 100, 0) / withComp.length : 0;

  // 4. Top Companies by median comp
  const companyMap = new Map<string, number[]>();
  salaries.forEach(s => {
    const name = Array.isArray(s.Company) ? s.Company[0]?.name : s.Company?.name;
    if (name) {
      if (!companyMap.has(name)) companyMap.set(name, []);
      companyMap.get(name)!.push(s.totalComp);
    }
  });

  const topCompanies = Array.from(companyMap.entries())
    .map(([name, comps]) => {
      const sorted = [...comps].sort((a, b) => a - b);
      return {
        company_name: name,
        median_comp: sorted[Math.floor(sorted.length / 2)],
        data_points: sorted.length,
      };
    })
    .sort((a, b) => b.median_comp - a.median_comp)
    .slice(0, 10);

  // 5. Top Jobs by median comp
  const roleMap = new Map<string, number[]>();
  salaries.forEach(s => {
    const title = Array.isArray(s.Role) ? s.Role[0]?.title : s.Role?.title;
    if (title) {
      if (!roleMap.has(title)) roleMap.set(title, []);
      roleMap.get(title)!.push(s.totalComp);
    }
  });

  const topJobs = Array.from(roleMap.entries())
    .map(([title, comps]) => {
      const sorted = [...comps].sort((a, b) => a - b);
      return {
        job_title: title,
        median_comp: sorted[Math.floor(sorted.length / 2)],
        data_points: sorted.length,
      };
    })
    .sort((a, b) => b.median_comp - a.median_comp)
    .slice(0, 10);

  const indexing = evaluateIndexingEligibility({
    entityType: 'City',
    entityName: `${locationData.city}, ${locationData.state}`,
    salarySubmissionCount: count,
    hasRenderableAnalysis: !!validAnalysis,
  });

  const shouldQueue = shouldTriggerEnrichment({
    hasRenderableAnalysis: !!validAnalysis,
    analysisGeneratedAt: locationData.analysisGeneratedAt || null,
    salarySubmissionCount: count,
  });

  if (shouldQueue && enrichmentStatus !== 'processing') {
    const contextData = buildCityContextData({ city: locationData.city, state: locationData.state });
    await queueEnrichment('City', locationData.id, `${locationData.city}, ${locationData.state}`, contextData);
    enrichmentStatus = 'pending';
  }

  const cityLabel = `${locationData.city}, ${locationData.state}`;

  // Build enriched FAQ
  const intentFaqs = generateIntentDrivenFaqs('City', cityLabel, {
    medianComp: median,
    submissionCount: count,
    p25,
    p75,
    topPayingEntity: topJobs[0]?.job_title,
  });
  const genericFaqs = buildEntityFaq(cityLabel, 'City', count, median);
  const seenQuestions = new Set(intentFaqs.map((f) => f.question));
  const combinedFaqs = [...intentFaqs, ...genericFaqs.filter((f) => !seenQuestions.has(f.question))];

  const externalLinks = getCityExternalLinks(locationData.city, locationData.state);

  return NextResponse.json({
    cityData: {
      id: locationData.id,
      city: locationData.city,
      state: locationData.state,
      country: locationData.country,
      metro: locationData.metro,
      slug: locationData.slug,
      analysis: validAnalysis,
      analysisGeneratedAt: locationData.analysisGeneratedAt || null,
    },
    stats: {
      count,
      median,
      min,
      max,
      p10,
      p25,
      p75,
      p90,
    },
    topCompanies,
    topJobs,
    enrichmentStatus,
<<<<<<< HEAD
    nearbyCities: await getNearbyCities(locationData.city, locationData.state, locationData.id),
    valueBlocks: await buildPageValueBlocks('Location', locationData.id, `${locationData.city}, ${locationData.state}`),
=======
    indexing,
    faq: combinedFaqs,
    compMix: {
      avgBasePct: Math.round(avgBasePct * 10) / 10,
      avgEquityPct: Math.round(avgEquityPct * 10) / 10,
      avgBonusPct: Math.round(avgBonusPct * 10) / 10,
    },
    dataConfidence: {
      submissionCount: count,
      companyCount: companyMap.size,
      roleCount: roleMap.size,
      confidenceLabel: count >= 50 ? 'high' : count >= 20 ? 'moderate' : count >= 5 ? 'limited' : 'insufficient',
    },
    externalLinks,
>>>>>>> eb7d5f5d3d22cb5cadb1aa47a83d0ebc4e6d001d
  });
}
