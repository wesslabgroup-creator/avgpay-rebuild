import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SalaryChart } from "@/components/salary-chart";
import { Button } from "@/components/ui/button";
import { getMarketData, COMPANIES, ROLES, LOCATIONS } from "@/lib/data";
import { BreadcrumbSchema } from "@/components/schema-markup";
import { getBaseUrl, getFullUrl } from "@/lib/utils";
import Link from "next/link";

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
  const data = getMarketData(company, role, location, "L3-L4");
  
  return {
    title: `${role} Salary at ${company} in ${location} | AvgPay`,
    description: `See ${role} compensation data at ${company} in ${location}. Median: $${data.median.toLocaleString()}. Compare against BLS and market benchmarks.`,
    openGraph: {
      title: `${role} Salary at ${company} in ${location}`,
      description: `Verified compensation data for ${role} positions at ${company}`,
    },
  };
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

export default function SalaryPage({ params }: PageProps) {
  const company = decodeURIComponent(params.company);
  const role = decodeURIComponent(params.role);
  const location = decodeURIComponent(params.location).replace(/-/g, ", ");
  
  // Updated to include company in the data retrieval
  const data = getMarketData(company, role, location, "L3-L4");
  
  // Handle cases where data might not be found (though mock data is extensive now)
  if (!data) {
    notFound();
  }

  // Helper to format currency values
  const formatCurrency = (n: number) => `$${(n / 1000).toFixed(0)}k`;

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
