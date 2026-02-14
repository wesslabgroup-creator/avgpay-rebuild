import { NextResponse } from 'next/server';
import {
    processNextEnrichmentJob,
    recoverFailedJobs,
    hasPendingEnrichmentJobs,
    backfillMissingAnalysis,
} from '@/lib/enrichment';
import { log } from '@/lib/enrichmentLogger';

export const dynamic = 'force-dynamic';
// Hobby plan caps at 60s — keep this as high as the plan allows.
// On Pro this becomes 300s. Vercel will clamp to the plan maximum.
export const maxDuration = 300;

/**
 * Single daily cron (Hobby) or frequent cron (Pro).
 *
 * Runs three phases in order of priority:
 *   1. Recovery  — reset failed jobs to pending (DB-only, fast)
 *   2. Backfill  — queue entities that have no analysis yet (DB-only, fast)
 *   3. Process   — actually run LLM generation for pending jobs
 *
 * On Hobby (60s cap), recovery + backfill finish in ~5s, leaving ~50s
 * for 1 LLM job. The auto-processor handles the rest during page visits.
 */
export async function GET(request: Request) {
    const cronSecret = process.env.CRON_SECRET;
    if (cronSecret) {
        const authHeader = request.headers.get('authorization');
        if (authHeader !== `Bearer ${cronSecret}`) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
    }

    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit') || '1', 10), 10);

    log('info', 'cron_process_start', `Starting enrichment cron (recovery + backfill + process)`, { limit });

    try {
        // Phase 1: Recover failed jobs (DB-only, ~1-2s)
        const recovered = await recoverFailedJobs(20);

        // Phase 2: Backfill entities missing analysis (DB-only, ~2-5s)
        const backfill = await backfillMissingAnalysis(25);

        // Phase 3: Process pending jobs (LLM calls — this is the slow part)
        const results = [];
        for (let i = 0; i < limit; i++) {
            const result = await processNextEnrichmentJob();

            if (!result.processed) {
                log('info', 'cron_process_idle', 'No more pending jobs to process');
                break;
            }

            results.push(result);
        }

        const remaining = await hasPendingEnrichmentJobs();

        return NextResponse.json({
            recovered,
            backfilled: backfill.enqueued,
            processed: results.length,
            remaining,
            results: results.map(r => ({
                id: r.jobId,
                status: r.status,
                entity: r.entityName,
                error: r.error
            }))
        });

    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        log('error', 'cron_process_failed', 'Critical error in cron processor', { error: message });
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
