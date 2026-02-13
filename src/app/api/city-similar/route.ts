import { NextResponse } from 'next/server';
import { getCityPeers } from '@/lib/comparisonEngine';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city');
    const state = searchParams.get('state');

    if (!city || !state) {
        return NextResponse.json({ error: 'City and State are required' }, { status: 400 });
    }

    try {
        const peers = await getCityPeers(decodeURIComponent(city), decodeURIComponent(state), 6);

        const formatted = peers.map(p => ({
            ...p,
            href: `/salaries/city/${p.slug}`,
        }));

        return NextResponse.json({ peers: formatted });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
