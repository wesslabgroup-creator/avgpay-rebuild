import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { notFound } from "next/navigation";
import { unstable_cache } from "next/cache";
import {
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Building2,
  MapPin,
  TrendingUp,
  Briefcase,
} from "lucide-react";
import {
  getCompareProfile,
  getSimilarJobs,
} from "@/lib/comparisonEngine";

interface PageProps {
  params: Promise<{ jobTitle: string; city: string }>;
}

function toDisplayName(slug: string): string {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatCurrency(value: number): string {
  if (!value) return "$0";
  return `$${Math.round(value).toLocaleString()}`;
}

export const dynamicParams = true;
export const revalidate = 21600;

function getCachedProfile(jobTitle: string, cityName?: string) {
  return unstable_cache(
    async () => getCompareProfile(jobTitle, cityName),
    ["job-city-profile", jobTitle.toLowerCase(), (cityName ?? "global").toLowerCase()],
    { revalidate: 21600, tags: ["job-city-profile"] },
  )();
}

function getCachedSimilarJobs(jobTitle: string, limit: number, cityName: string) {
  return unstable_cache(
    async () => getSimilarJobs(jobTitle, limit, cityName),
    ["job-city-similar", jobTitle.toLowerCase(), cityName.toLowerCase(), String(limit)],
    { revalidate: 21600, tags: ["job-city-similar"] },
  )();
}

function getConfidenceLabel(sampleSize: number): string {
  if (sampleSize >= 50) return "high";
  if (sampleSize >= 20) return "moderate";
  if (sampleSize >= 5) return "limited";
  return "insufficient";
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { jobTitle: jobSlug, city: citySlug } = await params;
  const jobTitle = toDisplayName(jobSlug);
  const cityName = toDisplayName(citySlug);

  return {
    title: `${jobTitle} Salary in ${cityName} | AvgPay`,
    description: `See real salary data for ${jobTitle} positions in ${cityName}. Median total compensation, top paying companies, and percentile breakdowns.`,
    alternates: { canonical: `/jobs/${jobSlug}/${citySlug}` },
    robots: "index,follow",
    openGraph: {
      title: `${jobTitle} Salary in ${cityName} | AvgPay`,
      description: `Real salary benchmarks for ${jobTitle} in ${cityName}.`,
      url: `https://avgpay.com/jobs/${jobSlug}/${citySlug}`,
      siteName: "AvgPay",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${jobTitle} Salary in ${cityName} | AvgPay`,
      description: `Real salary benchmarks for ${jobTitle} in ${cityName}.`,
    },
  };
}

export default async function JobCityPage({ params }: PageProps) {
  const { jobTitle: jobSlug, city: citySlug } = await params;
  const jobTitle = toDisplayName(jobSlug);
  const cityName = toDisplayName(citySlug);

  // Extract just the city name (without state) for DB filtering
  // Slugs like "seattle-wa" → "Seattle Wa" → filter on "Seattle"
  const cityParts = cityName.split(" ");
  const cityFilter = cityParts.length > 1 && cityParts[cityParts.length - 1].length === 2
    ? cityParts.slice(0, -1).join(" ")
    : cityName;

  // Fetch profile data for this job in this city
  const profile = await getCachedProfile(jobTitle, cityFilter);

  // Also fetch the global job profile (no city filter) for comparison
  const globalProfile = await getCachedProfile(jobTitle, undefined);

  if (profile.sampleSize === 0 && globalProfile.sampleSize === 0) {
    return notFound();
  }

  const confidenceLabel = getConfidenceLabel(profile.sampleSize);
  const shouldIndex = profile.sampleSize >= 5;

  // Fetch similar jobs in this city
  let similarJobs: { jobTitle: string; slug: string; medianComp: number; sampleSize: number }[] = [];
  try {
    const similar = await getCachedSimilarJobs(jobTitle, 6, cityFilter);
    similarJobs = similar.slice(0, 6);
  } catch {
    // Non-critical
  }

  // Build nearby cities from global profile top locations
  const nearbyCities = globalProfile.topLocations
    .filter((loc) => !loc.location.toLowerCase().includes(cityFilter.toLowerCase()))
    .slice(0, 5);

  // FAQs
  const faqs = [
    {
      question: `How much does a ${jobTitle} make in ${cityName}?`,
      answer: profile.sampleSize > 0
        ? `Based on ${profile.sampleSize} data points, the median total compensation for a ${jobTitle} in ${cityName} is ${formatCurrency(profile.medianTotalComp)}, with a range from ${formatCurrency(profile.p25TotalComp)} (25th percentile) to ${formatCurrency(profile.p75TotalComp)} (75th percentile).`
        : `We don't have enough location-specific data yet. Nationally, the median total compensation for a ${jobTitle} is ${formatCurrency(globalProfile.medianTotalComp)}.`,
    },
    {
      question: `What companies pay the most for ${jobTitle} in ${cityName}?`,
      answer: profile.topCompanies.length > 0
        ? `The top employers by data volume for ${jobTitle} in ${cityName} include ${profile.topCompanies.slice(0, 3).map((c) => c.company).join(", ")}. Check the company breakdown above for median compensation at each.`
        : `We're still collecting data on individual companies. Nationally, top employers include ${globalProfile.topCompanies.slice(0, 3).map((c) => c.company).join(", ")}.`,
    },
    {
      question: `How does ${jobTitle} pay in ${cityName} compare to the national average?`,
      answer: profile.sampleSize > 0 && globalProfile.sampleSize > 0
        ? `The median total comp in ${cityName} is ${formatCurrency(profile.medianTotalComp)} compared to the national median of ${formatCurrency(globalProfile.medianTotalComp)}. That's ${profile.medianTotalComp > globalProfile.medianTotalComp ? "above" : "below"} the national benchmark.`
        : `We need more local data to make a reliable comparison. The national median for ${jobTitle} is ${formatCurrency(globalProfile.medianTotalComp)}.`,
    },
  ];

  // Schema.org structured data
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://avgpay.com" },
      { "@type": "ListItem", position: 2, name: "Jobs", item: "https://avgpay.com/jobs" },
      { "@type": "ListItem", position: 3, name: jobTitle, item: `https://avgpay.com/jobs/${jobSlug}` },
      { "@type": "ListItem", position: 4, name: cityName, item: `https://avgpay.com/jobs/${jobSlug}/${citySlug}` },
    ],
  };

  // Use local data if available, otherwise fall back to global
  const hasLocalData = profile.sampleSize > 0;
  const displayProfile = hasLocalData ? profile : globalProfile;

  return (
    <main className="min-h-screen bg-white pt-24 pb-12">
      <Script id={`faq-schema-${jobSlug}-${citySlug}`} type="application/ld+json">
        {JSON.stringify(faqSchema)}
      </Script>
      <Script id={`breadcrumb-schema-${jobSlug}-${citySlug}`} type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </Script>
      {!shouldIndex && (
        <meta name="robots" content="noindex,follow" />
      )}

      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Breadcrumb */}
        <nav className="flex items-center text-sm text-slate-500 gap-1">
          <Link href="/" className="hover:text-emerald-600">Home</Link>
          <span>/</span>
          <Link href="/compare" className="hover:text-emerald-600">Salaries</Link>
          <span>/</span>
          <Link href={`/jobs/${jobSlug}`} className="hover:text-emerald-600">{jobTitle}</Link>
          <span>/</span>
          <span className="text-slate-900 font-medium">{cityName}</span>
        </nav>

        <header className="mt-6 space-y-4">
          <h1 className="text-4xl font-bold text-slate-900">
            {jobTitle} Salary in <span className="text-emerald-600">{cityName}</span>
          </h1>
          <p className="text-lg text-slate-600">
            Market compensation data for {jobTitle} positions in the {cityName} area, including base salary, equity, and bonus breakdowns.
          </p>
        </header>

        {/* Data confidence banner */}
        {!hasLocalData && (
          <div className="mt-4 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Limited local data</p>
              <p>We don&apos;t have enough {cityName}-specific data yet. Showing national benchmarks for {jobTitle} instead. More local submissions will improve accuracy.</p>
            </div>
          </div>
        )}

        {hasLocalData && confidenceLabel === "insufficient" && (
          <div className="mt-4 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Limited data available</p>
              <p>This page has {profile.sampleSize} data points for {jobTitle} in {cityName}. Results may not be fully representative.</p>
            </div>
          </div>
        )}

        {/* Key stats cards */}
        <div className="mt-6 grid sm:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-5 w-5 text-emerald-600" />
              <span className="text-sm font-semibold text-emerald-900">
                Median Total Comp {hasLocalData ? "" : "(National)"}
              </span>
            </div>
            <div className="text-3xl font-bold text-slate-900">{formatCurrency(displayProfile.medianTotalComp)}</div>
            <p className="text-sm text-emerald-700 mt-1">{displayProfile.sampleSize} data points</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-semibold text-slate-700">25th Percentile</span>
            </div>
            <div className="text-3xl font-bold text-slate-900">{formatCurrency(displayProfile.p25TotalComp)}</div>
            <p className="text-sm text-slate-500 mt-1">Lower band</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-semibold text-slate-700">75th Percentile</span>
            </div>
            <div className="text-3xl font-bold text-slate-900">{formatCurrency(displayProfile.p75TotalComp)}</div>
            <p className="text-sm text-slate-500 mt-1">Upper band</p>
          </div>
        </div>

        {/* Compensation breakdown */}
        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-xl font-bold text-slate-900">Compensation breakdown</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-sm border border-slate-200 rounded-lg overflow-hidden bg-white">
              <thead className="bg-slate-100 text-slate-700">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Metric</th>
                  <th className="px-4 py-3 text-left font-semibold">
                    {hasLocalData ? cityName : "National"}
                  </th>
                  {hasLocalData && globalProfile.sampleSize > 0 && (
                    <th className="px-4 py-3 text-left font-semibold text-slate-500">National</th>
                  )}
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-slate-200">
                  <td className="px-4 py-3 text-slate-600">Median total compensation</td>
                  <td className="px-4 py-3 text-slate-900 font-medium">{formatCurrency(displayProfile.medianTotalComp)}</td>
                  {hasLocalData && globalProfile.sampleSize > 0 && (
                    <td className="px-4 py-3 text-slate-500">{formatCurrency(globalProfile.medianTotalComp)}</td>
                  )}
                </tr>
                <tr className="border-t border-slate-200">
                  <td className="px-4 py-3 text-slate-600">Median base salary</td>
                  <td className="px-4 py-3 text-slate-900 font-medium">{formatCurrency(displayProfile.medianBaseSalary)}</td>
                  {hasLocalData && globalProfile.sampleSize > 0 && (
                    <td className="px-4 py-3 text-slate-500">{formatCurrency(globalProfile.medianBaseSalary)}</td>
                  )}
                </tr>
                <tr className="border-t border-slate-200">
                  <td className="px-4 py-3 text-slate-600">P25 total compensation</td>
                  <td className="px-4 py-3 text-slate-900 font-medium">{formatCurrency(displayProfile.p25TotalComp)}</td>
                  {hasLocalData && globalProfile.sampleSize > 0 && (
                    <td className="px-4 py-3 text-slate-500">{formatCurrency(globalProfile.p25TotalComp)}</td>
                  )}
                </tr>
                <tr className="border-t border-slate-200">
                  <td className="px-4 py-3 text-slate-600">P75 total compensation</td>
                  <td className="px-4 py-3 text-slate-900 font-medium">{formatCurrency(displayProfile.p75TotalComp)}</td>
                  {hasLocalData && globalProfile.sampleSize > 0 && (
                    <td className="px-4 py-3 text-slate-500">{formatCurrency(globalProfile.p75TotalComp)}</td>
                  )}
                </tr>
                <tr className="border-t border-slate-200">
                  <td className="px-4 py-3 text-slate-600">Observed range</td>
                  <td className="px-4 py-3 text-slate-900 font-medium">
                    {formatCurrency(displayProfile.minTotalComp)} &ndash; {formatCurrency(displayProfile.maxTotalComp)}
                  </td>
                  {hasLocalData && globalProfile.sampleSize > 0 && (
                    <td className="px-4 py-3 text-slate-500">
                      {formatCurrency(globalProfile.minTotalComp)} &ndash; {formatCurrency(globalProfile.maxTotalComp)}
                    </td>
                  )}
                </tr>
                <tr className="border-t border-slate-200">
                  <td className="px-4 py-3 text-slate-600">Sample size</td>
                  <td className="px-4 py-3 text-slate-900 font-medium">{displayProfile.sampleSize.toLocaleString()}</td>
                  {hasLocalData && globalProfile.sampleSize > 0 && (
                    <td className="px-4 py-3 text-slate-500">{globalProfile.sampleSize.toLocaleString()}</td>
                  )}
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Top companies for this role in this city */}
        {displayProfile.topCompanies.length > 0 && (
          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="h-5 w-5 text-slate-400" />
              Top Employers for {jobTitle} {hasLocalData ? `in ${cityName}` : ""}
            </h2>
            <div className="mt-4 space-y-3">
              {displayProfile.topCompanies.map((c) => (
                <Link
                  key={c.company}
                  href={`/company/${encodeURIComponent(c.company.toLowerCase().replace(/\s+/g, "-"))}`}
                  className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl hover:border-emerald-200 hover:shadow-sm transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500">
                      {c.company[0]}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">{c.company}</h3>
                      <p className="text-xs text-slate-500">{c.sampleSize} data points</p>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-400" />
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Similar roles in this city */}
        {similarJobs.length > 0 && (
          <section className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-slate-400" />
              Related Roles {hasLocalData ? `in ${cityName}` : ""}
            </h2>
            <div className="mt-4 grid sm:grid-cols-2 gap-3">
              {similarJobs.map((job) => (
                <Link
                  key={job.slug}
                  href={`/jobs/${job.slug}/${citySlug}`}
                  className="rounded-lg border border-slate-200 bg-white p-4 hover:border-emerald-300 transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold text-slate-900">{job.jobTitle}</h3>
                      <p className="text-sm text-slate-500">
                        Median {formatCurrency(job.medianComp)} &middot; {job.sampleSize} points
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-emerald-600" />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Same role in other cities */}
        {nearbyCities.length > 0 && (
          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-slate-400" />
              {jobTitle} in Other Markets
            </h2>
            <div className="mt-4 grid sm:grid-cols-2 gap-3">
              {nearbyCities.map((loc) => {
                const locSlug = slugify(loc.location);
                return (
                  <Link
                    key={loc.location}
                    href={`/jobs/${jobSlug}/${locSlug}`}
                    className="rounded-lg border border-slate-200 px-4 py-3 text-slate-700 hover:border-emerald-300 hover:text-emerald-700 transition"
                  >
                    {jobTitle} in {loc.location}
                    <span className="text-xs text-slate-400 ml-2">({loc.sampleSize} points)</span>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* Key takeaways */}
        <section className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Key Takeaways</h2>
          <ul className="space-y-3">
            {hasLocalData && globalProfile.sampleSize > 0 && (
              <li className="flex items-start gap-2 text-slate-700">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                <span>
                  {jobTitle} in {cityName} pays {" "}
                  {profile.medianTotalComp > globalProfile.medianTotalComp
                    ? `${Math.round(((profile.medianTotalComp - globalProfile.medianTotalComp) / globalProfile.medianTotalComp) * 100)}% above`
                    : `${Math.round(((globalProfile.medianTotalComp - profile.medianTotalComp) / globalProfile.medianTotalComp) * 100)}% below`}{" "}
                  the national median.
                </span>
              </li>
            )}
            <li className="flex items-start gap-2 text-slate-700">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
              <span>
                The IQR band ({formatCurrency(displayProfile.p25TotalComp)} &ndash; {formatCurrency(displayProfile.p75TotalComp)}) gives a more realistic range than headline medians alone.
              </span>
            </li>
            <li className="flex items-start gap-2 text-slate-700">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
              <span>
                Negotiate across the full comp stack: base, annual bonus, equity refresh, and sign-on.
              </span>
            </li>
          </ul>
        </section>

        {/* FAQs */}
        <section className="mt-8 grid gap-4">
          <h2 className="text-2xl font-bold text-slate-900">Frequently Asked Questions</h2>
          {faqs.map((faq) => (
            <article key={faq.question} className="rounded-xl border border-slate-200 p-5">
              <h3 className="font-semibold text-slate-900">{faq.question}</h3>
              <p className="mt-2 text-slate-600">{faq.answer}</p>
            </article>
          ))}
        </section>

        {/* CTA */}
        <section className="mt-10 rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
          <h2 className="text-xl font-bold text-slate-900">Ready to benchmark your own offer?</h2>
          <p className="text-slate-600 mt-2">
            Use AvgPay&apos;s Offer Analyzer to compare your {jobTitle} package in {cityName} against verified market data.
          </p>
          <Link
            href="/tools/offer-analyzer"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-3 font-semibold text-white hover:bg-emerald-700"
          >
            Analyze my offer
            <ArrowRight className="h-4 w-4" />
          </Link>
        </section>
      </section>
    </main>
  );
}
