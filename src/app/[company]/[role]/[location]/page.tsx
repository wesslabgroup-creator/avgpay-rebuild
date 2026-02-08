import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SalaryChart } from "@/components/salary-chart";
import { Button } from "@/components/ui/button";
import { getMarketData } from "@/lib/data";

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
  const location = decodeURIComponent(params.location);
  
  return {
    title: `${role} Salary at ${company} in ${location} | AvgPay`,
    description: `See ${role} compensation data at ${company} in ${location}. Compare against BLS and market benchmarks.`,
    openGraph: {
      title: `${role} Salary at ${company} in ${location}`,
      description: `Verified compensation data for ${role} positions`,
    },
  };
}

export async function generateStaticParams() {
  // In production, this would generate paths from database
  const companies = ["Google", "Meta", "Amazon", "Apple", "Microsoft"];
  const roles = ["Software Engineer", "Product Manager"];
  const locations = ["San Francisco CA", "New York NY", "Seattle WA"];
  
  return companies.flatMap(company =>
    roles.flatMap(role =>
      locations.map(location => ({
        company: encodeURIComponent(company),
        role: encodeURIComponent(role),
        location: encodeURIComponent(location),
      }))
    )
  );
}

export default function SalaryPage({ params }: PageProps) {
  const company = decodeURIComponent(params.company);
  const role = decodeURIComponent(params.role);
  const location = decodeURIComponent(params.location).replace(" ", ", ");
  
  // Get market data (would query DB in production)
  const data = getMarketData(role, location, "Mid (L3-L4)");
  
  if (!data) {
    notFound();
  }

  const formatCurrency = (n: number) => `$${(n / 1000).toFixed(0)}k`;

  return (
    <main className="min-h-screen px-6 py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-slate-400">
          <span className="hover:text-slate-200 cursor-pointer">Home</span>
          <span className="mx-2">/</span>
          <span className="hover:text-slate-200 cursor-pointer">{company}</span>
          <span className="mx-2">/</span>
          <span className="hover:text-slate-200 cursor-pointer">{role}</span>
          <span className="mx-2">/</span>
          <span className="text-slate-200">{location}</span>
        </nav>

        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold">
            {role} Salary at {company}
          </h1>
          <p className="text-xl text-slate-400">{location}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Median Total Comp</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(data.median)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">BLS Benchmark</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(data.blsMedian)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">75th Percentile</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(data.p75)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">90th Percentile</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(data.p90)}</div>
            </CardContent>
          </Card>
        </div>

        {/* Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Salary Distribution</CardTitle>
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
        <div className="flex justify-center">
          <Button size="lg" className="bg-gradient-to-r from-indigo-600 to-violet-600">
            Analyze Your Offer
          </Button>
        </div>

        {/* Data Provenance */}
        <div className="p-6 rounded-lg bg-slate-800/30 border border-slate-700 text-sm text-slate-400">
          <h3 className="font-semibold text-slate-200 mb-2">Data Sources</h3>
          <ul className="space-y-1">
            <li>• Bureau of Labor Statistics (BLS) Occupational Employment Data</li>
            <li>• H-1B Labor Condition Applications (public filings)</li>
            <li>• Pay transparency law postings (verified ranges)</li>
            <li>• Last updated: February 2026</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
