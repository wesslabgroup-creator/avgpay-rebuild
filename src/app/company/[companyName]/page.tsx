"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, ExternalLink } from 'lucide-react';
import { DataTable } from "@/components/data-table";
import { getComparisonsForCompany } from '@/app/compare/data/curated-comparisons';

interface SalarySummary {
  role: string;
  minComp: number;
  maxComp: number;
  medianComp: number;
  levelsCount: number;
  dataPoints: number;
}

interface CompanyInfo {
  name: string;
  website: string;
  description: string;
  logoUrl?: string;
  salarySummary?: SalarySummary[];
}

const CompanyDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const companyName = decodeURIComponent(params?.companyName as string || '');

  const [companyData, setCompanyData] = useState<CompanyInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        const { companyData: fetchedData, salarySummary } = await response.json();

        setCompanyData({
          name: fetchedData.name,
          website: fetchedData.website || '#',
          description: fetchedData.description,
          logoUrl: fetchedData.logoUrl, // Assuming logoUrl is in DB
          salarySummary,
        });
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

  if (isLoading) {
    return (
      <main className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center">
          <Card className="bg-surface border-border p-8 w-96 shadow-sm">
            <CardHeader>
              <CardTitle className="text-text-primary animate-pulse">Loading...</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-text-muted">Fetching details for {companyName}...</CardDescription>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  if (error || !companyData) {
    return (
      <main className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center">
          <Card className="bg-surface border-border p-8 w-96 shadow-sm">
            <CardHeader>
              <CardTitle className="text-error">Company Not Found</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-text-muted mb-4">{error}</CardDescription>
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

  const tableRows = companyData.salarySummary?.map((s, index) => [
    <Link key={`link-${index}`} href={`/jobs/${encodeURIComponent(s.role)}`} className="text-primary hover:text-primary font-medium transition-colors">
      {s.role}
    </Link>,
    `${formatCurrency(s.minComp)} - ${formatCurrency(s.maxComp)}`,
    formatCurrency(s.medianComp),
    `${s.levelsCount} Levels`,
    s.dataPoints.toLocaleString()
  ]) || [];

  const relevantComparisons = getComparisonsForCompany(companyData.name);

  return (
    <main className="min-h-screen bg-surface">
      <div className="px-6 py-12">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Company Header */}
          <Card className="bg-surface border-border shadow-sm overflow-hidden">
            <div className="h-32 bg-gradient-to-r from-primary to-accent"></div>
            <CardContent className="px-8 pb-8 -mt-12 flex flex-col md:flex-row items-start gap-6">
              <div className="flex-shrink-0 h-24 w-24 md:h-32 md:w-32 rounded-xl overflow-hidden border-4 border-surface bg-surface shadow-md flex items-center justify-center">
                {companyData.logoUrl ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={companyData.logoUrl} alt={`${companyData.name} Logo`} className="w-full h-full object-contain p-2" />
                  </>
                ) : (
                  <span className="text-3xl font-bold text-text-muted">{companyData.name.substring(0, 1)}</span>
                )}
              </div>
              <div className="mt-12 md:mt-14 w-full">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <CardTitle className="text-4xl font-bold tracking-tight text-text-primary">{companyData.name}</CardTitle>
                    <CardDescription className="text-lg text-text-secondary mt-2 max-w-3xl">{companyData.description}</CardDescription>
                  </div>
                  <Link href={companyData.website} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" className="shrink-0 border-border text-text-secondary hover:bg-surface-subtle">
                      Visit Website <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Consolidated Salary Overview */}
          <Card className="bg-surface border-border shadow-sm">
            <CardHeader>
              <CardTitle className="text-text-primary">Salary Overview by Role</CardTitle>
              <CardDescription className="text-text-muted">Aggregated compensation data for {companyData.name}.</CardDescription>
            </CardHeader>
            <CardContent>
              {tableRows.length > 0 ? (
                <DataTable headers={tableHeaders} rows={tableRows} />
              ) : (
                <p className="text-text-muted text-center py-12 bg-surface-subtle rounded-lg border border-dashed border-border">
                  No detailed salary data available for this company yet.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Related Links / Action Section */}
          {relevantComparisons.length > 0 && (
            <Card className="bg-surface border-border shadow-sm">
              <CardHeader>
                <CardTitle className="text-text-primary">Compare {companyData.name} vs peers</CardTitle>
                <CardDescription className="text-text-muted">
                  Explore curated, high-demand comparison pages to benchmark competing offers.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {relevantComparisons.map((comparison) => (
                    <Link
                      key={comparison.slug}
                      href={`/compare/${comparison.slug}`}
                      className="rounded-lg border border-border p-4 hover:border-primary hover:bg-surface-subtle transition-colors"
                    >
                      <p className="font-semibold text-text-primary">{comparison.title}</p>
                      <p className="text-sm text-text-muted mt-1">{comparison.summary}</p>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/salaries">
              <Button variant="outline" size="lg" className="h-auto py-6 justify-between bg-surface hover:bg-surface-subtle border-border hover:border-border text-text-secondary w-full">
                <span className="flex items-center"><ArrowLeft className="mr-3 h-5 w-5 text-text-muted" /> Back to Salaries</span>
              </Button>
            </Link>
            <Link href="/companies">
              <Button variant="outline" size="lg" className="h-auto py-6 justify-between bg-surface hover:bg-surface-subtle border-border hover:border-border text-text-secondary w-full">
                <span className="flex items-center">View All Companies <ArrowRight className="ml-3 h-5 w-5 text-text-muted" /></span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CompanyDetailPage;
