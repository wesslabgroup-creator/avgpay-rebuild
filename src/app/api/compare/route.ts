import { NextResponse } from 'next/server';
import {
  getCompareProfile,
  computeCompareConfidence,
  generateComparisonAnalysis,
  generateComparisonMetadata,
} from '@/lib/comparisonEngine';

/**
 * GET /api/compare?entityA=...&entityB=...&city=...
 *
 * Returns comparison data for two entities (jobs, companies, or cities).
 * Supports optional city filter for location-scoped comparisons.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const entityA = searchParams.get('entityA');
  const entityB = searchParams.get('entityB');
  const cityFilter = searchParams.get('city') || undefined;

  if (!entityA || !entityB) {
    return NextResponse.json(
      { error: 'Both entityA and entityB are required' },
      { status: 400 }
    );
  }

  try {
    const [profileA, profileB] = await Promise.all([
      getCompareProfile(entityA, cityFilter),
      getCompareProfile(entityB, cityFilter),
    ]);

    const confidence = computeCompareConfidence(profileA.sampleSize, profileB.sampleSize);
    const metadata = generateComparisonMetadata(entityA, entityB);

    // Only generate LLM narrative if we have meaningful data
    let narrative = null;
    if (confidence.totalSampleSize >= 5) {
      try {
        narrative = await generateComparisonAnalysis(entityA, entityB, 'All Roles');
      } catch {
        // Fallback: skip narrative
      }
    }

    return NextResponse.json({
      profileA,
      profileB,
      confidence,
      metadata,
      narrative,
      cityFilter: cityFilter || null,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
