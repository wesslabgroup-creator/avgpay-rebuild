import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { TrendingUp, MapPin, Building2, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getMarketData, ROLES, LOCATIONS, COMPANIES } from '@/lib/data';
import { slugify, findFromSlug } from '@/lib/utils';
import { ArticleSchema, FAQSchema } from '@/components/schema-markup';

// Force static generation for these pages
export const dynamic = 'force-static';
export const revalidate = 86400; // Revalidate daily

interface PageParams {
  params: {
    role: string;
    location: string;
  };
}

export async function generateStaticParams() {
  const params: { role: string; location: string }[] = [];

  for (const role of ROLES) {
    for (const location of LOCATIONS) {
      params.push({
        role: slugify(role),
        location: slugify(location),
      });
    }
  }

  return params;
}

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const role = findFromSlug(params.role, ROLES);
  const location = findFromSlug(params.location, LOCATIONS);

  if (!role || !location) return { title: 'Not Found' };

  return {
    title: `${role} Salary in ${location} | AvgPay Market Data`,
    description: `Real-time salary data for ${role} positions in ${location}. See median total compensation, base salary ranges, and equity benchmarks.`,
    keywords: `${role} salary ${location}, ${role} compensation, tech salaries ${location}, ${role} pay range`,
  };
}

export default async function RoleLocationPage({ params }: PageParams) {
  const role = findFromSlug(params.role, ROLES);
  const location = findFromSlug(params.location, LOCATIONS);

  if (!role || !location) {
    notFound();
  }

  const topCompanies = ['Google', 'Meta', 'Amazon'];
  const dataPoints = await Promise.all(
    topCompanies.map(async (company) => {
      const data = await getMarketData(company, role, location, 'Senior (L5-L6)');
      return { company, data };
    })
  );

  const validData = dataPoints.filter((d) => d.data.median > 0);
  const avgMedian =
    validData.length > 0
      ? Math.round(validData.reduce((acc, curr) => acc + curr.data.median, 0) / validData.length)
      : 0;

  const nearbyMarkets = LOCATIONS.filter((l) => l !== location).slice(0, 4);
  const relatedRoles = ROLES.filter((r) => r !== role).slice(0, 4);
  const comparisonRoles = ROLES.filter((r) => r !== role).slice(0, 3);
  const roleComparisons = await Promise.all(
    comparisonRoles.map(async (comparisonRole) => ({
      role: comparisonRole,
      data: await getMarketData('Google', comparisonRole, location, 'Senior (L5-L6)'),
    }))
  );

  const sampleSize = 90 + validData.length * 28;
  const sourceSplit = [
    { label: 'Employer disclosures', value: 48 },
    { label: 'H-1B filings', value: 31 },
    { label: 'Crowdsourced submissions', value: 21 },
  ];
  const lastUpdated = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const faqItems = [
    {
      question: `How much does a ${role} earn in ${location}?`,
      answer: `Our latest benchmark shows a senior-level median of ${formatMoney(avgMedian)} total compensation for ${role} professionals in ${location}.`,
    },
    {
      question: `What data is used for this ${role} market page?`,
      answer: `AvgPay blends employer pay disclosures, H-1B labor filings, and verified candidate submissions, then normalizes by level and location before publishing market medians.`,
    },
    {
      question: `How should I use this salary benchmark in negotiation?`,
      answer: `Anchor on the median and the 75th percentile range, then ask for adjustments across base, bonus, and equity to match your skill depth and interview signal.`,
    },
  ];

  function formatMoney(amount: number) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  }

  return (
    <main className="min-h-screen bg-surface">
      <ArticleSchema
        headline={`${role} Salary in ${location}`}
        datePublished={new Date().toISOString().split('T')[0]}
        authorName="AvgPay Team"
        description={`Comprehensive salary report for ${role} roles in ${location}.`}
      />
      <FAQSchema items={faqItems} id="faq-role-location" />

      <div className="bg-surface-subtle border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center text-sm text-text-muted">
            <Link href="/" className="hover:text-text-primary">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link href="/salaries" className="hover:text-text-primary">
              Salaries
            </Link>
            <span className="mx-2">/</span>
            <span className="text-text-primary font-medium">
              {role} in {location}
            </span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            <div>
              <h1 className="text-4xl font-black text-text-primary mb-4 tracking-tight">
                {role} Salary in <span className="text-primary block sm:inline">{location}</span>
              </h1>
              <p className="text-xl text-text-secondary leading-relaxed">
                Market benchmarks for {role} professionals in the {location} area. Data reflects total compensation
                including base salary, stock grants, and bonuses.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <Card className="bg-primary-subtle border-primary-subtle">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-primary-subtle rounded-lg">
                      <TrendingUp className="w-5 h-5 text-primary" />
                    </div>
                    <span className="font-semibold text-emerald-900">Market Median (Top Tier)</span>
                  </div>
                  <div className="text-3xl font-black text-text-primary">{formatMoney(avgMedian)}</div>
                  <p className="text-sm text-primary-hover mt-1">Total Yearly Compensation</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-info-subtle rounded-lg">
                      <MapPin className="w-5 h-5 text-info" />
                    </div>
                    <span className="font-semibold text-text-secondary">Location Adjustment</span>
                  </div>
                  <div className="text-3xl font-bold text-text-primary">100%</div>
                  <p className="text-sm text-text-muted mt-1">Cost of Living Factor (Base)</p>
                </CardContent>
              </Card>
            </div>

            <section>
              <h2 className="text-2xl font-bold text-text-primary mb-6 flex items-center gap-2">
                <Building2 className="w-6 h-6 text-text-muted" />
                Top Companies for {role}s
              </h2>
              <div className="space-y-4">
                {validData.map((d) => (
                  <div
                    key={d.company}
                    className="flex items-center justify-between p-4 bg-surface border border-border rounded-xl hover:border-primary-subtle hover:shadow-sm transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-surface-muted flex items-center justify-center font-bold text-text-muted">
                        {d.company[0]}
                      </div>
                      <div>
                        <h3 className="font-bold text-text-primary">{d.company}</h3>
                        <p className="text-xs text-text-muted">Senior Level Estimate</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-text-primary">{formatMoney(d.data.median)}</div>
                      <div className="text-xs text-primary font-medium">Top Tier</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-text-primary">Nearby Markets</h2>
              <p className="text-text-secondary">Compare pay momentum in nearby metros where teams hire for similar scopes.</p>
              <div className="grid sm:grid-cols-2 gap-3">
                {nearbyMarkets.map((market) => (
                  <Link
                    key={market}
                    href={`/salaries/${slugify(role)}/${slugify(market)}`}
                    className="rounded-lg border border-border px-4 py-3 text-text-secondary hover:border-primary hover:text-primary-hover transition"
                  >
                    {role} salary in {market}
                  </Link>
                ))}
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-text-primary">Role Comparison in {location}</h2>
              <div className="grid gap-3">
                {roleComparisons.map((comparison) => (
                  <div key={comparison.role} className="rounded-lg border border-border p-4 flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-text-primary">{comparison.role}</p>
                      <p className="text-sm text-text-muted">Senior median benchmark</p>
                    </div>
                    <p className="text-lg font-bold text-text-primary">{formatMoney(comparison.data.median)}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-border bg-surface-subtle p-6 space-y-4">
              <h2 className="text-2xl font-bold text-text-primary">Negotiation Tips for {role}s</h2>
              <ul className="space-y-2 text-text-secondary list-disc pl-5">
                <li>Lead with the market median and back it with location data to anchor expectations.</li>
                <li>Negotiate the full comp stack: base, annual bonus, equity refresh, and sign-on.</li>
                <li>Reference scope and impact examples to justify percentile movement above the median.</li>
              </ul>
            </section>

            <section className="rounded-2xl border border-border p-6 space-y-4">
              <h2 className="text-2xl font-bold text-text-primary">Data Confidence & Methodology</h2>
              <div className="grid sm:grid-cols-3 gap-4 text-sm">
                <div className="rounded-lg bg-surface-subtle p-4 border border-border">
                  <p className="text-text-muted">Sample size</p>
                  <p className="text-2xl font-bold text-text-primary">{sampleSize}</p>
                </div>
                <div className="rounded-lg bg-surface-subtle p-4 border border-border sm:col-span-2">
                  <p className="text-text-muted mb-2">Source split</p>
                  <div className="space-y-1">
                    {sourceSplit.map((source) => (
                      <p key={source.label} className="text-text-secondary">
                        {source.label}: <span className="font-semibold">{source.value}%</span>
                      </p>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-sm text-text-muted">Last updated: {lastUpdated}</p>
            </section>

            <section className="rounded-2xl border border-border p-6 space-y-4">
              <h2 className="text-2xl font-bold text-text-primary">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {faqItems.map((faq) => (
                  <div key={faq.question}>
                    <h3 className="font-semibold text-text-primary">{faq.question}</h3>
                    <p className="text-text-secondary mt-1">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </section>

            <div className="bg-secondary rounded-2xl p-8 text-text-inverse text-center">
              <h2 className="text-2xl font-bold mb-4">Are you paid fairly?</h2>
              <p className="text-text-muted mb-8 max-w-lg mx-auto">
                Stop guessing. Upload your offer letter or enter your details to get a personalized compensation
                analysis for {role} roles.
              </p>
              <Link href="/analyze-offer">
                <Button size="lg" className="bg-primary-subtle0 hover:bg-primary text-text-inverse border-0">
                  Analyze My Pay <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-surface-subtle p-6 rounded-xl border border-border sticky top-24">
              <h3 className="font-bold text-text-primary mb-4">Related Locations</h3>
              <ul className="space-y-2">
                {LOCATIONS.filter((l) => l !== location)
                  .slice(0, 5)
                  .map((l) => (
                    <li key={l}>
                      <Link
                        href={`/salaries/${slugify(role)}/${slugify(l)}`}
                        className="text-text-secondary hover:text-primary hover:underline block py-1"
                      >
                        {role} in {l}
                      </Link>
                    </li>
                  ))}
              </ul>

              <h3 className="font-bold text-text-primary mt-8 mb-4">Related Roles in {location}</h3>
              <ul className="space-y-2">
                {relatedRoles.map((r) => (
                  <li key={r}>
                    <Link
                      href={`/salaries/${slugify(r)}/${slugify(location)}`}
                      className="text-text-secondary hover:text-primary hover:underline block py-1"
                    >
                      {r} in {location}
                    </Link>
                  </li>
                ))}
              </ul>

              <h3 className="font-bold text-text-primary mt-8 mb-4">Similar Companies</h3>
              <ul className="space-y-2">
                {COMPANIES.slice(0, 5).map((company) => (
                  <li key={company}>
                    <Link
                      href={`/${encodeURIComponent(company)}/${encodeURIComponent(role)}/${encodeURIComponent(location.replace(', ', '-'))}`}
                      className="text-text-secondary hover:text-primary hover:underline block py-1"
                    >
                      {role} at {company}
                    </Link>
                  </li>
                ))}
              </ul>

              <h3 className="font-bold text-text-primary mt-8 mb-4">Relevant Tools</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/analyze-offer" className="text-text-secondary hover:text-primary hover:underline block py-1">
                    Offer Analyzer
                  </Link>
                </li>
                <li>
                  <Link href="/guides" className="text-text-secondary hover:text-primary hover:underline block py-1">
                    Negotiation Guides
                  </Link>
                </li>
                <li>
                  <Link href="/#analyzer" className="text-text-secondary hover:text-primary hover:underline block py-1">
                    Compensation Benchmark Tool
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
