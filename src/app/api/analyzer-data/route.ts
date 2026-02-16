import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseClient';
import { triggerOpportunisticEnrichment } from '@/lib/enrichment';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const PAGE_SIZE = 1000;

async function fetchAllRows<T>(
  table: 'Role' | 'Company' | 'Location',
  select: string,
  orderColumn: string
): Promise<T[]> {
  const rows: T[] = [];
  let from = 0;

  while (true) {
    const to = from + PAGE_SIZE - 1;
    const { data, error } = await supabaseAdmin
      .from(table)
      .select(select)
      .order(orderColumn, { ascending: true })
      .range(from, to);

    if (error) {
      throw new Error(`Error fetching ${table} rows: ${error.message}`);
    }

    const page = (data as T[]) || [];
    rows.push(...page);

    if (page.length < PAGE_SIZE) break;
    from += PAGE_SIZE;
  }

  return rows;
}

export async function GET() {
  triggerOpportunisticEnrichment('api:analyzer-data');

  // Return mock data during build or if Supabase is not configured
  if (process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('placeholder') || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return NextResponse.json({
      roles: ['Software Engineer', 'Product Manager', 'Data Scientist', 'UX Designer'],
      locations: ['San Francisco, CA', 'New York, NY', 'Seattle, WA', 'Austin, TX'],
      companies: ['Google', 'Meta', 'Amazon', 'Apple', 'Microsoft'],
    });
  }

  try {
    const [roles, locations, companies] = await Promise.all([
      fetchAllRows<{ title: string }>('Role', 'title', 'title'),
      fetchAllRows<{ city: string; state: string }>('Location', 'city, state', 'city'),
      fetchAllRows<{ name: string }>('Company', 'name', 'name'),
    ]);

    return NextResponse.json({
      roles: roles.map((r) => r.title),
      locations: locations.map((l) => `${l.city}, ${l.state}`),
      companies: companies.map((c) => c.name),
    });
  } catch (error: unknown) {
    console.error('API Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
