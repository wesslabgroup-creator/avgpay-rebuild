import { NextResponse } from 'next/server';
import { getRecentEnrichmentJobs } from '@/lib/enrichment';
import { supabaseAdmin } from '@/lib/supabaseClient';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

/**
 * GET /api/enrichment-health
 *
 * Admin debug endpoint: returns queue counts and the last 20 enrichment jobs.
 * Auth: Requires ENRICHMENT_API_KEY or SUPABASE_SERVICE_ROLE_KEY in Bearer header.
 */
export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  const expectedKey = process.env.ENRICHMENT_API_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (expectedKey && authHeader !== `Bearer ${expectedKey}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Queue status counts
    const [pending, processing, completed, failed] = await Promise.all([
      supabaseAdmin.from('EnrichmentQueue').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
      supabaseAdmin.from('EnrichmentQueue').select('id', { count: 'exact', head: true }).eq('status', 'processing'),
      supabaseAdmin.from('EnrichmentQueue').select('id', { count: 'exact', head: true }).eq('status', 'completed'),
      supabaseAdmin.from('EnrichmentQueue').select('id', { count: 'exact', head: true }).eq('status', 'failed'),
    ]);

    // Entity coverage stats
    const [companiesTotal, companiesWithAnalysis, rolesTotal, rolesWithAnalysis, locationsTotal, locationsWithAnalysis] = await Promise.all([
      supabaseAdmin.from('Company').select('id', { count: 'exact', head: true }),
      supabaseAdmin.from('Company').select('id', { count: 'exact', head: true }).not('analysis', 'is', null),
      supabaseAdmin.from('Role').select('id', { count: 'exact', head: true }),
      supabaseAdmin.from('Role').select('id', { count: 'exact', head: true }).not('analysis', 'is', null),
      supabaseAdmin.from('Location').select('id', { count: 'exact', head: true }),
      supabaseAdmin.from('Location').select('id', { count: 'exact', head: true }).not('analysis', 'is', null),
    ]);

    // Recent jobs
    const recentJobs = await getRecentEnrichmentJobs(20);

    return NextResponse.json({
      queue: {
        pending: pending.count ?? 0,
        processing: processing.count ?? 0,
        completed: completed.count ?? 0,
        failed: failed.count ?? 0,
      },
      coverage: {
        companies: { total: companiesTotal.count ?? 0, withAnalysis: companiesWithAnalysis.count ?? 0 },
        roles: { total: rolesTotal.count ?? 0, withAnalysis: rolesWithAnalysis.count ?? 0 },
        locations: { total: locationsTotal.count ?? 0, withAnalysis: locationsWithAnalysis.count ?? 0 },
      },
      recentJobs: recentJobs.map(j => ({
        id: j.id,
        entityType: j.entityType,
        entityName: j.entityName,
        entityKey: j.entityKey,
        status: j.status,
        attempts: j.attempts,
        lastError: j.lastError,
        createdAt: j.createdAt,
        processedAt: j.processedAt,
      })),
    });
  } catch (error) {
    console.error('Health check error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
