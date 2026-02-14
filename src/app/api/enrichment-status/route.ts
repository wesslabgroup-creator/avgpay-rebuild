import { NextResponse } from 'next/server';
import { getEnrichmentStatus, type EntityType } from '@/lib/enrichment';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

/**
 * GET /api/enrichment-status?entityType=Company&entityId=xxx
 *
 * Check the enrichment/analysis status for a specific entity.
 * Used by the frontend to poll for analysis completion.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const entityType = searchParams.get('entityType') as EntityType | null;
  const entityId = searchParams.get('entityId');

  if (!entityType || !entityId) {
    return NextResponse.json(
      { error: 'entityType and entityId are required' },
      { status: 400 }
    );
  }

  const validTypes: EntityType[] = ['Company', 'City', 'Job'];
  if (!validTypes.includes(entityType)) {
    return NextResponse.json(
      { error: 'entityType must be Company, City, or Job' },
      { status: 400 }
    );
  }

  try {
    const status = await getEnrichmentStatus(entityType, entityId);

    if (!status) {
      return NextResponse.json({
        entityType,
        entityId,
        status: 'none',
        message: 'No enrichment has been requested for this entity',
      });
    }

    return NextResponse.json({
      entityType,
      entityId,
      ...status,
    });
  } catch (error) {
    console.error('Enrichment status error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
