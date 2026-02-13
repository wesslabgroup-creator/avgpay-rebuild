"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Head from 'next/head';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, ExternalLink, Sparkles } from 'lucide-react';
import { DataTable } from "@/components/data-table";
import { InsightCards, InsightCardsSkeleton } from '@/components/insight-cards';
import { EnrichmentDebugBanner } from '@/components/enrichment-debug-banner';
import { ValueBlockRenderer } from '@/components/value-block-renderer';
import { ValueBlock } from '@/lib/value-expansion';

import { buildCanonicalUrl } from '@/lib/canonical';
import { PercentileBands, CompMixBreakdown, DataConfidence, FAQSection, ExternalLinksSection, DataDisclaimer } from '@/components/entity-value-modules';
import { Breadcrumbs } from '@/components/breadcrumbs';

interface SalarySummary {
  role: string;
  minComp: number;
  maxComp: number;
  medianComp: number;
  levelsCount: number;
  dataPoints: number;
}

interface SimilarCompanyLink {
  company: string;
  similarityScore: number;
  medianComp: number;
  sampleSize: number;
  slug: string;
  href: string;
  reason?: string;
}

interface CompanyInfo {
  id: string;
  name: string;
  website: string;
  description: string;
  logoUrl?: string;
  analysis?: Record<string, string> | null;
  salarySummary?: SalarySummary[];
  valueBlocks: ValueBlock[];
  topJobs?: { role: string; medianComp: number; dataPoints: number }[];
  topCities?: { city: string; medianComp: number; dataPoints: number }[];
  indexing?: { shouldNoIndex?: boolean };
  faq?: { question: string; answer: string }[];
  percentiles?: { p25: number; p50: number; p75: number };
  compMix?: { avgBasePct: number; avgEquityPct: number; avgBonusPct: number };
  dataConfidence?: { submissionCount: number; roleCount?: number; cityCount?: number; confidenceLabel: string };
  externalLinks?: { href: string; label: string; source: string; description: string }[];
}

const CompanyDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const companyName = decodeURIComponent(params?.companyName as string || '');

  const [companyData, setCompanyData] = useState<CompanyInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [similarCompanies, setSimilarCompanies] = useState<SimilarCompanyLink[]>([]);
  const [enrichmentStatus, setEnrichmentStatus] = useState<string>('none');

  useEffect(() => {
    if (!companyName) return;

    const fetchCompanyData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/company-details?companyName=${encodeURIComponent(companyName)}`, {
          cache: 'no-store',
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const payload = await response.json();
        const { companyData: fetchedData, salarySummary, topJobs, topCities, enrichmentStatus: initialEnrichmentStatus, indexing, faq } = payload;

        setCompanyData({
          id: fetchedData.id,
          name: fetchedData.name,
          website: fetchedData.website || '#',
          description: fetchedData.description,
          logoUrl: fetchedData.logoUrl,
          analysis: fetchedData.analysis || null,
          salarySummary,
          valueBlocks: fetchedData.valueBlocks || [],
          topJobs,
          topCities,
          indexing,
          faq,
          percentiles: payload.percentiles,
          compMix: payload.compMix,
          dataConfidence: payload.dataConfidence,
          externalLinks: payload.externalLinks,
        });
        setEnrichmentStatus(initialEnrichmentStatus || 'none');

        const similarResponse = await fetch(`/api/company-similar?companyName=${encodeURIComponent(companyName)}`, {
          cache: 'no-store',
        });
        if (similarResponse.ok) {
          const payload = await similarResponse.json();
          setSimilarCompanies(payload.similarCompanies || []);
        }
      } catch (err: unknown) {
        setError(`Failed to load data for "${companyName}".`);
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompanyData();
  }, [companyName]);

  const formatCurrency = (n: number) => `$${(n / 1000).toFixed(0)}k`;

  useEffect(() => {
    if (!companyData?.id || companyData.analysis) return;

    const terminalStatuses = new Set(['completed', 'failed', 'none']);
    if (terminalStatuses.has(enrichmentStatus)) return;

    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/enrichment-status?entityType=Company&entityId=${companyData.id}`);
        if (!response.ok) return;

        const payload = await response.json();
        setEnrichmentStatus(payload.status || 'none');

        if (payload.analysis) {
          setCompanyData(prev => prev ? { ...prev, analysis: payload.analysis } : prev);
        }
      } catch (pollErr) {
        console.error('Failed to poll company enrichment status', pollErr);
      }
    }, 7000);

    return () => clearInterval(interval);
  }, [companyData?.id, companyData?.analysis, enrichmentStatus]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Card className="bg-white border-slate-200 p-8 w-96 shadow-sm">
            <CardHeader>
              <CardTitle className="text-slate-900 animate-pulse">Loading...</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-slate-500">Fetching details for {companyName}...</CardDescription>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  if (error || !companyData) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Card className="bg-white border-slate-200 p-8 w-96 shadow-sm">
            <CardHeader>
              <CardTitle className="text-red-500">Company Not Found</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-slate-500 mb-4">{error}</CardDescription>
              <Button variant="outline" onClick={() => router.back()}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  // Prepare data for the consolidated table
  const tableHeaders = [
    { label: "Job Title", key: "role" },
    { label: "Total Comp Range", key: "range" },
    { label: "Median Comp", key: "median" },
    { label: "Levels", key: "levels" },
    { label: "Data Points", key: "count" }
  ];


  const strongestRole = companyData.salarySummary && companyData.salarySummary.length > 0
    ? [...companyData.salarySummary].sort((a, b) => b.medianComp - a.medianComp)[0]
    : null;
  const broadestRole = companyData.salarySummary && companyData.salarySummary.length > 0
    ? [...companyData.salarySummary].sort((a, b) => b.dataPoints - a.dataPoints)[0]
    : null;

  const tableRows = companyData.salarySummary?.map((s, index) => [
    <Link key={`link-${index}`} href={`/jobs/${encodeURIComponent(s.role)}`} className="text-emerald-600 hover:text-emerald-500 font-medium transition-colors">
      {s.role}
    </Link>,
    `${formatCurrency(s.minComp)} - ${formatCurrency(s.maxComp)}`,
    formatCurrency(s.medianComp),
    `${s.levelsCount} Levels`,
    s.dataPoints.toLocaleString()
  ]) || [];

  const webpageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: `${companyData.name} salary intelligence`,
    description: `Compensation intelligence for ${companyData.name} built from self-reported and public salary records.`,
    url: `https://avgpay.com/company/${encodeURIComponent(companyData.name)}`
  };

  const datasetSchema = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: `${companyData.name} compensation dataset`,
    creator: { '@type': 'Organization', name: 'AvgPay' },
    variableMeasured: ['base salary', 'bonus', 'equity', 'total compensation'],
  };

  const breadcrumbListSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://avgpay.com/',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Companies',
        item: 'https://avgpay.com/companies',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: companyData.name,
        item: `https://avgpay.com/company/${encodeURIComponent(companyData.name)}`,
      },
    ],
  };

  const canonicalUrl = buildCanonicalUrl(`/company/${encodeURIComponent(companyData.name)}`);

  const faqSchema = companyData.faq && companyData.faq.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: companyData.faq.map((item) => ({ '@type': 'Question', name: item.question, acceptedAnswer: { '@type': 'Answer', text: item.answer } })),
  } : null;

  return (
    <>
      <Head>
        <title>{`${companyData.name} Salaries & Compensation Intelligence | AvgPay`}</title>
        <meta name="description" content={`Salary intelligence for ${companyData.name}: role medians, spread analysis, and peer benchmarks.`} />
        <link rel="canonical" href={canonicalUrl} />
        <meta name="robots" content={companyData.indexing?.shouldNoIndex ? 'noindex,follow' : 'index,follow'} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webpageSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbListSchema) }} />
        {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}
      </Head>
      <main className="min-h-screen bg-white">
        <div className="px-6 py-12">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Company Header */}
            <Card className="bg-white border-slate-200 shadow-sm overflow-hidden">
              <div className="h-32 bg-gradient-to-r from-emerald-500 to-teal-600"></div>
              <CardContent className="px-8 pb-8 -mt-12 flex flex-col md:flex-row items-start gap-6">
                <div className="flex-shrink-0 h-24 w-24 md:h-32 md:w-32 rounded-xl overflow-hidden border-4 border-white bg-white shadow-md flex items-center justify-center">
                  {companyData.logoUrl ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={companyData.logoUrl} alt={`${companyData.name} Logo`} className="w-full h-full object-contain p-2" />
                    </>
                  ) : (
                    <span className="text-3xl font-bold text-slate-300">{companyData.name.substring(0, 1)}</span>
                  )}
                </div>
                <div className="mt-12 md:mt-14 w-full">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <CardTitle className="text-4xl font-bold tracking-tight text-slate-900">{companyData.name}</CardTitle>
                      <CardDescription className="text-lg text-slate-600 mt-2 max-w-3xl">{companyData.description}</CardDescription>
                    </div>
                    <Link href={companyData.website} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" className="shrink-0 border-slate-300 text-slate-700 hover:bg-slate-50">
                        Visit Website <ExternalLink className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Breadcrumbs */}
            <Breadcrumbs
              items={[
                { label: 'Companies', href: '/companies' },
                { label: companyData.name },
              ]}
            />

            {/* Data Confidence */}
            {companyData.dataConfidence && (
              <DataConfidence
                confidence={companyData.dataConfidence}
                entityName={companyData.name}
              />
            )}

            {/* Consolidated Salary Overview */}
            <Card className="bg-white border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-slate-900">Salary Overview by Role</CardTitle>
                <CardDescription className="text-slate-500">Aggregated compensation data for {companyData.name}.</CardDescription>
              </CardHeader>
              <CardContent>
                {tableRows.length > 0 ? (
                  <DataTable headers={tableHeaders} rows={tableRows} />
                ) : (
                  <p className="text-slate-500 text-center py-12 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                    No detailed salary data available for this company yet.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Generated Value Blocks */}
            <ValueBlockRenderer blocks={companyData.valueBlocks} />

            {/* Percentile Bands */}
            {companyData.percentiles && (
              <PercentileBands
                percentiles={companyData.percentiles}
                entityName={companyData.name}
                submissionCount={companyData.dataConfidence?.submissionCount ?? 0}
              />
            )}

            {/* Compensation Mix Breakdown */}
            {companyData.compMix && (
              <CompMixBreakdown
                compMix={companyData.compMix}
                entityName={companyData.name}
              />
            )}

            <EnrichmentDebugBanner
              entityType="Company"
              entityName={companyData.name}
              enrichmentStatus={enrichmentStatus}
              analysisExists={!!companyData.analysis}
              analysisKeys={companyData.analysis ? Object.keys(companyData.analysis) : []}
            />

            {!companyData.analysis && (enrichmentStatus === 'pending' || enrichmentStatus === 'processing') && (
              <InsightCardsSkeleton />
            )}

            {!companyData.analysis && enrichmentStatus !== 'pending' && enrichmentStatus !== 'processing' && (
              <Card className="bg-emerald-50 border-emerald-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-slate-900 flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-emerald-600" />
                    Insights Briefing
                  </CardTitle>
                  <CardDescription className="text-slate-600">
                    {enrichmentStatus === 'failed' || enrichmentStatus === 'error'
                      ? 'The latest insights refresh failed quality checks. It will be retried after new salary submissions.'
                      : 'Analysis pending. Submitting more salary data helps trigger richer insights.'}
                  </CardDescription>
                </CardHeader>
              </Card>
            )}

            <Card className="bg-white border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-slate-900">Compensation Storyline</CardTitle>
                <CardDescription className="text-slate-500">
                  A living narrative generated from real salary submissions and updated as new data arrives.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-slate-700">
                <p>
                  This page tracks how compensation evolves at {companyData.name}. As new salaries are submitted, the role mix, pay bands, and peer benchmarks automatically adjust to keep this storyline current.
                </p>
                <p>
                  {strongestRole
                    ? `${companyData.name}'s top-paying role in our dataset is ${strongestRole.role} with a median total compensation of ${formatCurrency(strongestRole.medianComp)}.`
                    : `We are still collecting enough samples to build a complete compensation storyline for ${companyData.name}.`}
                </p>
                {broadestRole && (
                  <p>
                    The most well-sampled role is {broadestRole.role} ({broadestRole.dataPoints.toLocaleString()} submissions), which improves reliability of trend estimates.
                  </p>
                )}
                {similarCompanies.length > 0 && (
                  <p>
                    Peer data suggests the closest salary market neighbors are {similarCompanies.slice(0, 2).map((c) => c.company).join(' and ')}, giving you a practical benchmark set for offer evaluation.
                  </p>
                )}
                {strongestRole && broadestRole && strongestRole.role !== broadestRole.role && (
                  <p>
                    The best-paid track ({strongestRole.role}) differs from the most common track ({broadestRole.role}), which can indicate specialized premium paths versus broader hiring demand.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* The Analyst View (Dynamic Insights) */}
            {companyData.analysis && (
              <InsightCards analysis={companyData.analysis} entityName={companyData.name} />
            )}



            {/* Related Links / Action Section */}
            <Card className="bg-white border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-slate-900">Compare {companyData.name} vs peers</CardTitle>
                <CardDescription className="text-slate-500">
                  {similarCompanies.length > 0
                    ? "Dynamically discovered peers with the most similar salary bands in our dataset."
                    : "No direct salary peers found yet. Compare with other popular companies below."}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {similarCompanies.length > 0 ? similarCompanies.map((comparison) => (
                    <Link
                      key={comparison.slug}
                      href={comparison.href}
                      className="rounded-lg border border-slate-200 p-4 hover:border-emerald-300 hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-slate-900">{companyData.name} vs {comparison.company}</p>
                          <p className="text-sm text-slate-500 mt-1">Median comp: {formatCurrency(comparison.medianComp)} · Samples: {comparison.sampleSize}</p>
                        </div>
                        {comparison.reason && (
                          <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                            {comparison.reason}
                          </span>
                        )}
                      </div>
                    </Link>
                  )) : (
                    <div className="col-span-2 text-center py-6 text-slate-500 italic">
                      Checking for peers... if none appear, try adding more salary data.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-slate-900">Explore related salary entities</CardTitle>
                <CardDescription className="text-slate-500">Internal links generated from highest-density company salary records.</CardDescription>
              </CardHeader>
              <CardContent className="grid md:grid-cols-3 gap-6">
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Top jobs at {companyData.name}</h3>
                  <ul className="space-y-1">
                    {(companyData.topJobs || []).slice(0, 10).map((job) => (
                      <li key={job.role}><Link className="text-emerald-600 hover:underline text-sm" href={`/jobs/${encodeURIComponent(job.role)}`}>{job.role}</Link></li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Top cities for {companyData.name}</h3>
                  <ul className="space-y-1">
                    {(companyData.topCities || []).slice(0, 10).map((city) => (
                      <li key={city.city}><Link className="text-emerald-600 hover:underline text-sm" href={`/salaries/city/${city.city.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}>{city.city}</Link></li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Competitor companies</h3>
                  <ul className="space-y-1">
                    {similarCompanies.slice(0, 10).map((comparison) => (
                      <li key={comparison.slug}><Link className="text-emerald-600 hover:underline text-sm" href={comparison.href}>{comparison.company}</Link></li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* FAQ Section */}
            {companyData.faq && companyData.faq.length > 0 && (
              <FAQSection faqs={companyData.faq} entityName={companyData.name} />
            )}

            {/* External Links Section */}
            {companyData.externalLinks && companyData.externalLinks.length > 0 && (
              <ExternalLinksSection links={companyData.externalLinks} />
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link href="/salaries">
                <Button variant="outline" size="lg" className="h-auto py-6 justify-between bg-white hover:bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-700 w-full">
                  <span className="flex items-center"><ArrowLeft className="mr-3 h-5 w-5 text-slate-400" /> Back to Salaries</span>
                </Button>
              </Link>
              <Link href="/companies">
                <Button variant="outline" size="lg" className="h-auto py-6 justify-between bg-white hover:bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-700 w-full">
                  <span className="flex items-center">View All Companies <ArrowRight className="ml-3 h-5 w-5 text-slate-400" /></span>
                </Button>
              </Link>
            </div>

            {/* Data Disclaimer */}
            <DataDisclaimer />
          </div>
        </div>
      </main>
    </>
  );
};

export default CompanyDetailPage;
