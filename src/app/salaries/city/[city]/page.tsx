import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { notFound } from "next/navigation";
import {
  MapPin,
  Building2,
  Briefcase,
  TrendingUp,
  DollarSign,
  Users,
  AlertTriangle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/data-table";
import { InsightCards } from "@/components/insight-cards";
import {
  PercentileBands,
  CompMixBreakdown,
  DataConfidence,
  FAQSection,
  ExternalLinksSection,
  DataDisclaimer,
  RelatedCities,
} from "@/components/entity-value-modules";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ValueBlockRenderer } from "@/components/value-block-renderer";
import { supabaseAdmin } from "@/lib/supabaseClient";
import {
  hasRenderableAnalysis,
  getEnrichmentStatus,
  buildCityContextData,
  queueEnrichment,
} from "@/lib/enrichment";
import { buildPageValueBlocks } from "@/lib/value-expansion";
import {
  buildEntityFaq,
  evaluateIndexingEligibility,
  shouldTriggerEnrichment,
} from "@/lib/seo";
import { generateIntentDrivenFaqs } from "@/lib/intentClassifier";
import { getCityExternalLinks } from "@/lib/externalLinks";
import { getNearbyCities } from "@/lib/internal-linking";
import { getCityPeers, getComparisonSlug } from "@/lib/comparisonEngine";

interface CityPageProps {
  params: Promise<{ city: string }>;
}

type SalaryWithCompanyAndRole = {
  totalComp: number;
  baseSalary: number | null;
  equity: number | null;
  bonus: number | null;
  level: string | null;
  Company: { name: string } | { name: string }[] | null;
  Role: { title: string } | { title: string }[] | null;
};

function formatCurrency(n: number | undefined | null) {
  if (n === undefined || n === null || n === 0) return "$0k";
  return `$${(n / 1000).toFixed(0)}k`;
}

async function getCityData(citySlug: string) {
  // 1. Find Location by slug
  let locationData = null;
  const { data: bySlug } = await supabaseAdmin
    .from("Location")
    .select("*")
    .ilike("slug", citySlug)
    .single();

  if (bySlug) {
    locationData = bySlug;
  } else {
    // Fallback: parse slug as "city-name-ST" (e.g. "new-york-ny")
    // State abbreviation is always the last segment
    const parts = citySlug.split("-");
    const stateAbbrev = parts.length >= 2 ? parts[parts.length - 1] : "";
    const cityName = parts.slice(0, -1).join(" ");

    let fallbackQuery = supabaseAdmin
      .from("Location")
      .select("*")
      .ilike("city", cityName);

    if (stateAbbrev.length === 2) {
      fallbackQuery = fallbackQuery.ilike("state", stateAbbrev);
    }

    const { data: fallback } = await fallbackQuery.limit(1).maybeSingle();
    locationData = fallback;
  }

  if (!locationData) return null;

  const locationId = locationData.id;
  const validAnalysis = hasRenderableAnalysis(locationData.analysis, "City")
    ? locationData.analysis
    : null;

  // Check / trigger enrichment
  let enrichmentStatus = "completed";
  if (!validAnalysis) {
    const status = await getEnrichmentStatus("City", locationId);
    if (!status || status.status === "failed") {
      const contextData = buildCityContextData({
        city: locationData.city,
        state: locationData.state,
      });
      await queueEnrichment(
        "City",
        locationId,
        `${locationData.city}, ${locationData.state}`,
        contextData
      );
      enrichmentStatus = "pending";
    } else {
      enrichmentStatus = status.status;
    }
  }

  // 2. Fetch salaries
  const { data: rawSalaries } = await supabaseAdmin
    .from("Salary")
    .select(
      "totalComp, baseSalary, equity, bonus, level, Company!inner(name), Role!inner(title)"
    )
    .eq("locationId", locationId)
    .limit(500);

  const salaries = (rawSalaries as SalaryWithCompanyAndRole[] | null) || [];

  // 3. Stats
  const allComps = salaries.map((s) => s.totalComp).sort((a, b) => a - b);
  const count = allComps.length;
  const median = count > 0 ? allComps[Math.floor(count / 2)] : 0;
  const min = count > 0 ? allComps[0] : 0;
  const max = count > 0 ? allComps[count - 1] : 0;
  const p10 = count > 0 ? allComps[Math.floor(count * 0.1)] : 0;
  const p25 = count > 0 ? allComps[Math.floor(count * 0.25)] : 0;
  const p75 = count > 0 ? allComps[Math.floor(count * 0.75)] : 0;
  const p90 = count > 0 ? allComps[Math.floor(count * 0.9)] : 0;

  // Comp mix
  const withComp = salaries.filter((r) => r.totalComp > 0);
  const avgBasePct =
    withComp.length > 0
      ? withComp.reduce(
          (sum, r) => sum + ((r.baseSalary || 0) / r.totalComp) * 100,
          0
        ) / withComp.length
      : 0;
  const avgEquityPct =
    withComp.length > 0
      ? withComp.reduce(
          (sum, r) => sum + ((r.equity || 0) / r.totalComp) * 100,
          0
        ) / withComp.length
      : 0;
  const avgBonusPct =
    withComp.length > 0
      ? withComp.reduce(
          (sum, r) => sum + ((r.bonus || 0) / r.totalComp) * 100,
          0
        ) / withComp.length
      : 0;

  // 4. Top companies
  const companyMap = new Map<string, number[]>();
  salaries.forEach((s) => {
    const name = Array.isArray(s.Company) ? s.Company[0]?.name : s.Company?.name;
    if (name) {
      if (!companyMap.has(name)) companyMap.set(name, []);
      companyMap.get(name)!.push(s.totalComp);
    }
  });

  const topCompanies = Array.from(companyMap.entries())
    .map(([name, comps]) => {
      const sorted = [...comps].sort((a, b) => a - b);
      return {
        company_name: name,
        median_comp: sorted[Math.floor(sorted.length / 2)],
        data_points: sorted.length,
      };
    })
    .sort((a, b) => b.median_comp - a.median_comp)
    .slice(0, 10);

  // 5. Top jobs
  const roleMap = new Map<string, number[]>();
  salaries.forEach((s) => {
    const title = Array.isArray(s.Role) ? s.Role[0]?.title : s.Role?.title;
    if (title) {
      if (!roleMap.has(title)) roleMap.set(title, []);
      roleMap.get(title)!.push(s.totalComp);
    }
  });

  const topJobs = Array.from(roleMap.entries())
    .map(([title, comps]) => {
      const sorted = [...comps].sort((a, b) => a - b);
      return {
        job_title: title,
        median_comp: sorted[Math.floor(sorted.length / 2)],
        data_points: sorted.length,
      };
    })
    .sort((a, b) => b.median_comp - a.median_comp)
    .slice(0, 10);

  // 6. Indexing evaluation
  const indexing = evaluateIndexingEligibility({
    entityType: "City",
    entityName: `${locationData.city}, ${locationData.state}`,
    salarySubmissionCount: count,
    hasRenderableAnalysis: !!validAnalysis,
  });

  // 7. Re-queue enrichment if needed
  const shouldQueue = shouldTriggerEnrichment({
    hasRenderableAnalysis: !!validAnalysis,
    analysisGeneratedAt: locationData.analysisGeneratedAt || null,
    salarySubmissionCount: count,
  });
  if (shouldQueue && enrichmentStatus !== "processing") {
    const contextData = buildCityContextData({
      city: locationData.city,
      state: locationData.state,
    });
    await queueEnrichment(
      "City",
      locationData.id,
      `${locationData.city}, ${locationData.state}`,
      contextData
    );
  }

  const cityLabel = `${locationData.city}, ${locationData.state}`;

  // FAQ
  const intentFaqs = generateIntentDrivenFaqs("City", cityLabel, {
    medianComp: median,
    submissionCount: count,
    p25,
    p75,
    topPayingEntity: topJobs[0]?.job_title,
  });
  const genericFaqs = buildEntityFaq(cityLabel, "City", count, median);
  const seenQuestions = new Set(intentFaqs.map((f) => f.question));
  const combinedFaqs = [
    ...intentFaqs,
    ...genericFaqs.filter((f) => !seenQuestions.has(f.question)),
  ];

  // External links
  const externalLinks = getCityExternalLinks(locationData.city, locationData.state);

  // Nearby cities and value blocks
  const [nearbyCities, valueBlocks, cityPeers] = await Promise.all([
    getNearbyCities(locationData.city, locationData.state, locationData.id),
    buildPageValueBlocks(
      "Location",
      locationData.id,
      `${locationData.city}, ${locationData.state}`
    ),
    getCityPeers(locationData.city, locationData.state, 6),
  ]);

  return {
    locationData: {
      id: locationData.id,
      city: locationData.city,
      state: locationData.state,
      country: locationData.country || "US",
      metro: locationData.metro || "",
      slug: locationData.slug,
      analysis: validAnalysis,
      analysisGeneratedAt: locationData.analysisGeneratedAt || null,
    },
    stats: { count, median, min, max, p10, p25, p75, p90 },
    topCompanies,
    topJobs,
    enrichmentStatus,
    nearbyCities,
    valueBlocks,
    indexing,
    faq: combinedFaqs,
    compMix: {
      avgBasePct: Math.round(avgBasePct * 10) / 10,
      avgEquityPct: Math.round(avgEquityPct * 10) / 10,
      avgBonusPct: Math.round(avgBonusPct * 10) / 10,
    },
    dataConfidence: {
      submissionCount: count,
      companyCount: companyMap.size,
      roleCount: roleMap.size,
      confidenceLabel:
        count >= 50
          ? "high"
          : count >= 20
            ? "moderate"
            : count >= 5
              ? "limited"
              : "insufficient",
    },
    externalLinks,
    cityPeers,
  };
}

export async function generateMetadata({
  params,
}: CityPageProps): Promise<Metadata> {
  const { city: citySlug } = await params;
  const data = await getCityData(citySlug);

  if (!data) {
    return { title: "City Not Found | AvgPay" };
  }

  const cityLabel = `${data.locationData.city}, ${data.locationData.state}`;
  const robotsContent = data.indexing.shouldNoIndex
    ? "noindex,follow"
    : "index,follow";

  return {
    title: `${cityLabel} Salaries — Average Pay & Compensation Data | AvgPay`,
    description: `Explore salary data for ${cityLabel}. Median total comp is ${formatCurrency(data.stats.median)}. See top companies, highest-paying jobs, and local market insights.`,
    alternates: { canonical: `/salaries/city/${data.locationData.slug}` },
    robots: robotsContent,
    openGraph: {
      title: `${cityLabel} Salary Data | AvgPay`,
      description: `Compensation insights for ${cityLabel}. Median total comp: ${formatCurrency(data.stats.median)}.`,
      url: `https://avgpay.com/salaries/city/${data.locationData.slug}`,
      siteName: "AvgPay",
    },
  };
}

export default async function CityPage({ params }: CityPageProps) {
  const { city: citySlug } = await params;
  const data = await getCityData(citySlug);

  if (!data) {
    return notFound();
  }

  const { locationData, stats, topCompanies, topJobs, valueBlocks, cityPeers } =
    data;
  const cityLabel = `${locationData.city}, ${locationData.state}`;

  // Schema.org
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Place",
    name: cityLabel,
    address: {
      "@type": "PostalAddress",
      addressLocality: locationData.city,
      addressRegion: locationData.state,
      addressCountry: locationData.country,
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://avgpay.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Salaries",
        item: "https://avgpay.com/salaries",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: cityLabel,
        item: `https://avgpay.com/salaries/city/${locationData.slug}`,
      },
    ],
  };

  const datasetSchema = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: `${cityLabel} compensation dataset`,
    description: `Total compensation data for professionals in ${cityLabel}.`,
    creator: {
      "@type": "Organization",
      name: "AvgPay",
      url: "https://avgpay.com",
    },
    variableMeasured: [
      "base salary",
      "bonus",
      "equity",
      "total compensation",
    ],
  };

  const faqSchema =
    data.faq && data.faq.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: data.faq.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: { "@type": "Answer", text: item.answer },
          })),
        }
      : null;

  // Nearby cities for linking
  const nearbyCities = data.nearbyCities
    ? data.nearbyCities.map(
        (c: { url: string; text: string; type: string }) => ({
          href: c.url,
          label: c.text,
          context: c.type || "Nearby City",
        })
      )
    : [];

  return (
    <>
      <Script id="place-schema" type="application/ld+json">
        {JSON.stringify(jsonLd)}
      </Script>
      <Script id="breadcrumb-schema" type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </Script>
      <Script id="dataset-schema" type="application/ld+json">
        {JSON.stringify(datasetSchema)}
      </Script>
      {faqSchema && (
        <Script id="faq-schema" type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </Script>
      )}

      <main className="min-h-screen bg-white">
        <div className="max-w-6xl mx-auto px-6 py-12 space-y-8">
          <Breadcrumbs
            items={[
              { label: "Salaries", href: "/salaries" },
              { label: cityLabel },
            ]}
          />

          {/* Header */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-emerald-600">
              <MapPin className="h-5 w-5" />
              <span className="text-sm font-medium uppercase tracking-wide">
                City Salary Hub
              </span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900">
              {cityLabel} Salary Data
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl">
              Compensation insights for professionals in the{" "}
              {locationData.metro || locationData.city} metro area.
            </p>
          </div>

          {/* Data confidence */}
          {data.dataConfidence && (
            <DataConfidence
              confidence={data.dataConfidence}
              entityName={cityLabel}
            />
          )}

          {/* Low data warning */}
          {data.dataConfidence?.confidenceLabel === "insufficient" && (
            <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
              <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Limited data for {locationData.city}</p>
                <p>
                  We have {stats.count} data points for this city. Results are
                  preliminary and will improve as more salaries are reported.
                </p>
              </div>
            </div>
          )}

          {/* Compensation overview */}
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
                  <p className="text-4xl font-bold text-emerald-600">
                    {formatCurrency(stats.median)}
                  </p>
                  <p className="text-sm font-medium text-slate-500 uppercase mt-1">
                    Median Total Comp
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-semibold text-slate-800">
                    {formatCurrency(stats.p25)}
                  </p>
                  <p className="text-sm font-medium text-slate-500 uppercase mt-1">
                    25th Percentile
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-semibold text-slate-800">
                    {formatCurrency(stats.p75)}
                  </p>
                  <p className="text-sm font-medium text-slate-500 uppercase mt-1">
                    75th Percentile
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-semibold text-slate-800">
                    {stats.count.toLocaleString()}
                  </p>
                  <p className="text-sm font-medium text-slate-500 uppercase mt-1">
                    Data Points
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Value blocks */}
          <ValueBlockRenderer blocks={valueBlocks || []} />

          {/* Percentile bands */}
          <PercentileBands
            percentiles={{
              p10: stats.p10,
              p25: stats.p25,
              p50: stats.median,
              p75: stats.p75,
              p90: stats.p90,
            }}
            entityName={cityLabel}
            submissionCount={stats.count}
          />

          {/* Comp mix */}
          {data.compMix && (
            <CompMixBreakdown compMix={data.compMix} entityName={cityLabel} />
          )}

          {/* Analysis insights */}
          {locationData.analysis && (
            <InsightCards
              analysis={locationData.analysis}
              entityName={cityLabel}
            />
          )}

          {/* Top Companies */}
          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg text-slate-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-slate-600" />
                Top Companies in {locationData.city}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {topCompanies.length > 0 ? (
                <DataTable
                  headers={[
                    { label: "Company", key: "company" },
                    { label: "Median Comp", key: "median" },
                    { label: "Data Points", key: "count" },
                  ]}
                  rows={topCompanies.map((c) => [
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
                  No company data available for {locationData.city} yet.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Top Jobs */}
          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg text-slate-900 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-slate-600" />
                Highest Paying Jobs in {locationData.city}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {topJobs.length > 0 ? (
                <DataTable
                  headers={[
                    { label: "Job Title", key: "job" },
                    { label: "Median Comp", key: "median" },
                    { label: "Data Points", key: "count" },
                  ]}
                  rows={topJobs.map((j) => [
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
                  No job data available for {locationData.city} yet.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Related Cities */}
          <RelatedCities
            nearbyCities={nearbyCities}
            cityName={locationData.city}
          />

          {/* Compare vs Peer Cities (dynamic) */}
          {cityPeers.length > 0 && (
            <Card className="bg-white border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg text-slate-900 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-emerald-600" />
                  Compare {locationData.city} vs Related Cities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {cityPeers.slice(0, 6).map((peer) => {
                    const slug = getComparisonSlug(
                      `${locationData.city}, ${locationData.state}`,
                      `${peer.city}, ${peer.state}`
                    );
                    return (
                      <Link
                        key={peer.slug}
                        href={`/compare/${slug}`}
                        className="block rounded-lg border border-slate-200 p-4 hover:border-emerald-300 hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="font-semibold text-slate-900">
                              {locationData.city} vs {peer.city}
                            </span>
                            <p className="text-xs text-slate-500 mt-1">
                              {peer.reason} · {peer.sampleSize} data points
                            </p>
                          </div>
                          <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                            Compare
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Compare top jobs in this city vs national */}
          {topJobs.length > 0 && (
            <Card className="bg-white border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg text-slate-900 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-emerald-600" />
                  Compare Jobs in {locationData.city}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {topJobs.slice(0, 4).map((job, i) => {
                    const nextJob = topJobs[i + 1];
                    if (!nextJob) return null;
                    const slug = getComparisonSlug(job.job_title, nextJob.job_title);
                    return (
                      <Link
                        key={slug}
                        href={`/compare/${slug}`}
                        className="block rounded-lg border border-slate-200 p-4 hover:border-emerald-300 hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-slate-900">
                            {job.job_title} vs {nextJob.job_title}
                          </span>
                          <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                            Compare
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* FAQs */}
          {data.faq && data.faq.length > 0 && (
            <FAQSection faqs={data.faq} entityName={cityLabel} />
          )}

          {/* External links */}
          {data.externalLinks && data.externalLinks.length > 0 && (
            <ExternalLinksSection links={data.externalLinks} />
          )}

          {/* Explore more */}
          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
                Explore More
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Link
                  href="/salaries"
                  className="rounded-lg border border-slate-200 p-4 hover:border-emerald-300 hover:bg-slate-50 transition-colors"
                >
                  <p className="font-semibold text-slate-900 flex items-center gap-2">
                    <Users className="h-4 w-4 text-slate-500" />
                    All Salary Data
                  </p>
                  <p className="text-sm text-slate-500 mt-1">
                    Browse salaries across all cities
                  </p>
                </Link>
                <Link
                  href="/companies"
                  className="rounded-lg border border-slate-200 p-4 hover:border-emerald-300 hover:bg-slate-50 transition-colors"
                >
                  <p className="font-semibold text-slate-900 flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-slate-500" />
                    All Companies
                  </p>
                  <p className="text-sm text-slate-500 mt-1">
                    Compare compensation across employers
                  </p>
                </Link>
                <Link
                  href="/contribute"
                  className="rounded-lg border border-slate-200 p-4 hover:border-emerald-300 hover:bg-slate-50 transition-colors"
                >
                  <p className="font-semibold text-slate-900 flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-slate-500" />
                    Submit Your Salary
                  </p>
                  <p className="text-sm text-slate-500 mt-1">
                    Help grow the {locationData.city} dataset
                  </p>
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
