import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseClient';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      company,
      role,
      location,
      level,
      baseSalary,
      equity,
      bonus,
      totalComp,
      marketMedian,
      grade,
      percentile,
      mode,
      userAgent,
    } = body;

    // Insert into AnalysisSubmission table
    const { data, error } = await (supabaseAdmin
      .from('AnalysisSubmission')
      .insert({
        company: company || null,
        role,
        location,
        level: level || null,
        baseSalary,
        equity: equity || 0,
        bonus: bonus || 0,
        totalComp,
        marketMedian,
        grade,
        percentile,
        mode, // 'offer' or 'salary'
        userAgent,
        status: 'pending',
      })
      .select()
      .single() as any);

    if (error) {
      console.error('Error saving analysis:', error);
      return NextResponse.json(
        { error: 'Failed to save analysis' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, id: data.id });
  } catch (error: unknown) {
    console.error('Error capturing lead:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
