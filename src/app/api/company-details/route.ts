import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseClient';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const companyName = searchParams.get('companyName');

  if (!companyName) {
    return NextResponse.json({ error: 'Company name is required' }, { status: 400 });
  }

  try {
    // 1. Get Company Details
    const { data: companyData, error: companyError } = await supabaseAdmin
      .from('companies')
      .select('*, description, seo_meta_title, seo_meta_description')
      .eq('name', companyName)
      .single();

    if (companyError) throw new Error(`Company not found: ${companyError.message}`);

    // 2. Get Salary Summary by Role for this Company
    const { data: salarySummary, error: summaryError } = await supabaseAdmin
      .from('salaries')
      .select('job_title, total_comp, level')
      .eq('company_name', companyName);

    if (summaryError) throw new Error(`Error fetching salary summary: ${summaryError.message}`);

    // Aggregate the salary data by role
    const roleMap: Record<string, { totalComp: number[], levels: Set<string> }> = {};
    salarySummary.forEach(row => {
      if (!roleMap[row.job_title]) {
        roleMap[row.job_title] = { totalComp: [], levels: new Set() };
      }
      roleMap[row.job_title].totalComp.push(row.total_comp);
      if (row.level) {
        roleMap[row.job_title].levels.add(row.level);
      }
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

    return NextResponse.json({
      companyData,
      salarySummary: aggregatedSummary,
    });

  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
