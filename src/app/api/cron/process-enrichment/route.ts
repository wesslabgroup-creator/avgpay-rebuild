import { NextResponse } from 'next/server';
import { processNextEnrichmentJob, hasPendingEnrichmentJobs } from '@/lib/enrichment';
import { log } from '@/lib/enrichmentLogger';

export const dynamic = 'force-dynamic'; // Prevent static caching
export const maxDuration = 60; // Allow longer run time for cron

export async function GET(request: Request) {
    // Optional: Add CRON_SECRET verification if you set it up in Vercel/Environment
    // const authHeader = request.headers.get('authorization');
    // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    //   return new NextResponse('Unauthorized', { status: 401 });
    // }

    // Allow manual run via query param ?limit=10
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit') || '5', 10), 20);

    log('info', 'cron_process_start', `Starting enrichment processor via cron`, { limit });

    const results = [];
    try {
        for (let i = 0; i < limit; i++) {
            const result = await processNextEnrichmentJob();

            if (!result.processed) {
                log('info', 'cron_process_idle', 'No more pending jobs to process');
                break;
            }

            results.push(result);

            // If we hit an error, we might want to stop or continue. 
            // For now, continue to try processing others unless it looks like a system-wide failure?
            // Actually, processNextEnrichmentJob handles its own errors and returns result object.
        }

        const remaining = await hasPendingEnrichmentJobs();

        return NextResponse.json({
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
