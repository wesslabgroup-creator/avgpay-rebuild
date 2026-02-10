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
    const { data: companyData, error: companyError } = await (supabaseAdmin
      .from('Company')
      .select('*')
      .eq('name', companyName)
      .single() as any);

    if (companyError) throw new Error(`Company not found: ${companyError.message}`);

    // 2. Get Salary Summary by Role for this Company
    const { data: rawSalaries, error: summaryError } = await (supabaseAdmin
      .from('Salary')
      .select('totalComp, level, Role!inner(title)')
      .eq('companyId', companyData.id) as any);

    if (summaryError) throw new Error(`Error fetching salary summary: ${summaryError.message}`);

    // Aggregate the salary data by role
    const roleMap: Record<string, { totalComp: number[], levels: Set<string> }> = {};
    rawSalaries.forEach((row: any) => {
      const title = row.Role?.title;
      if (title) {
        if (!roleMap[title]) {
          roleMap[title] = { totalComp: [], levels: new Set() };
        }
        roleMap[title].totalComp.push(row.totalComp);
        if (row.level) {
          roleMap[title].levels.add(row.level);
        }
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

  } catch (error: unknown) {
    console.error('API Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
