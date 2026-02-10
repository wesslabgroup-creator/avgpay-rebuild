import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SalaryChart } from "@/components/salary-chart";
import { Button } from "@/components/ui/button";
import { getMarketData, COMPANIES, ROLES, LOCATIONS } from "@/lib/data";
import { BreadcrumbSchema, JobPostingSchema } from "@/components/schema-markup";
import { getBaseUrl, getFullUrl } from "@/lib/utils";
import { generateSalaryPageMeta } from "@/lib/meta";
import Link from "next/link";
import { getCachedSEOContent } from "@/lib/seoContentCache";

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
  const location = decodeURIComponent(params.location).replace(/-/g, ", ");

  // Updated to include company, role, location, and level for accurate data retrieval
  const data = await getMarketData(company, role, location, "L3-L4");

  return generateSalaryPageMeta(company, role, location, data.median);
}

export async function generateStaticParams() {
  // Updated to use the exported constants for broader static generation
  const companies = COMPANIES;
  const roles = ROLES;
  const locations = LOCATIONS;

  // Ensure all combinations are generated for SEO
  return companies.flatMap(company =>
    roles.flatMap(role =>
      locations.map(location => ({
        company: encodeURIComponent(company),
        role: encodeURIComponent(role),
        location: encodeURIComponent(location.replace(", ", "-")),
      }))
    )
  );
}

export default async function SalaryPage({ params }: PageProps) {
  const company = decodeURIComponent(params.company);
  const role = decodeURIComponent(params.role);
  const location = decodeURIComponent(params.location).replace(/-/g, ", ");

  // Updated to include company in the data retrieval
  const data = await getMarketData(company, role, location, "L3-L4");

  // Handle cases where data might not be found (though mock data is extensive now)
  if (!data) {
    notFound();
  }

  // Helper to format currency values
  const formatCurrency = (n: number) => `$${(n / 1000).toFixed(0)}k`;

  // Fetch SEO content (cached in DB, generated on first access)
  const [cityContent, companyContent] = await Promise.all([
    getCachedSEOContent('City', location, `State and metro area context for ${location}. Role: ${role}, Median comp: ${formatCurrency(data.median)}`),
    getCachedSEOContent('Company', company, `Employer context for ${company} hiring ${role} in ${location}. Median comp: ${formatCurrency(data.median)}`),
  ]);

  return (
    <main className="min-h-screen bg-white">

      <div className="px-6 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Schema Markup for Breadcrumbs */}
          <BreadcrumbSchema items={[
            { name: "Home", item: getBaseUrl() },
            { name: company, item: getFullUrl(`/${encodeURIComponent(company)}`) },
            { name: role, item: getFullUrl(`/${encodeURIComponent(company)}/${encodeURIComponent(role)}`) },
            { name: location, item: getFullUrl(`/${encodeURIComponent(company)}/${encodeURIComponent(role)}/${encodeURIComponent(location.replace(", ", "-"))}`) },
          ]} />

          {/* Schema Markup for JobPosting */}
          <JobPostingSchema
            jobTitle={role}
            company={company}
            location={location}
            baseSalary={{
              min: data.min,
              max: data.max,
              median: data.median
            }}
          />

          {/* Visual Breadcrumb */}
          <nav className="text-sm text-slate-600">
            <Link href="/" className="hover:text-slate-900 transition duration-300">Home</Link>
            <span className="mx-2">/</span>
            <Link href={`/${encodeURIComponent(company)}`} className="hover:text-slate-900 transition duration-300">{company}</Link>
            <span className="mx-2">/</span>
            <Link href={`/${encodeURIComponent(company)}/${encodeURIComponent(role)}`} className="hover:text-slate-900 transition duration-300">{role}</Link>
            <span className="mx-2">/</span>
            <span className="text-slate-900 font-medium">{location}</span>
          </nav>

          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight text-slate-900">
              {role} Salary at {company}
            </h1>
            <p className="text-xl text-slate-600">{location}</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">Median Total Comp</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">{formatCurrency(data.median)}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">BLS Benchmark</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">{formatCurrency(data.blsMedian)}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">75th Percentile</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">{formatCurrency(data.p75)}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">90th Percentile</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">{formatCurrency(data.p90)}</div>
              </CardContent>
            </Card>
          </div>

          {/* Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-slate-900">Salary Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <SalaryChart
                yourSalary={data.median}
                marketMedian={data.median}
                blsMedian={data.blsMedian}
              />
            </CardContent>
          </Card>

          {/* Location Financial Context */}
          <section className="space-y-6">
            <div className="border-l-4 border-emerald-500 pl-4">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                Financial Context: {location}
              </h2>
              <p className="text-sm text-slate-500 mt-1">Tax impact, housing costs, and what your salary actually buys in this market</p>
            </div>

            {(() => {
              const cityEntries = Object.entries(cityContent);
              const featuredKey = 'buying_power';
              const featured = cityEntries.find(([k]) => k === featuredKey);
              const rest = cityEntries.filter(([k]) => k !== featuredKey);
              const keyLabel = (k: string) => k.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

              return (
                <div className="space-y-6">
                  {featured && (
                    <div className="p-6 md:p-8 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200/60">
                      <h3 className="text-lg font-semibold text-emerald-900">{keyLabel(featured[0])}</h3>
                      <p className="text-base text-slate-800 leading-relaxed mt-3">{featured[1]}</p>
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {rest.map(([key, value]) => (
                      <article key={key} className="p-5 rounded-lg border border-slate-200 bg-white">
                        <h3 className="text-base font-semibold text-slate-900">{keyLabel(key)}</h3>
                        <p className="text-sm text-slate-700 leading-relaxed mt-2">{value}</p>
                      </article>
                    ))}
                  </div>
                </div>
              );
            })()}
          </section>

          {/* Employer Compensation Analysis */}
          <section className="space-y-6">
            <div className="border-l-4 border-emerald-500 pl-4">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                Employer Analysis: {company}
              </h2>
              <p className="text-sm text-slate-500 mt-1">Pay structure, negotiation leverage, and career growth at this employer</p>
            </div>

            {(() => {
              const compEntries = Object.entries(companyContent);
              const featuredKey = 'comp_philosophy';
              const featured = compEntries.find(([k]) => k === featuredKey);
              const rest = compEntries.filter(([k]) => k !== featuredKey);
              const keyLabel = (k: string) => k.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

              return (
                <div className="space-y-6">
                  {featured && (
                    <div className="p-6 md:p-8 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200/60">
                      <h3 className="text-lg font-semibold text-emerald-900">{keyLabel(featured[0])}</h3>
                      <p className="text-base text-slate-800 leading-relaxed mt-3">{featured[1]}</p>
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {rest.map(([key, value]) => (
                      <article key={key} className="p-5 rounded-lg border border-slate-200 bg-white">
                        <h3 className="text-base font-semibold text-slate-900">{keyLabel(key)}</h3>
                        <p className="text-sm text-slate-700 leading-relaxed mt-2">{value}</p>
                      </article>
                    ))}
                  </div>
                </div>
              );
            })()}
          </section>

          {/* CTA */}
          <div className="flex justify-center gap-4">
            <Link href="/#analyzer">
              <Button size="lg" className="bg-gradient-to-r from-emerald-600 to-teal-600">
                Analyze Your Offer
              </Button>
            </Link>
            <Link href="/guides">
              <Button size="lg" variant="outline">
                Read Negotiation Guide
              </Button>
            </Link>
          </div>

          {/* Data Provenance */}
          <div className="p-6 rounded-lg bg-slate-50 border border-slate-200 text-sm">
            <h3 className="font-semibold text-slate-900 mb-2">Data Sources</h3>
            <ul className="space-y-1 text-slate-700">
              <li>• Bureau of Labor Statistics (BLS) Occupational Employment Data</li>
              <li>• H-1B Labor Condition Applications (public filings)</li>
              <li>• Pay transparency law postings (verified ranges)</li>
              <li>• Last updated: February 2026</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
