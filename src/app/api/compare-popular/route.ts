import { NextResponse } from 'next/server';
import { getPopularComparisons } from '@/lib/comparisonEngine';

/**
 * GET /api/compare-popular?limit=12
 *
 * Returns dynamically generated popular comparisons based on data density.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = Math.min(parseInt(searchParams.get('limit') || '12', 10), 30);

  try {
    const comparisons = await getPopularComparisons(limit);
    return NextResponse.json({ comparisons });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
