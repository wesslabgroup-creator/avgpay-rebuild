"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Head from 'next/head';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/data-table';
import { InsightCards, InsightCardsSkeleton } from '@/components/insight-cards';
import { EnrichmentDebugBanner } from '@/components/enrichment-debug-banner';
import { PercentileBands, CompMixBreakdown, DataConfidence, FAQSection, ExternalLinksSection, DataDisclaimer, RelatedCities } from '@/components/entity-value-modules';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { buildCanonicalUrl } from '@/lib/canonical';
import {
  ChevronLeft,
  MapPin,
  Building2,
  Briefcase,
  TrendingUp,
  DollarSign,
  Users,
} from 'lucide-react';
import { ValueBlockRenderer } from '@/components/value-block-renderer';
import { ValueBlock } from '@/lib/value-expansion';
import { getAuthoritativeLinks } from '@/lib/authority-links';

interface CityStats {
  count: number;
  median: number;
  min: number;
  max: number;
  p10?: number;
  p25: number;
  p75: number;
  p90?: number;
}

interface TopCompany {
  company_name: string;
  median_comp: number;
  data_points: number;
}

interface TopJob {
  job_title: string;
  median_comp: number;
  data_points: number;
}

interface CityData {
  id: string;
  city: string;
  state: string;
  country: string;
  metro: string;
  slug: string;
  analysis: Record<string, string> | null;
  analysisGeneratedAt: string | null;
}

interface CityDetailsResponse {
  cityData: CityData;
  stats: CityStats;
  topCompanies: TopCompany[];
  topJobs: TopJob[];
  enrichmentStatus?: string;
  valueBlocks: ValueBlock[];
  nearbyCities?: { text: string; url: string; type: string }[];
  indexing?: { shouldNoIndex?: boolean };
  faq?: { question: string; answer: string }[];
  compMix?: { avgBasePct: number; avgEquityPct: number; avgBonusPct: number };
  dataConfidence?: {
    submissionCount: number;
    companyCount?: number;
    roleCount?: number;
    confidenceLabel: string;
  };
  externalLinks?: { href: string; label: string; source: string; description: string }[];
}

const CITY_CLUSTERS: Record<string, string[]> = {
  'san francisco': ['san jose', 'oakland', 'seattle', 'los angeles', 'new york'],
  'new york': ['boston', 'philadelphia', 'chicago', 'san francisco', 'washington'],
  'seattle': ['portland', 'san francisco', 'austin', 'denver', 'san jose'],
  'austin': ['dallas', 'houston', 'denver', 'san antonio', 'raleigh'],
  'chicago': ['detroit', 'minneapolis', 'st. louis', 'indianapolis', 'new york'],
  'boston': ['new york', 'cambridge', 'philadelphia', 'hartford', 'providence'],
  'los angeles': ['san diego', 'san francisco', 'irvine', 'orange county', 'phoenix'],
  'denver': ['boulder', 'colorado springs', 'austin', 'salt lake city', 'seattle'],
  'atlanta': ['charlotte', 'raleigh', 'nashville', 'tampa', 'miami'],
  'dallas': ['austin', 'houston', 'san antonio', 'fort worth', 'denver'],
};

export default function CityPage() {
  const router = useRouter();
  const params = useParams();
  const citySlug = params.city as string;

  const [data, setData] = useState<CityDetailsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [enrichmentStatus, setEnrichmentStatus] = useState<string>('none');

  useEffect(() => {
    if (!citySlug) return;

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/city-details?city=${encodeURIComponent(citySlug)}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const fetchedData: CityDetailsResponse = await response.json();
        setData(fetchedData);
        setEnrichmentStatus(fetchedData.enrichmentStatus || 'none');
      } catch (err) {
        console.error('Failed to fetch city data:', err);
        setError('Could not load city details. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [citySlug]);

  useEffect(() => {
    if (!data?.cityData?.id || data.cityData.analysis) return;

    const terminalStatuses = new Set(['completed', 'failed', 'none']);
    if (terminalStatuses.has(enrichmentStatus)) return;

    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/enrichment-status?entityType=City&entityId=${data.cityData.id}`);
        if (!response.ok) return;

        const payload = await response.json();
        setEnrichmentStatus(payload.status || 'none');

        if (payload.analysis) {
          setData(prev => prev ? {
            ...prev,
            cityData: { ...prev.cityData, analysis: payload.analysis },
          } : prev);
        }
      } catch (pollErr) {
        console.error('Failed to poll city enrichment status', pollErr);
      }
    }, 7000);

    return () => clearInterval(interval);
  }, [data?.cityData?.id, data?.cityData?.analysis, enrichmentStatus]);

  const formatCurrency = (n: number | undefined | null) => {
    if (n === undefined || n === null || n === 0) return '$0k';
    return `$${(n / 1000).toFixed(0)}k`;
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-white">
        <div className="max-w-6xl mx-auto px-6 py-12 space-y-8">
          <div className="h-8 w-48 bg-slate-200 rounded animate-pulse" />
          <div className="h-12 w-96 bg-slate-200 rounded animate-pulse" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="text-center space-y-2">
                <div className="h-10 w-20 mx-auto bg-slate-200 rounded animate-pulse" />
                <div className="h-4 w-24 mx-auto bg-slate-100 rounded animate-pulse" />
              </div>
            ))}
          </div>
          <InsightCardsSkeleton />
        </div>
      </main>
    );
  }

  if (error || !data) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <Card className="bg-white border-slate-200 p-8 w-96 shadow-sm">
          <CardHeader>
            <CardTitle className="text-red-500">City Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-500 mb-4">{error || 'No data available for this city.'}</p>
            <Button variant="outline" onClick={() => router.back()}>
              <ChevronLeft className="mr-2 h-4 w-4" /> Go Back
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  const { cityData, stats, topCompanies, topJobs, valueBlocks, nearbyCities: apiNearbyCities } = data;
  const cityLabel = `${cityData.city}, ${cityData.state}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Place',
    name: cityLabel,
    address: {
      '@type': 'PostalAddress',
      addressLocality: cityData.city,
      addressRegion: cityData.state,
      addressCountry: cityData.country,
    },
  };

  const webpageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: `${cityLabel} salary intelligence`,
    description: `Compensation intelligence for ${cityLabel}.`,
    url: `https://avgpay.com/salaries/city/${cityData.slug}`,
  };

  const datasetSchema = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: `${cityLabel} compensation dataset`,
    description: `Total compensation data for tech professionals in ${cityLabel}, including base salary, equity, and bonus.`,
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
      { '@type': 'ListItem', position: 3, name: cityLabel, item: `https://avgpay.com/salaries/city/${cityData.slug}` },
    ],
  };

  const canonicalUrl = buildCanonicalUrl(`/salaries/city/${cityData.slug}`);

  const faqSchema = data.faq && data.faq.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: data.faq.map((item) => ({ '@type': 'Question', name: item.question, acceptedAnswer: { '@type': 'Answer', text: item.answer } })),
  } : null;

  const normalizedCity = cityData.city.toLowerCase().trim();
  const nearbyCities = apiNearbyCities
    ? apiNearbyCities.map(c => ({
      href: c.url,
      label: c.text,
      context: 'Nearby City'
    }))
    : (CITY_CLUSTERS[normalizedCity] || []).map((city) => ({
      href: `/salaries/city/${city.replace(/\s+/g, '-')}`,
      label: city.split(' ').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
      context: `Compare salaries: ${cityLabel} vs ${city}`,
    }));

  return (
    <>
      <Head>
        <title>{`${cityLabel} Salaries — Average Pay & Compensation Data | AvgPay`}</title>
        <meta
          name="description"
          content={`Explore salary data for ${cityLabel}. Median total comp is ${formatCurrency(stats.median)}. See top companies, highest-paying jobs, and local market insights.`}
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
            { label: cityLabel },
          ]} />

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-emerald-600">
              <MapPin className="h-5 w-5" />
              <span className="text-sm font-medium uppercase tracking-wide">City Salary Hub</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900">
              {cityLabel} Salary Data
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl">
              Compensation insights for tech professionals in the {cityData.metro} metro area.
            </p>
          </div>

          {data.dataConfidence && (
            <DataConfidence confidence={data.dataConfidence} entityName={cityLabel} />
          )}

          <Card className="bg-white border-emerald-500/50 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg text-slate-900 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-600" />
                Compensation Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <p className="text-4xl font-bold text-emerald-600">{formatCurrency(stats.median)}</p>
                  <p className="text-sm font-medium text-slate-500 uppercase mt-1">Median Total Comp</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-semibold text-slate-800">{formatCurrency(stats.p25)}</p>
                  <p className="text-sm font-medium text-slate-500 uppercase mt-1">25th Percentile</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-semibold text-slate-800">{formatCurrency(stats.p75)}</p>
                  <p className="text-sm font-medium text-slate-500 uppercase mt-1">75th Percentile</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-semibold text-slate-800">{stats.count.toLocaleString()}</p>
                  <p className="text-sm font-medium text-slate-500 uppercase mt-1">Data Points</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Generated Value Blocks */}
          <ValueBlockRenderer blocks={valueBlocks || []} />

          <PercentileBands
            percentiles={{ p10: stats.p10, p25: stats.p25, p50: stats.median, p75: stats.p75, p90: stats.p90 }}
            entityName={cityLabel}
            submissionCount={stats.count}
          />

          {data.compMix && <CompMixBreakdown compMix={data.compMix} entityName={cityLabel} />}
          <EnrichmentDebugBanner
            entityType="City"
            entityName={cityLabel}
            enrichmentStatus={enrichmentStatus}
            analysisExists={!!cityData.analysis}
            analysisKeys={cityData.analysis ? Object.keys(cityData.analysis) : []}
            enrichedAt={cityData.analysisGeneratedAt}
          />

          {cityData.analysis ? (
            <InsightCards analysis={cityData.analysis} entityName={cityLabel} />
          ) : (enrichmentStatus === 'pending' || enrichmentStatus === 'processing') ? (
            <InsightCardsSkeleton />
          ) : (
            <Card className="bg-slate-50 border-slate-200 border-dashed">
              <CardContent className="py-8">
                <p className="text-center text-slate-500">
                  {enrichmentStatus === 'failed' || enrichmentStatus === 'error'
                    ? `We couldn't generate market analysis for ${cityLabel} yet. It will be retried automatically.`
                    : `Analysis pending for ${cityLabel}. Check back shortly.`}
                </p>
              </CardContent>
            </Card>
          )}

          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg text-slate-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-slate-600" />
                Top Companies in {cityData.city}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {topCompanies.length > 0 ? (
                <DataTable
                  headers={[
                    { label: 'Company', key: 'company' },
                    { label: 'Median Comp', key: 'median' },
                    { label: 'Data Points', key: 'count' },
                  ]}
                  rows={topCompanies.map(c => [
                    <Link
                      key={c.company_name}
                      href={`/company/${encodeURIComponent(c.company_name)}`}
                      className="text-emerald-600 hover:underline font-medium"
                    >
                      {c.company_name}
                    </Link>,
                    formatCurrency(c.median_comp),
                    c.data_points.toLocaleString(),
                  ])}
                />
              ) : (
                <p className="text-slate-500 text-center py-8">
                  No company data available for {cityData.city} yet.
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg text-slate-900 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-slate-600" />
                Highest Paying Jobs in {cityData.city}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {topJobs.length > 0 ? (
                <DataTable
                  headers={[
                    { label: 'Job Title', key: 'job' },
                    { label: 'Median Comp', key: 'median' },
                    { label: 'Data Points', key: 'count' },
                  ]}
                  rows={topJobs.map(j => [
                    <Link
                      key={j.job_title}
                      href={`/jobs/${encodeURIComponent(j.job_title)}`}
                      className="text-emerald-600 hover:underline font-medium"
                    >
                      {j.job_title}
                    </Link>,
                    formatCurrency(j.median_comp),
                    j.data_points.toLocaleString(),
                  ])}
                />
              ) : (
                <p className="text-slate-500 text-center py-8">
                  No job data available for {cityData.city} yet.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Trusted Resources */}
          <Card className="bg-slate-50 border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg text-slate-900">Trusted Resources</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {getAuthoritativeLinks('Location', cityData.city).map((link, i) => (
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

          <RelatedCities nearbyCities={nearbyCities} cityName={cityData.city} />

          {data.faq && data.faq.length > 0 && (
            <FAQSection faqs={data.faq} entityName={cityLabel} />
          )}

          {data.externalLinks && data.externalLinks.length > 0 && (
            <ExternalLinksSection links={data.externalLinks} />
          )}
          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
                Explore More
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Link href="/salaries" className="rounded-lg border border-slate-200 p-4 hover:border-emerald-300 hover:bg-slate-50 transition-colors">
                  <p className="font-semibold text-slate-900 flex items-center gap-2">
                    <Users className="h-4 w-4 text-slate-500" />
                    All Salary Data
                  </p>
                  <p className="text-sm text-slate-500 mt-1">Browse salaries across all cities</p>
                </Link>
                <Link href="/companies" className="rounded-lg border border-slate-200 p-4 hover:border-emerald-300 hover:bg-slate-50 transition-colors">
                  <p className="font-semibold text-slate-900 flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-slate-500" />
                    All Companies
                  </p>
                  <p className="text-sm text-slate-500 mt-1">Compare compensation across employers</p>
                </Link>
                <Link href="/contribute" className="rounded-lg border border-slate-200 p-4 hover:border-emerald-300 hover:bg-slate-50 transition-colors">
                  <p className="font-semibold text-slate-900 flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-slate-500" />
                    Submit Your Salary
                  </p>
                  <p className="text-sm text-slate-500 mt-1">Help grow the {cityData.city} dataset</p>
                </Link>
              </div>
            </CardContent>
          </Card>

          <DataDisclaimer />
        </div>
      </main>
    </>
  );
}
