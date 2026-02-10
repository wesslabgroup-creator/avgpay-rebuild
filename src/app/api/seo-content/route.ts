import { NextResponse } from 'next/server';
import { getCachedSEOContent } from '@/lib/seoContentCache';
import { type EntityType } from '@/lib/seoContentGenerator';

const VALID_ENTITY_TYPES: EntityType[] = ['Company', 'City', 'Job'];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { entityType, entityName, contextData } = body;

    if (!entityType || !entityName || !contextData) {
      return NextResponse.json(
        { error: 'Missing required fields: entityType, entityName, contextData' },
        { status: 400 },
      );
    }

    if (!VALID_ENTITY_TYPES.includes(entityType)) {
      return NextResponse.json(
        { error: `Invalid entityType. Must be one of: ${VALID_ENTITY_TYPES.join(', ')}` },
        { status: 400 },
      );
    }

    // Use cache layer: serves from DB if available, generates + caches if not
    const content = await getCachedSEOContent(entityType, entityName, contextData);

    return NextResponse.json({
      entityType,
      entityName,
      content,
    });
  } catch (error: unknown) {
    console.error('SEO content API error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
