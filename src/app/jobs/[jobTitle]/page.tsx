"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Head from 'next/head';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, MapPin, Building2, Briefcase, TrendingUp, TrendingDown, Users } from 'lucide-react';
import { DataTable } from '@/components/data-table';
import { SalaryDistributionChart } from '@/components/salary-distribution-chart'; // Placeholder for chart

interface JobDetails {
  jobData: {
    title: string;
    description: string;
    global_median_comp: number;
    global_min_comp: number;
    global_max_comp: number;
    global_count: number;
    seo_meta_title: string;
    seo_meta_description: string;
  };
  topCompanies: { company_name: string; total_comp: number }[];
  topLocations: { location: string; total_comp: number }[];
  bottomLocations: { location: string; total_comp: number }[];
  salaryDistribution: { total_comp: number }[];
  relatedJobs: { title: string }[];
}

export default function JobDetailPage() {
  const router = useRouter();
  const params = useParams();
  const jobTitleSlug = params.jobTitle as string;

  const [data, setData] = useState<JobDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!jobTitleSlug) return;
    
    const jobTitle = decodeURIComponent(jobTitleSlug);

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/job-details?jobTitle=${encodeURIComponent(jobTitle)}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const fetchedData: JobDetails = await response.json();
        setData(fetchedData);
      } catch (err: any) {
        console.error("Failed to fetch job data:", err);
        setError("Could not load job details. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [jobTitleSlug]);

  const formatCurrency = (n: number) => `$${(n / 1000).toFixed(0)}k`;

  if (isLoading) return <div className="flex justify-center items-center min-h-screen">Loading job details...</div>;
  if (error || !data) return <div className="flex justify-center items-center min-h-screen text-red-500">{error || "No data available."}</div>;
  
  const { jobData, topCompanies, topLocations, bottomLocations, salaryDistribution, relatedJobs } = data;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: jobData.title,
    description: jobData.description,
    hiringOrganization: {
      '@type': 'Organization',
      name: 'Various Tech Companies',
    },
    employmentType: 'FULL_TIME',
    baseSalary: {
      '@type': 'MonetaryAmount',
      currency: 'USD',
      value: {
        '@type': 'QuantitativeValue',
        minValue: jobData.global_min_comp,
        maxValue: jobData.global_max_comp,
        unitText: 'YEAR',
      },
    },
  };

  return (
    <>
      <Head>
        <title>{jobData.seo_meta_title || `Average ${jobData.title} Salary in 2026`}</title>
        <meta name="description" content={jobData.seo_meta_description || `Find top companies, locations, and salary data for ${jobData.title}.`} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>
      <main className="min-h-screen bg-white">
        <div className="max-w-6xl mx-auto px-6 py-12 space-y-8">
          <Button variant="ghost" onClick={() => router.back()} className="text-emerald-600 hover:text-emerald-700 -ml-4">
            <ChevronLeft className="w-4 h-4 mr-1" /> Back to Salaries
          </Button>

          {/* Hero Section */}
          <div className="text-left space-y-4">
            <h1 className="text-4xl font-bold tracking-tight text-slate-900">{jobData.title} Salary & Career Data</h1>
            <p className="text-xl text-slate-600 max-w-3xl">{jobData.description}</p>
          </div>

          {/* Aggregated Statistics */}
          <Card className="bg-white border-emerald-500/50 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg text-slate-900 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-emerald-600" />
                Overall Compensation for {jobData.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <p className="text-4xl font-bold text-emerald-600">{formatCurrency(jobData.global_median_comp)}</p>
                  <p className="text-sm font-medium text-slate-500 uppercase mt-1">Median Total Comp</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-semibold text-slate-800">{formatCurrency(jobData.global_min_comp)}</p>
                  <p className="text-sm font-medium text-slate-500 uppercase mt-1">Min Comp</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-semibold text-slate-800">{formatCurrency(jobData.global_max_comp)}</p>
                  <p className="text-sm font-medium text-slate-500 uppercase mt-1">Max Comp</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-semibold text-slate-800">{jobData.global_count.toLocaleString()}</p>
                  <p className="text-sm font-medium text-slate-500 uppercase mt-1">Data Points</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Salary Distribution */}
          <Card className="bg-white border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg text-slate-900">Salary Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <SalaryDistributionChart data={salaryDistribution.map(s => s.total_comp)} />
            </CardContent>
          </Card>

          {/* Company Rankings */}
          <Card className="bg-white border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg text-slate-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-slate-600" />
                Who Pays the Most?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable 
                headers={[{ label: "Company", key: "company" }, { label: "Median Comp", key: "median" }]} 
                rows={topCompanies.map(r => [
                  <Link key={r.company_name} href={`/company/${r.company_name}`} className="text-emerald-600 hover:underline">{r.company_name}</Link>, 
                  formatCurrency(r.total_comp)
                ])} 
              />
            </CardContent>
          </Card>

          {/* Location Rankings */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="bg-white border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg text-slate-900 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                  Highest Paying Locations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <DataTable 
                  headers={[{ label: "Location", key: "location" }, { label: "Median Comp", key: "median" }]} 
                  rows={topLocations.map(r => [r.location, formatCurrency(r.total_comp)])} 
                />
              </CardContent>
            </Card>
            <Card className="bg-white border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg text-slate-900 flex items-center gap-2">
                  <TrendingDown className="w-5 h-5 text-red-500" />
                  Lowest Paying Locations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <DataTable 
                  headers={[{ label: "Location", key: "location" }, { label: "Median Comp", key: "median" }]} 
                  rows={bottomLocations.map(r => [r.location, formatCurrency(r.total_comp)])} 
                />
              </CardContent>
            </Card>
          </div>

          {/* Related Jobs */}
          <Card className="bg-white border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-slate-600" />
                Related Jobs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {relatedJobs.map(job => (
                  <Button key={job.title} variant="outline" size="sm" asChild>
                    <Link href={`/jobs/${encodeURIComponent(job.title)}`}>{job.title}</Link>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
