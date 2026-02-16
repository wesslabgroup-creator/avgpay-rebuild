import { NextResponse } from 'next/server';
import { processNextEnrichmentJob, processAllPendingJobs } from '@/lib/enrichment';

export const dynamic = 'force-dynamic';
export const maxDuration = 300; // LLM calls can take 60s+ per model

function isAuthorized(request: Request): boolean {
  const authHeader = request.headers.get('authorization');
  const configuredSecrets = [process.env.ENRICHMENT_API_KEY, process.env.CRON_SECRET]
    .filter((value): value is string => !!value && value.trim().length > 0);

  // In local/dev environments where no key is configured, allow manual testing.
  if (configuredSecrets.length === 0) {
    return process.env.NODE_ENV !== 'production';
  }

  return configuredSecrets.some((secret) => authHeader === `Bearer ${secret}`);
}

/**
 * POST /api/enrichment-queue
 *
 * Processes pending enrichment jobs from the queue.
 * Designed to be called by a cron job, webhook, or manual trigger.
 *
 * Query params:
 *   ?mode=all   — Process all pending jobs (batch)
 *   ?mode=single — Process the next single job (default)
 */
export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const mode = searchParams.get('mode') || 'single';

  try {
    if (mode === 'all') {
      const result = await processAllPendingJobs();
      return NextResponse.json({
        message: `Processed ${result.totalProcessed} enrichment job(s)`,
        ...result,
      });
    }

    // Single mode (default)
    const result = await processNextEnrichmentJob();

    if (!result.processed) {
      return NextResponse.json({
        message: 'No pending jobs in queue',
        ...result,
      });
    }

    return NextResponse.json({
      message: `Processed job for ${result.entityType} "${result.entityName}"`,
      ...result,
    });
  } catch (error) {
    console.error('Enrichment queue processing error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

/**
 * GET /api/enrichment-queue
 *
 * Returns current queue status (counts by status).
 */
export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { supabaseAdmin } = await import('@/lib/supabaseClient');

    const { data: pending } = await supabaseAdmin
      .from('EnrichmentQueue')
      .select('id', { count: 'exact' })
      .eq('status', 'pending');

    const { data: processing } = await supabaseAdmin
      .from('EnrichmentQueue')
      .select('id', { count: 'exact' })
      .eq('status', 'processing');

    const { data: completed } = await supabaseAdmin
      .from('EnrichmentQueue')
      .select('id', { count: 'exact' })
      .eq('status', 'completed');

    const { data: failed } = await supabaseAdmin
      .from('EnrichmentQueue')
      .select('id', { count: 'exact' })
      .eq('status', 'failed');

    return NextResponse.json({
      queue: {
        pending: pending?.length ?? 0,
        processing: processing?.length ?? 0,
        completed: completed?.length ?? 0,
        failed: failed?.length ?? 0,
      },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
