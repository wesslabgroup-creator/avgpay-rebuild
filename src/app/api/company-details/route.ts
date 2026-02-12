import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseClient';
import { getEnrichmentStatus, hasRenderableAnalysis, queueEnrichment } from '@/lib/enrichment';
import { buildEntityFaq, evaluateIndexingEligibility, shouldTriggerEnrichment } from '@/lib/seo';

type SalarySummaryRow = {
  totalComp: number;
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
      .select('totalComp, level, Role!inner(title), Location(city, state)')
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
      indexing,
      faq: buildEntityFaq(companyData.name, 'Company', submissionCount, medianComp),
    });
  } catch (error: unknown) {
    console.error('API Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
