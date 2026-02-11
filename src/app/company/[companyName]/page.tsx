"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, ExternalLink, Sparkles } from 'lucide-react';
import { DataTable } from "@/components/data-table";
import { InsightCards } from '@/components/insight-cards';

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
}

interface CompanyInfo {
  id: string;
  name: string;
  website: string;
  description: string;
  logoUrl?: string;
  analysis?: Record<string, string> | null;
  salarySummary?: SalarySummary[];
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
        const response = await fetch(`/api/company-details?companyName=${encodeURIComponent(companyName)}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const { companyData: fetchedData, salarySummary, enrichmentStatus: initialEnrichmentStatus } = await response.json();

        setCompanyData({
          id: fetchedData.id,
          name: fetchedData.name,
          website: fetchedData.website || '#',
          description: fetchedData.description,
          logoUrl: fetchedData.logoUrl,
          analysis: fetchedData.analysis || null,
          salarySummary,
        });
        setEnrichmentStatus(initialEnrichmentStatus || 'none');

        const similarResponse = await fetch(`/api/company-similar?companyName=${encodeURIComponent(companyName)}`);
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

  return (
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


          {!companyData.analysis && (
            <Card className="bg-emerald-50 border-emerald-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-slate-900 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-emerald-600" />
                  Insights Briefing
                </CardTitle>
                <CardDescription className="text-slate-600">
                  {enrichmentStatus === 'failed'
                    ? 'The latest insights run failed quality checks. It will be retried after new salary submissions.'
                    : enrichmentStatus === 'pending' || enrichmentStatus === 'processing'
                      ? 'A fresh insights briefing is being generated for this company. Check back shortly for deeper context.'
                      : 'No automated briefing is available yet. Submitting more salary data helps trigger richer analysis.'}
                </CardDescription>
              </CardHeader>
            </Card>
          )}

          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-slate-900">Compensation Storyline</CardTitle>
              <CardDescription className="text-slate-500">
                A narrative view of how this company pays, where confidence is strongest, and what to do with this signal.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-slate-700 leading-relaxed">
              <p>
                {strongestRole
                  ? `${companyData.name} pays most aggressively for ${strongestRole.role}, where the median package lands near ${formatCurrency(strongestRole.medianComp)}. This is your anchor role for setting an upper-band negotiation target.`
                  : `We are still collecting enough samples to build a complete compensation storyline for ${companyData.name}.`}
              </p>
              {broadestRole && (
                <p>
                  The most trusted compensation signal comes from {broadestRole.role} with {broadestRole.dataPoints.toLocaleString()} submissions. Higher sample depth typically means the median is more stable and less distorted by outliers.
                </p>
              )}
              {companyData.salarySummary && companyData.salarySummary.length > 1 && strongestRole && (
                <p>
                  Internal spread matters: the difference between the top-paying median role and lower-paying tracks helps candidates decide whether to negotiate for title scope, leveling, or team placement instead of base alone.
                </p>
              )}
              {similarCompanies.length > 0 && (
                <p>
                  Peer comparison shows {companyData.name} is most comparable to {similarCompanies.slice(0, 3).map((c) => c.company).join(', ')}. Use that shortlist as your counter-offer benchmark set rather than broad market averages.
                </p>
              )}
              <p>
                Practical playbook: use this page to set a target band, validate that target against peer employers, then cross-check your role/location page to confirm whether your offer is in the premium, baseline, or discount tier.
              </p>
            </CardContent>
          </Card>

          {/* The Analyst View (Gemini Analysis) */}
          {companyData.analysis && (
            <InsightCards analysis={companyData.analysis} entityName={companyData.name} />
          )}

          {/* Related Links / Action Section */}
          {similarCompanies.length > 0 && (
            <Card className="bg-white border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-slate-900">Compare {companyData.name} vs peers</CardTitle>
                <CardDescription className="text-slate-500">
                  Dynamically discovered peers with the most similar salary bands in our dataset.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {similarCompanies.map((comparison) => (
                    <Link
                      key={comparison.slug}
                      href={comparison.href}
                      className="rounded-lg border border-slate-200 p-4 hover:border-emerald-300 hover:bg-slate-50 transition-colors"
                    >
                      <p className="font-semibold text-slate-900">{companyData.name} vs {comparison.company}</p>
                      <p className="text-sm text-slate-500 mt-1">Similarity score: {comparison.similarityScore.toFixed(1)} · Median comp: {formatCurrency(comparison.medianComp)} · Samples: {comparison.sampleSize}</p>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
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
        </div>
      </div>
    </main>
  );
};

export default CompanyDetailPage;
