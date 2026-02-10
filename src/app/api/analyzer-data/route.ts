import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  // Return mock data during build or if Supabase is not configured
  if (process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('placeholder') || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return NextResponse.json({
      roles: ["Software Engineer", "Product Manager", "Data Scientist", "UX Designer"],
      locations: ["San Francisco, CA", "New York, NY", "Seattle, WA", "Austin, TX"],
      companies: ["Google", "Meta", "Amazon", "Apple", "Microsoft"],
    });
  }

  try {
    const { data: roles, error: rolesError } = await supabaseAdmin
      .from('Role')
      .select('title')
      .order('title', { ascending: true });

    if (rolesError) throw new Error(`Error fetching roles: ${rolesError.message}`);

    const { data: locations, error: locationsError } = await supabaseAdmin
      .from('Location')
      .select('city, state')
      .order('city', { ascending: true });

    if (locationsError) throw new Error(`Error fetching locations: ${locationsError.message}`);

    const { data: companies, error: companiesError } = await supabaseAdmin
      .from('Company')
      .select('name')
      .order('name', { ascending: true });

    if (companiesError) throw new Error(`Error fetching companies: ${companiesError.message}`);

    return NextResponse.json({
      roles: roles.map((r: { title: string }) => r.title),
      locations: locations.map((l: { city: string; state: string }) => `${l.city}, ${l.state}`),
      companies: companies.map((c: { name: string }) => c.name),
    });

  } catch (error: unknown) {
    console.error('API Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
