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

    // Insert into analysis_submissions table
    const { data, error } = await supabaseAdmin
      .from('analysis_submissions')
      .insert({
        company: company || null,
        role,
        location,
        level: level || null,
        base_salary: baseSalary,
        equity: equity || 0,
        bonus: bonus || 0,
        total_comp: totalComp,
        market_median: marketMedian,
        grade,
        percentile,
        mode, // 'offer' or 'salary'
        user_agent: userAgent,
        status: 'pending_review', // For quality checks
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving analysis:', error);
      return NextResponse.json(
        { error: 'Failed to save analysis' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, id: data.id });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
