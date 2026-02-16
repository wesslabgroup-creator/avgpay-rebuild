import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { isAdminEmail } from '@/lib/authz';
import { computeThinContentRiskSummary } from '@/lib/thinContentAudit';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();

    if (!session || !isAdminEmail(session.user.email)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const report = await computeThinContentRiskSummary();
    return NextResponse.json(report);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to compute thin-content risk summary';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
