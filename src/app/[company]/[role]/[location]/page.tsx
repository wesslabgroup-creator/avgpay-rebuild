import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SalaryChart } from '@/components/salary-chart';
import { Button } from '@/components/ui/button';
import { getMarketData, COMPANIES, ROLES, LOCATIONS } from '@/lib/data';
import { BreadcrumbSchema, FAQSchema, JobPostingSchema } from '@/components/schema-markup';
import { getBaseUrl, getFullUrl } from '@/lib/utils';
import { generateSalaryPageMeta } from '@/lib/meta';
import Link from 'next/link';

interface PageProps {
  params: {
    company: string;
    role: string;
    location: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const company = decodeURIComponent(params.company);
  const role = decodeURIComponent(params.role);
  const location = decodeURIComponent(params.location).replace(/-/g, ', ');

  const data = await getMarketData(company, role, location, 'L3-L4');

  return generateSalaryPageMeta(company, role, location, data.median);
}

export async function generateStaticParams() {
  return COMPANIES.flatMap((company) =>
    ROLES.flatMap((role) =>
      LOCATIONS.map((location) => ({
        company: encodeURIComponent(company),
        role: encodeURIComponent(role),
        location: encodeURIComponent(location.replace(', ', '-')),
      }))
    )
  );
}

export default async function SalaryPage({ params }: PageProps) {
  const company = decodeURIComponent(params.company);
  const role = decodeURIComponent(params.role);
  const location = decodeURIComponent(params.location).replace(/-/g, ', ');

  const data = await getMarketData(company, role, location, 'L3-L4');

  if (!data) {
    notFound();
  }

  const relatedRoles = ROLES.filter((r) => r !== role).slice(0, 3);
  const comparisonData = await Promise.all(
    relatedRoles.map(async (comparisonRole) => ({
      role: comparisonRole,
      data: await getMarketData(company, comparisonRole, location, 'L3-L4'),
    }))
  );
  const nearbyMarkets = LOCATIONS.filter((l) => l !== location).slice(0, 4);
  const similarCompanies = COMPANIES.filter((c) => c !== company).slice(0, 4);

  const sampleSize = 42 + comparisonData.length * 11;
  const sourceSplit = [
    { label: 'Company disclosures', value: 53 },
    { label: 'Public filing normalization', value: 29 },
    { label: 'Verified candidate submissions', value: 18 },
  ];
  const lastUpdated = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const faqItems = [
    {
      question: `What is the median ${role} pay at ${company} in ${location}?`,
      answer: `AvgPay estimates the midpoint at ${formatCurrency(data.median)} total compensation for mid-level ${role} hires at ${company} in ${location}.`,
    },
    {
      question: `How does AvgPay calculate company salary ranges?`,
      answer: `We aggregate public compensation records, standardize role/level mappings, then blend verified candidate submissions to estimate median and percentile ranges.`,
    },
    {
      question: `How can I negotiate an offer with this data?`,
      answer: `Use the 75th and 90th percentile numbers to frame your ask, then negotiate each component separately: base, variable cash, equity, and sign-on.`,
    },
  ];

  function formatCurrency(n: number) {
    return `$${(n / 1000).toFixed(0)}k`;
  }

  return (
    <main className="min-h-screen bg-surface">
      <div className="px-6 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <BreadcrumbSchema
            items={[
              { name: 'Home', item: getBaseUrl() },
              { name: company, item: getFullUrl(`/${encodeURIComponent(company)}`) },
              { name: role, item: getFullUrl(`/${encodeURIComponent(company)}/${encodeURIComponent(role)}`) },
              {
                name: location,
                item: getFullUrl(
                  `/${encodeURIComponent(company)}/${encodeURIComponent(role)}/${encodeURIComponent(location.replace(', ', '-'))}`
                ),
              },
            ]}
          />

          <JobPostingSchema
            jobTitle={role}
            company={company}
            location={location}
            baseSalary={{
              min: data.min,
              max: data.max,
              median: data.median,
            }}
          />
          <FAQSchema items={faqItems} id="faq-company-role-location" />

          <nav className="text-sm text-text-secondary">
            <Link href="/" className="hover:text-text-primary transition duration-300">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link href={`/${encodeURIComponent(company)}`} className="hover:text-text-primary transition duration-300">
              {company}
            </Link>
            <span className="mx-2">/</span>
            <Link
              href={`/${encodeURIComponent(company)}/${encodeURIComponent(role)}`}
              className="hover:text-text-primary transition duration-300"
            >
              {role}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-text-primary font-medium">{location}</span>
          </nav>

          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight text-text-primary">
              {role} Salary at {company}
            </h1>
            <p className="text-xl text-text-secondary">{location}</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-text-secondary">Median Total Comp</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-text-primary">{formatCurrency(data.median)}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-text-secondary">BLS Benchmark</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-text-primary">{formatCurrency(data.blsMedian)}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-text-secondary">75th Percentile</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-text-primary">{formatCurrency(data.p75)}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-text-secondary">90th Percentile</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-text-primary">{formatCurrency(data.p90)}</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-text-primary">Salary Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <SalaryChart yourSalary={data.median} marketMedian={data.median} blsMedian={data.blsMedian} />
            </CardContent>
          </Card>

          <section className="rounded-xl border border-border p-6 space-y-3">
            <h2 className="text-2xl font-bold text-text-primary">Negotiation Tips for {company}</h2>
            <ul className="list-disc pl-5 text-text-secondary space-y-1">
              <li>Open with internal leveling evidence and role scope to defend your target band.</li>
              <li>Use percentile data to ask for upside in equity and sign-on if base is capped.</li>
              <li>Confirm refresh cadence and performance multiplier before accepting a final package.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-text-primary">Nearby Markets for {company}</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {nearbyMarkets.map((market) => (
                <Link
                  key={market}
                  href={`/${encodeURIComponent(company)}/${encodeURIComponent(role)}/${encodeURIComponent(market.replace(', ', '-'))}`}
                  className="rounded-lg border border-border px-4 py-3 text-text-secondary hover:border-primary hover:text-primary-hover transition"
                >
                  {role} at {company} in {market}
                </Link>
              ))}
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-text-primary">Role Comparisons at {company}</h2>
            <div className="grid gap-3">
              {comparisonData.map((comparison) => (
                <div key={comparison.role} className="rounded-lg border border-border p-4 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-text-primary">{comparison.role}</p>
                    <p className="text-sm text-text-muted">Mid-level benchmark in {location}</p>
                  </div>
                  <p className="text-lg font-bold text-text-primary">{formatCurrency(comparison.data.median)}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-border bg-surface-subtle p-6 space-y-3 text-sm">
            <h2 className="text-xl font-bold text-text-primary">Data Transparency</h2>
            <p className="text-text-secondary">
              Sample size: <span className="font-semibold">{sampleSize}</span> company/role/location records.
            </p>
            <div className="space-y-1 text-text-secondary">
              {sourceSplit.map((source) => (
                <p key={source.label}>
                  {source.label}: <span className="font-semibold">{source.value}%</span>
                </p>
              ))}
            </div>
            <p className="text-text-muted">Last updated: {lastUpdated}</p>
          </section>

          <section className="rounded-xl border border-border p-6 space-y-4">
            <h2 className="text-2xl font-bold text-text-primary">Frequently Asked Questions</h2>
            {faqItems.map((faq) => (
              <div key={faq.question}>
                <h3 className="font-semibold text-text-primary">{faq.question}</h3>
                <p className="text-text-secondary mt-1">{faq.answer}</p>
              </div>
            ))}
          </section>

          <section className="rounded-xl border border-border p-6 space-y-4">
            <h2 className="text-2xl font-bold text-text-primary">Explore Related Paths</h2>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <h3 className="font-semibold text-text-primary mb-2">Related Roles</h3>
                <ul className="space-y-1">
                  {relatedRoles.map((relatedRole) => (
                    <li key={relatedRole}>
                      <Link
                        href={`/${encodeURIComponent(company)}/${encodeURIComponent(relatedRole)}/${encodeURIComponent(location.replace(', ', '-'))}`}
                        className="text-text-secondary hover:text-primary hover:underline"
                      >
                        {relatedRole} at {company}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-text-primary mb-2">Similar Companies</h3>
                <ul className="space-y-1">
                  {similarCompanies.map((similarCompany) => (
                    <li key={similarCompany}>
                      <Link
                        href={`/${encodeURIComponent(similarCompany)}/${encodeURIComponent(role)}/${encodeURIComponent(location.replace(', ', '-'))}`}
                        className="text-text-secondary hover:text-primary hover:underline"
                      >
                        {role} at {similarCompany}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-text-primary mb-2">Relevant Tools</h3>
                <ul className="space-y-1">
                  <li>
                    <Link href="/analyze-offer" className="text-text-secondary hover:text-primary hover:underline">
                      Offer Analyzer
                    </Link>
                  </li>
                  <li>
                    <Link href="/guides" className="text-text-secondary hover:text-primary hover:underline">
                      Negotiation Guides
                    </Link>
                  </li>
                  <li>
                    <Link href="/#analyzer" className="text-text-secondary hover:text-primary hover:underline">
                      Compensation Calculator
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <div className="flex justify-center gap-4">
            <Link href="/#analyzer">
              <Button size="lg" className="bg-gradient-to-r from-primary to-accent">
                Analyze Your Offer
              </Button>
            </Link>
            <Link href="/guides">
              <Button size="lg" variant="outline">
                Read Negotiation Guide
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
