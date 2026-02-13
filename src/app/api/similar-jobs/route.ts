import { NextResponse } from 'next/server';
import { getSimilarJobs } from '@/lib/comparisonEngine';

/**
 * GET /api/similar-jobs?job=software-engineer&city=Austin&limit=6
 *
 * Returns similar jobs ranked by a combination of salary band similarity
 * and job family overlap. Supports optional city filter.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const job = searchParams.get('job');
  const city = searchParams.get('city') || undefined;
  const limit = Math.min(parseInt(searchParams.get('limit') || '6', 10), 20);

  if (!job) {
    return NextResponse.json({ error: 'Job title or slug is required' }, { status: 400 });
  }

  try {
    const similar = await getSimilarJobs(decodeURIComponent(job), limit, city);
    return NextResponse.json({
      source: decodeURIComponent(job),
      cityFilter: city || null,
      similar,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
