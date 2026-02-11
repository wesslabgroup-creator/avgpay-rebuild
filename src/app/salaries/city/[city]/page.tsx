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
import {
  ChevronLeft,
  MapPin,
  Building2,
  Briefcase,
  TrendingUp,
  DollarSign,
  Users,
} from 'lucide-react';

interface CityStats {
  count: number;
  median: number;
  min: number;
  max: number;
  p25: number;
  p75: number;
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
}

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

  const { cityData, stats, topCompanies, topJobs } = data;
  const cityLabel = `${cityData.city}, ${cityData.state}`;

  // Schema.org structured data for SEO
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

  return (
    <>
      <Head>
        <title>{`${cityLabel} Salaries — Average Pay & Compensation Data | AvgPay`}</title>
        <meta
          name="description"
          content={`Explore salary data for ${cityLabel}. Median total comp is ${formatCurrency(stats.median)}. See top companies, highest-paying jobs, and local market insights.`}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>

      <main className="min-h-screen bg-white">
        <div className="max-w-6xl mx-auto px-6 py-12 space-y-8">
          {/* Back button */}
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="text-emerald-600 hover:text-emerald-700 -ml-4"
          >
            <ChevronLeft className="w-4 h-4 mr-1" /> Back to Salaries
          </Button>

          {/* City Hero */}
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

          {/* Hero Stats (Hard Numbers from DB) */}
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

          {/* Debug Banner (dev-only) */}
          <EnrichmentDebugBanner
            entityType="City"
            entityName={cityLabel}
            enrichmentStatus={enrichmentStatus}
            analysisExists={!!cityData.analysis}
            analysisKeys={cityData.analysis ? Object.keys(cityData.analysis) : []}
            enrichedAt={cityData.analysisGeneratedAt}
          />

          {/* The Analyst View (Gemini Analysis Insight Cards) */}
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

          {/* Top Companies in this City */}
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

          {/* Top Jobs in this City (SEO Internal Linking) */}
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

          {/* Related Markets / Internal Links */}
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
        </div>
      </main>
    </>
  );
}
