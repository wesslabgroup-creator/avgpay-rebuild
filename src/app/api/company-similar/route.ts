import { NextResponse } from 'next/server';
import { getCompanyPeers, getComparisonSlug } from '@/lib/comparisonEngine';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const companyName = searchParams.get('companyName');

  if (!companyName) {
    return NextResponse.json({ error: 'Company name is required' }, { status: 400 });
  }

  try {
    const similarCompanies = await getCompanyPeers(companyName, 4);

    const links = similarCompanies.map((item) => ({
      ...item,
      slug: getComparisonSlug(companyName, item.company),
      href: `/compare/${getComparisonSlug(companyName, item.company)}`,
    }));

    return NextResponse.json({ similarCompanies: links });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
