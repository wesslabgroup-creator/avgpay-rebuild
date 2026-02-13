import { NextResponse } from 'next/server';
import { getJobPeers } from '@/lib/comparisonEngine';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const jobTitle = searchParams.get('jobTitle');

    if (!jobTitle) {
        return NextResponse.json({ error: 'Job title is required' }, { status: 400 });
    }

    try {
        const peers = await getJobPeers(decodeURIComponent(jobTitle), 5);

        const formatted = peers.map(p => ({
            ...p,
            href: `/company/${encodeURIComponent(p.company)}`,
        }));

        return NextResponse.json({ peers: formatted });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
