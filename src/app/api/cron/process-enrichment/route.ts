import { NextResponse } from 'next/server';
import { processNextEnrichmentJob, recoverFailedJobs, hasPendingEnrichmentJobs } from '@/lib/enrichment';
import { log } from '@/lib/enrichmentLogger';

export const dynamic = 'force-dynamic';
export const maxDuration = 300; // 5 min — LLM calls can take 60s+ per model

export async function GET(request: Request) {
    // Verify Vercel cron secret. Fail closed in production if missing.
    const cronSecret = process.env.CRON_SECRET;
    const isProduction = process.env.NODE_ENV === 'production';

    if (!cronSecret && isProduction) {
        return NextResponse.json({ error: 'CRON_SECRET not configured' }, { status: 500 });
    }

    if (cronSecret) {
        const authHeader = request.headers.get('authorization');
        if (authHeader !== `Bearer ${cronSecret}`) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
    }

    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit') || '3', 10), 10);

    log('info', 'cron_process_start', `Starting enrichment processor via cron`, { limit });

    try {
        // Step 1: Recover failed jobs whose backoff has expired (gives them fresh retries)
        const recovered = await recoverFailedJobs(10);

        // Step 2: Process pending jobs
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
