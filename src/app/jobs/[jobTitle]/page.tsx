"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Head from 'next/head';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Briefcase, TrendingUp, TrendingDown, Users, Sparkles } from 'lucide-react';
import { DataTable } from '@/components/data-table';
import { InsightCards, InsightCardsSkeleton } from '@/components/insight-cards';
import { SalaryDistributionChart } from '@/components/salary-distribution-chart';
import { EnrichmentDebugBanner } from '@/components/enrichment-debug-banner';
import { PercentileBands, CompMixBreakdown, YoeProgression, DataConfidence, FAQSection, ExternalLinksSection, DataDisclaimer } from '@/components/entity-value-modules';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { buildCanonicalUrl } from '@/lib/canonical';

import { ValueBlockRenderer } from '@/components/value-block-renderer';
import { ValueBlock } from '@/lib/value-expansion';
import { getAuthoritativeLinks } from '@/lib/authority-links';

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
<<<<<<< HEAD
  valueBlocks: ValueBlock[];
=======
  indexing?: { shouldNoIndex?: boolean };
  faq?: { question: string; answer: string }[];
  percentiles?: { p10: number; p25: number; p50: number; p75: number; p90: number };
  compMix?: { avgBasePct: number; avgEquityPct: number; avgBonusPct: number };
  yoeProgression?: { yoeRange: string; medianComp: number; count: number }[];
  dataConfidence?: { submissionCount: number; diversityScore: number; hasPercentileData: boolean; confidenceLabel: string };
  externalLinks?: { href: string; label: string; source: string; description: string }[];
>>>>>>> eb7d5f5d3d22cb5cadb1aa47a83d0ebc4e6d001d
}

export default function JobDetailPage() {
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

  const { jobData, topCompanies, topLocations, bottomLocations, salaryDistribution, relatedJobs, valueBlocks } = data;

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

  const webpageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: `${jobData.title} salary intelligence`,
    description: `${jobData.title} compensation intelligence from self-reported and public salary datasets.`,
    url: `https://avgpay.com/jobs/${encodeURIComponent(jobData.title)}`,
  };

  const datasetSchema = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: `${jobData.title} compensation dataset`,
    description: `Total compensation data for ${jobData.title} roles including base salary, equity, and bonus.`,
    creator: { '@type': 'Organization', name: 'AvgPay', url: 'https://avgpay.com' },
    variableMeasured: ['base salary', 'bonus', 'equity', 'total compensation'],
    measurementTechnique: 'Self-reported submissions, H-1B visa data, BLS occupational data',
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://avgpay.com' },
      { '@type': 'ListItem', position: 2, name: 'Salaries', item: 'https://avgpay.com/salaries' },
      { '@type': 'ListItem', position: 3, name: jobData.title, item: `https://avgpay.com/jobs/${encodeURIComponent(jobData.title)}` },
    ],
  };

  const canonicalUrl = buildCanonicalUrl(`/jobs/${encodeURIComponent(jobData.title)}`);

  const faqSchema = data.faq && data.faq.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: data.faq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  } : null;

  return (
    <>
      <Head>
        <title>{jobData.seo_meta_title || `Average ${jobData.title} Salary in 2026`}</title>
        <meta
          name="description"
          content={jobData.seo_meta_description || `${jobData.title} salary insights with a median of ${formatCurrency(jobData.global_median_comp)}, pay range from ${formatCurrency(jobData.global_min_comp)} to ${formatCurrency(jobData.global_max_comp)}, and ${(jobData.global_count || 0).toLocaleString()} real submissions.`}
        />
        <link rel="canonical" href={canonicalUrl} />
        <meta name="robots" content={data.indexing?.shouldNoIndex ? 'noindex,follow' : 'index,follow'} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webpageSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
        {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}
      </Head>
      <main className="min-h-screen bg-white">
        <div className="max-w-6xl mx-auto px-6 py-12 space-y-8">
          <Breadcrumbs items={[
            { label: 'Salaries', href: '/salaries' },
            { label: jobData.title },
          ]} />

          {/* Hero Section */}
          <div className="text-left space-y-4">
            <h1 className="text-4xl font-bold tracking-tight text-slate-900">{jobData.title} Salary & Career Data</h1>
            <p className="text-xl text-slate-600 max-w-3xl">{jobData.description}</p>
          </div>

          {/* Data Confidence */}
          {data.dataConfidence && (
            <DataConfidence confidence={data.dataConfidence} entityName={jobData.title} />
          )}

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

<<<<<<< HEAD
          {/* Generated Value Blocks */}
          <ValueBlockRenderer blocks={valueBlocks} />
=======
          {/* Percentile Bands */}
          {data.percentiles && (
            <PercentileBands
              percentiles={data.percentiles}
              entityName={jobData.title}
              submissionCount={jobData.global_count}
            />
          )}

          {/* Comp Mix */}
          {data.compMix && <CompMixBreakdown compMix={data.compMix} entityName={jobData.title} />}

          {/* YoE Progression */}
          {data.yoeProgression && (
            <YoeProgression yoeProgression={data.yoeProgression} entityName={jobData.title} />
          )}
>>>>>>> eb7d5f5d3d22cb5cadb1aa47a83d0ebc4e6d001d

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
                  rows={topLocations.map(r => [<Link key={r.location} href={`/salaries/city/${r.location.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`} className="text-emerald-600 hover:underline">{r.location}</Link>, formatCurrency(r.total_comp)])}
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
                  rows={bottomLocations.map(r => [<Link key={r.location} href={`/salaries/city/${r.location.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`} className="text-emerald-600 hover:underline">{r.location}</Link>, formatCurrency(r.total_comp)])}
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

<<<<<<< HEAD
          {/* Trusted Resources */}
          <Card className="bg-slate-50 border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg text-slate-900">Trusted Resources</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {getAuthoritativeLinks('Role', jobData.title).map((link, i) => (
                <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-white rounded-md border border-slate-200">
                  <div>
                    <p className="font-medium text-slate-900">{link.text}</p>
                    <p className="text-xs text-slate-500">Source: {link.source}</p>
                  </div>
                  <a href={link.url} target="_blank" rel={link.rel} className="text-sm font-medium text-emerald-600 hover:text-emerald-700 mt-2 sm:mt-0">
                    Visit Source &rarr;
                  </a>
                </div>
              ))}
            </CardContent>
          </Card>
=======
          {/* FAQ Section */}
          {data.faq && data.faq.length > 0 && (
            <FAQSection faqs={data.faq} entityName={jobData.title} />
          )}

          {/* External Links */}
          {data.externalLinks && data.externalLinks.length > 0 && (
            <ExternalLinksSection links={data.externalLinks} />
          )}

          {/* Data Disclaimer */}
          <DataDisclaimer />
>>>>>>> eb7d5f5d3d22cb5cadb1aa47a83d0ebc4e6d001d
        </div>
      </main>
    </>
  );
}
