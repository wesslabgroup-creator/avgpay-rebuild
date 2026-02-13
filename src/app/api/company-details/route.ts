import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseClient';
import { getEnrichmentStatus, hasRenderableAnalysis, queueEnrichment } from '@/lib/enrichment';
<<<<<<< HEAD
import { buildPageValueBlocks } from '@/lib/value-expansion';
=======
import { buildEntityFaq, evaluateIndexingEligibility, shouldTriggerEnrichment } from '@/lib/seo';
import { generateIntentDrivenFaqs } from '@/lib/intentClassifier';
import { getCompanyExternalLinks } from '@/lib/externalLinks';
>>>>>>> eb7d5f5d3d22cb5cadb1aa47a83d0ebc4e6d001d

type SalarySummaryRow = {
  totalComp: number;
  baseSalary: number | null;
  equity: number | null;
  bonus: number | null;
  yearsExp: number | null;
  level: string | null;
  Role: { title: string } | { title: string }[] | null;
  Location?: { city: string; state: string } | { city: string; state: string }[] | null;
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const companyName = searchParams.get('companyName');

  if (!companyName) {
    return NextResponse.json({ error: 'Company name is required' }, { status: 400 });
  }

  try {
    const { data: companyData, error: companyError } = await supabaseAdmin
      .from('Company')
      .select('*')
      .eq('name', companyName)
      .single();

    if (companyError) throw new Error(`Company not found: ${companyError.message}`);

    const validAnalysis = hasRenderableAnalysis(companyData.analysis, 'Company') ? companyData.analysis : null;
    let enrichmentStatus = 'completed';

    if (!validAnalysis) {
      const status = await getEnrichmentStatus('Company', companyData.id);
      if (!status || status.status === 'failed') {
        await queueEnrichment('Company', companyData.id, companyData.name);
        enrichmentStatus = 'pending';
      } else {
        enrichmentStatus = status.status;
      }
    }

    const { data: rawSalaries, error: summaryError } = await supabaseAdmin
      .from('Salary')
      .select('totalComp, baseSalary, equity, bonus, yearsExp, level, Role!inner(title), Location(city, state)')
      .eq('companyId', companyData.id);

    if (summaryError) throw new Error(`Error fetching salary summary: ${summaryError.message}`);

    const salaryRows = (rawSalaries as SalarySummaryRow[]) || [];

    const roleMap: Record<string, { totalComp: number[]; levels: Set<string> }> = {};
    salaryRows.forEach((row) => {
      const title = Array.isArray(row.Role) ? row.Role[0]?.title : row.Role?.title;
      if (!title) return;
      if (!roleMap[title]) roleMap[title] = { totalComp: [], levels: new Set() };
      roleMap[title].totalComp.push(row.totalComp);
      if (row.level) roleMap[title].levels.add(row.level);
    });

    const aggregatedSummary = Object.entries(roleMap).map(([role, stats]) => {
      const sortedComps = stats.totalComp.sort((a, b) => a - b);
      const median = sortedComps[Math.floor(sortedComps.length / 2)];
      return {
        role,
        minComp: sortedComps[0],
        maxComp: sortedComps[sortedComps.length - 1],
        medianComp: median,
        levelsCount: stats.levels.size,
        dataPoints: stats.totalComp.length,
      };
    });

    const topJobs = [...aggregatedSummary]
      .sort((a, b) => b.medianComp - a.medianComp)
      .slice(0, 10)
      .map((row) => ({ role: row.role, medianComp: row.medianComp, dataPoints: row.dataPoints }));

    const cityMap = new Map<string, number[]>();
    salaryRows.forEach((row) => {
      const loc = Array.isArray(row.Location) ? row.Location[0] : row.Location;
      if (!loc) return;
      const label = `${loc.city}, ${loc.state}`;
      if (!cityMap.has(label)) cityMap.set(label, []);
      cityMap.get(label)?.push(row.totalComp);
    });

    const topCities = Array.from(cityMap.entries())
      .map(([city, comps]) => {
        const sorted = [...comps].sort((a, b) => a - b);
        return { city, medianComp: sorted[Math.floor(sorted.length / 2)], dataPoints: sorted.length };
      })
      .sort((a, b) => b.medianComp - a.medianComp)
      .slice(0, 10);

    const submissionCount = salaryRows.length;
    const allComp = salaryRows.map((row) => row.totalComp).sort((a, b) => a - b);
    const medianComp = allComp.length > 0 ? allComp[Math.floor(allComp.length / 2)] : 0;
    const p25 = allComp.length > 0 ? allComp[Math.floor(allComp.length * 0.25)] : 0;
    const p75 = allComp.length > 0 ? allComp[Math.floor(allComp.length * 0.75)] : 0;

    // Comp Mix
    const withComp = salaryRows.filter((r) => r.totalComp > 0);
    const avgBasePct = withComp.length > 0 ? withComp.reduce((sum, r) => sum + ((r.baseSalary || 0) / r.totalComp) * 100, 0) / withComp.length : 0;
    const avgEquityPct = withComp.length > 0 ? withComp.reduce((sum, r) => sum + ((r.equity || 0) / r.totalComp) * 100, 0) / withComp.length : 0;
    const avgBonusPct = withComp.length > 0 ? withComp.reduce((sum, r) => sum + ((r.bonus || 0) / r.totalComp) * 100, 0) / withComp.length : 0;

    const indexing = evaluateIndexingEligibility({
      entityType: 'Company',
      entityName: companyData.name,
      salarySubmissionCount: submissionCount,
      hasRenderableAnalysis: !!validAnalysis,
    });

    if (shouldTriggerEnrichment({ hasRenderableAnalysis: !!validAnalysis, analysisGeneratedAt: companyData.analysisGeneratedAt || null, salarySubmissionCount: submissionCount }) && enrichmentStatus !== 'processing') {
      await queueEnrichment('Company', companyData.id, companyData.name);
      enrichmentStatus = 'pending';
    }

    // Build enriched FAQ
    const intentFaqs = generateIntentDrivenFaqs('Company', companyData.name, {
      medianComp: medianComp,
      submissionCount,
      p25,
      p75,
      topPayingEntity: topJobs[0]?.role,
    });
    const genericFaqs = buildEntityFaq(companyData.name, 'Company', submissionCount, medianComp);
    const seenQuestions = new Set(intentFaqs.map((f) => f.question));
    const combinedFaqs = [...intentFaqs, ...genericFaqs.filter((f) => !seenQuestions.has(f.question))];

    const externalLinks = getCompanyExternalLinks(companyData.name);

    return NextResponse.json({
      companyData: {
        ...companyData,
        analysis: validAnalysis,
        analysisGeneratedAt: companyData.analysisGeneratedAt || null,
      },
      salarySummary: aggregatedSummary,
      topJobs,
      topCities,
      enrichmentStatus,
<<<<<<< HEAD
      valueBlocks: await buildPageValueBlocks('Company', companyData.id, companyData.name),
=======
      indexing,
      faq: combinedFaqs,
      percentiles: { p25, p50: medianComp, p75 },
      compMix: {
        avgBasePct: Math.round(avgBasePct * 10) / 10,
        avgEquityPct: Math.round(avgEquityPct * 10) / 10,
        avgBonusPct: Math.round(avgBonusPct * 10) / 10,
      },
      dataConfidence: {
        submissionCount,
        roleCount: Object.keys(roleMap).length,
        cityCount: cityMap.size,
        confidenceLabel: submissionCount >= 50 ? 'high' : submissionCount >= 20 ? 'moderate' : submissionCount >= 5 ? 'limited' : 'insufficient',
      },
      externalLinks,
>>>>>>> eb7d5f5d3d22cb5cadb1aa47a83d0ebc4e6d001d
    });
  } catch (error: unknown) {
    console.error('API Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
