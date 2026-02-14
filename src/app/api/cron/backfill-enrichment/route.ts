import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseClient';
import { queueEnrichment, buildCityContextData } from '@/lib/enrichment';
import { log } from '@/lib/enrichmentLogger';
import { normalizeCityName } from '@/lib/normalization';

export const dynamic = 'force-dynamic';
export const maxDuration = 120; // Backfill only queues jobs (no LLM calls), but DB queries can be slow

/**
 * Finds entities missing enrichment analysis and queues them.
 * Catches all edge cases: null analysis, null/error/none enrichmentStatus.
 *
 * Runs every 15 minutes via Vercel cron (see vercel.json).
 */

// Query that catches ALL entities needing enrichment — covers every edge case:
// - analysis never generated (null)
// - enrichmentStatus never set (null)
// - enrichmentStatus explicitly 'error' (failed previously)
// - enrichmentStatus explicitly 'none' (initial state on some records)
const NEEDS_ENRICHMENT_FILTER = 'analysis.is.null,enrichmentStatus.is.null,enrichmentStatus.eq.error,enrichmentStatus.eq.none';

export async function GET(request: Request) {
    // Verify Vercel cron secret (if configured) to prevent unauthorized triggers
    const cronSecret = process.env.CRON_SECRET;
    if (cronSecret) {
        const authHeader = request.headers.get('authorization');
        if (authHeader !== `Bearer ${cronSecret}`) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
    }

    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit') || '25', 10), 100);
    const entityTypeFilter = searchParams.get('type');

    log('info', 'backfill_start', `Starting backfill scan`, { limit, entityTypeFilter });

    let queuedCount = 0;
    const queuedEntities: string[] = [];

    try {
        // 1. Backfill Companies
        if (!entityTypeFilter || entityTypeFilter === 'Company') {
            const { data: companies } = await supabaseAdmin
                .from('Company')
                .select('id, name')
                .or(NEEDS_ENRICHMENT_FILTER)
                .limit(limit);

            if (companies) {
                for (const company of companies) {
                    if (queuedCount >= limit) break;
                    const jobId = await queueEnrichment('Company', company.id, company.name);
                    if (jobId) {
                        queuedCount++;
                        queuedEntities.push(`Company:${company.name}`);
                    }
                }
            }
        }

        // 2. Backfill Jobs (Roles)
        if ((!entityTypeFilter || entityTypeFilter === 'Job') && queuedCount < limit) {
            const remaining = limit - queuedCount;
            const { data: jobs } = await supabaseAdmin
                .from('Role')
                .select('id, title')
                .or(NEEDS_ENRICHMENT_FILTER)
                .limit(remaining);

            if (jobs) {
                for (const job of jobs) {
                    if (queuedCount >= limit) break;
                    const jobId = await queueEnrichment('Job', job.id, job.title);
                    if (jobId) {
                        queuedCount++;
                        queuedEntities.push(`Job:${job.title}`);
                    }
                }
            }
        }

        // 3. Backfill Locations (Cities)
        if ((!entityTypeFilter || entityTypeFilter === 'City') && queuedCount < limit) {
            const remaining = limit - queuedCount;
            const { data: locations } = await supabaseAdmin
                .from('Location')
                .select('id, city, state')
                .or(NEEDS_ENRICHMENT_FILTER)
                .limit(remaining);

            if (locations) {
                for (const loc of locations) {
                    if (queuedCount >= limit) break;

                    const fullName = loc.state ? `${loc.city}, ${loc.state}` : loc.city;
                    const { displayName } = normalizeCityName(fullName);
                    const parts = displayName.split(',').map(p => p.trim());
                    const city = parts[0];
                    const state = parts[1] || '';
                    const context = buildCityContextData({ city, state });

                    const jobId = await queueEnrichment('City', loc.id, fullName, context);
                    if (jobId) {
                        queuedCount++;
                        queuedEntities.push(`City:${fullName}`);
                    }
                }
            }
        }

        log('info', 'backfill_complete', `Backfill scan queued ${queuedCount} jobs`, { queuedEntities });

        return NextResponse.json({
            status: 'success',
            queued_count: queuedCount,
            queued_entities: queuedEntities,
            message: `Checked for missing analysis and queued ${queuedCount} entities.`
        });

    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        log('error', 'backfill_error', 'Backfill operation failed', { error: message });
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
