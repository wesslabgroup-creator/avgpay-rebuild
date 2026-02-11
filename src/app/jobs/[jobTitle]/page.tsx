"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Head from 'next/head';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Building2, Briefcase, TrendingUp, TrendingDown, Users, Sparkles } from 'lucide-react';
import { DataTable } from '@/components/data-table';
import { InsightCards, InsightCardsSkeleton } from '@/components/insight-cards';
import { SalaryDistributionChart } from '@/components/salary-distribution-chart'; // Placeholder for chart
import { EnrichmentDebugBanner } from '@/components/enrichment-debug-banner';

interface JobDetails {
  jobData: {
    id: string;
    title: string;
    description: string;
    analysis?: Record<string, string> | null;
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
  enrichmentStatus?: string;
}

export default function JobDetailPage() {
  const router = useRouter();
  const params = useParams();
  const jobTitleSlug = params.jobTitle as string;

  const [data, setData] = useState<JobDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [enrichmentStatus, setEnrichmentStatus] = useState<string>('none');

  useEffect(() => {
    if (!jobTitleSlug) return;

    const jobTitle = decodeURIComponent(jobTitleSlug);

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/job-details?jobTitle=${encodeURIComponent(jobTitle)}`, {
          cache: 'no-store',
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const fetchedData: JobDetails = await response.json();
        setData(fetchedData);
        setEnrichmentStatus(fetchedData.enrichmentStatus || 'none');
      } catch (err: unknown) {
        console.error("Failed to fetch job data:", err);
        setError("Could not load job details. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [jobTitleSlug]);

  const formatCurrency = (n: number | undefined | null) => {
    if (n === undefined || n === null) return '$0k';
    return `$${(n / 1000).toFixed(0)}k`;
  };

  useEffect(() => {
    if (!data?.jobData?.id || data.jobData.analysis) return;

    const terminalStatuses = new Set(['completed', 'failed', 'none']);
    if (terminalStatuses.has(enrichmentStatus)) return;

    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/enrichment-status?entityType=Job&entityId=${data.jobData.id}`);
        if (!response.ok) return;

        const payload = await response.json();
        setEnrichmentStatus(payload.status || 'none');

        if (payload.analysis) {
          setData(prev => prev ? {
            ...prev,
            jobData: { ...prev.jobData, analysis: payload.analysis },
          } : prev);
        }
      } catch (pollErr) {
        console.error('Failed to poll job enrichment status', pollErr);
      }
    }, 7000);

    return () => clearInterval(interval);
  }, [data?.jobData?.id, data?.jobData?.analysis, enrichmentStatus]);

  if (isLoading) return <div className="flex justify-center items-center min-h-screen">Loading job details...</div>;
  if (error || !data) return <div className="flex justify-center items-center min-h-screen text-red-500">{error || "No data available."}</div>;

  const { jobData, topCompanies, topLocations, bottomLocations, salaryDistribution, relatedJobs } = data;

  const spread = (jobData.global_max_comp || 0) - (jobData.global_min_comp || 0);
  const topCompany = topCompanies[0];
  const topLocation = topLocations[0];

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
        <meta
          name="description"
          content={jobData.seo_meta_description || `${jobData.title} salary insights with a median of ${formatCurrency(jobData.global_median_comp)}, pay range from ${formatCurrency(jobData.global_min_comp)} to ${formatCurrency(jobData.global_max_comp)}, and ${(jobData.global_count || 0).toLocaleString()} real submissions.`}
        />
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
                  <p className="text-4xl font-bold text-emerald-600">{formatCurrency(jobData?.global_median_comp)}</p>
                  <p className="text-sm font-medium text-slate-500 uppercase mt-1">Median Total Comp</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-semibold text-slate-800">{formatCurrency(jobData?.global_min_comp)}</p>
                  <p className="text-sm font-medium text-slate-500 uppercase mt-1">Min Comp</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-semibold text-slate-800">{formatCurrency(jobData?.global_max_comp)}</p>
                  <p className="text-sm font-medium text-slate-500 uppercase mt-1">Max Comp</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-semibold text-slate-800">{(jobData?.global_count || 0).toLocaleString()}</p>
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


          <EnrichmentDebugBanner
            entityType="Job"
            entityName={jobData.title}
            enrichmentStatus={enrichmentStatus}
            analysisExists={!!jobData.analysis}
            analysisKeys={jobData.analysis ? Object.keys(jobData.analysis) : []}
          />

          {!jobData.analysis && (enrichmentStatus === 'pending' || enrichmentStatus === 'processing') && (
            <InsightCardsSkeleton />
          )}

          {!jobData.analysis && enrichmentStatus !== 'pending' && enrichmentStatus !== 'processing' && (
            <Card className="bg-emerald-50 border-emerald-200">
              <CardHeader>
                <CardTitle className="text-lg text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-emerald-600" />
                  Insights Briefing
                </CardTitle>
                <p className="text-sm text-slate-600">
                  {enrichmentStatus === 'failed' || enrichmentStatus === 'error'
                    ? 'The latest narrative failed validation and needs a retry with richer sample depth.'
                    : 'Analysis pending. New submissions for this role will improve insight quality.'}
                </p>
              </CardHeader>
            </Card>
          )}

          <Card className="bg-white border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg text-slate-900">Market Narrative</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-slate-700">
              <p>
                This role currently shows a median package of {formatCurrency(jobData.global_median_comp)} across {(jobData.global_count || 0).toLocaleString()} submissions, giving you a concrete negotiation baseline anchored in live market data.
              </p>
              <p>
                The observed compensation spread for {jobData.title} is {formatCurrency(jobData.global_min_comp)} to {formatCurrency(jobData.global_max_comp)}, a {formatCurrency(spread)} range that signals meaningful variation by employer, seniority, and location.
              </p>
              {topCompany && (
                <p>
                  {topCompany.company_name} currently leads this dataset with a median package near {formatCurrency(topCompany.total_comp)}, making it a useful anchor for high-end negotiation targets.
                </p>
              )}
              {topLocation && (
                <p>
                  {topLocation.location} appears as the highest-paying location in this role snapshot, indicating stronger market pricing pressure for this talent pool.
                </p>
              )}
              {bottomLocations[0] && (
                <p>
                  Comparing the highest and lowest paying locations highlights geographic pricing gaps, which can materially change take-home outcomes even for the same title.
                </p>
              )}
            </CardContent>
          </Card>

          {/* The Analyst View (Dynamic Insights) */}
          {jobData.analysis && (
            <InsightCards analysis={jobData.analysis} entityName={jobData.title} />
          )}

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
                  <Link
                    key={job.title}
                    href={`/jobs/${encodeURIComponent(job.title)}`}
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3"
                  >
                    {job.title}
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
