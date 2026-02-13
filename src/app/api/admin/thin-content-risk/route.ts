import { NextResponse } from 'next/server';
import { computeThinContentRiskSummary } from '@/lib/thinContentAudit';

export async function GET() {
  try {
    const report = await computeThinContentRiskSummary();
    return NextResponse.json(report);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to compute thin-content risk summary';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
