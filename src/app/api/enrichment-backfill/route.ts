import { NextResponse } from 'next/server';
import { backfillMissingAnalysis } from '@/lib/enrichment';

export const dynamic = 'force-dynamic';
export const maxDuration = 120;

/**
 * POST /api/enrichment-backfill
 *
 * Scans entity tables for records missing analysis, enqueues a limited batch.
 * Designed to be called by a cron job (e.g., every 15 minutes).
 *
 * Query params:
 *   ?batchSize=25  — Max entities to enqueue per run (default: 25)
 *
 * Auth: Requires ENRICHMENT_API_KEY or SUPABASE_SERVICE_ROLE_KEY in Bearer header.
 */
export async function POST(request: Request) {
  const authHeader = request.headers.get('authorization');
  const expectedKey = process.env.ENRICHMENT_API_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (expectedKey && authHeader !== `Bearer ${expectedKey}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const batchSize = Math.min(
    parseInt(searchParams.get('batchSize') || '25', 10) || 25,
    100 // Hard ceiling to prevent abuse
  );

  try {
    const result = await backfillMissingAnalysis(batchSize);

    return NextResponse.json({
      message: `Backfill completed: ${result.enqueued} entities enqueued`,
      ...result,
    });
  } catch (error) {
    console.error('Backfill error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
