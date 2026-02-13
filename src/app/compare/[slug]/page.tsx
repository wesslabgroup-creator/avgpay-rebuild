import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2, AlertTriangle } from "lucide-react";
import { ComparisonInsights } from "@/components/comparison-insights";
import {
  getCompareProfile,
  computeCompareConfidence,
  generateComparisonAnalysis,
  generateComparisonMetadata,
  getSimilarJobs,
  getComparisonSlug,
} from "@/lib/comparisonEngine";
import {
  getComparisonBySlug,
} from "@/app/compare/data/curated-comparisons";

interface ComparisonPageProps {
  params: Promise<{ slug: string }>;
}

function toDisplayEntity(raw: string) {
  return raw
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatCurrency(value: number) {
  if (!value) return "$0";
  return `$${Math.round(value).toLocaleString()}`;
}

function parseSlug(slug: string): { entityA: string; entityB: string } | null {
  const vsIndex = slug.indexOf("-vs-");
  if (vsIndex === -1) return null;
  const left = slug.slice(0, vsIndex);
  const right = slug.slice(vsIndex + 4);
  if (!left || !right) return null;
  return { entityA: toDisplayEntity(left), entityB: toDisplayEntity(right) };
}

export const dynamicParams = true;

export async function generateMetadata({ params }: ComparisonPageProps): Promise<Metadata> {
  const { slug } = await params;
  const parsed = parseSlug(slug);

  if (!parsed) {
    return { title: "Comparison Not Found | AvgPay" };
  }

  // Check curated first for richer metadata
  const curated = getComparisonBySlug(slug);
  const metadata = curated
    ? { title: curated.title, description: curated.description }
    : generateComparisonMetadata(parsed.entityA, parsed.entityB);

  // Pre-check data confidence for robots directive
  const [metaProfileA, metaProfileB] = await Promise.all([
    getCompareProfile(parsed.entityA),
    getCompareProfile(parsed.entityB),
  ]);
  const metaConfidence = computeCompareConfidence(metaProfileA.sampleSize, metaProfileB.sampleSize);

  return {
    title: `${metadata.title} | AvgPay`,
    description: metadata.description,
    alternates: { canonical: `/compare/${slug}` },
    robots: metaConfidence.shouldIndex ? "index,follow" : "noindex,follow",
    openGraph: {
      title: `${metadata.title} | AvgPay`,
      description: metadata.description,
      url: `https://avgpay.com/compare/${slug}`,
      siteName: "AvgPay",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${metadata.title} | AvgPay`,
      description: metadata.description,
    },
  };
}

export default async function ComparisonPage({ params }: ComparisonPageProps) {
  const { slug } = await params;
  const parsed = parseSlug(slug);

  if (!parsed) {
    return notFound();
  }

  const { entityA, entityB } = parsed;

  // Fetch profiles concurrently using the new universal compare engine
  const [profileA, profileB] = await Promise.all([
    getCompareProfile(entityA),
    getCompareProfile(entityB),
  ]);

  const confidence = computeCompareConfidence(profileA.sampleSize, profileB.sampleSize);

  // Get metadata (curated or dynamic)
  const curated = getComparisonBySlug(slug);
  const metadata = generateComparisonMetadata(entityA, entityB);
  const title = curated?.title || metadata.title;
  const description = curated?.description || metadata.description;
  const whyPopular = curated?.whyPopular || metadata.whyPopular;
  const takeaways = curated?.takeaways || metadata.takeaways;
  const faqs = curated?.faqs || metadata.faqs;
  const ctaHref = curated?.cta?.href || "/tools/offer-analyzer";
  const ctaLabel = curated?.cta?.label || "Analyze my offer";

  // Generate comparison narrative (only if enough data)
  const narrative = {
    philosophicalDivergence: `${entityA} and ${entityB} typically optimize compensation in different ways: one skews toward stable annual cash while the other leans into variable upside and performance-linked growth.`,
    culturalTradeOff: "The core trade-off is execution pace versus predictability. Team environment fit often compounds over multiple promotion cycles and can outweigh small first-year cash deltas.",
    winnerProfileA: `${entityA}-fit: candidates who prioritize this package usually value this entity's operating model and compensation cadence.`,
    winnerProfileB: `${entityB}-fit: candidates who choose this package usually prefer the alternative risk/reward profile.`,
    tradeOffSummary: "The better offer depends on whether you optimize for predictable annual cash flow or for potentially higher upside through equity, bonus, and long-term vesting outcomes.",
  };

  if (confidence.totalSampleSize >= 5) {
    try {
      const generated = await generateComparisonAnalysis(entityA, entityB, "All Roles", slug);
      if (generated.philosophical_divergence) narrative.philosophicalDivergence = generated.philosophical_divergence;
      if (generated.cultural_tradeoff) narrative.culturalTradeOff = generated.cultural_tradeoff;
      if (generated.winner_profile) {
        narrative.winnerProfileA = `${entityA}-fit: ${generated.winner_profile}`;
        narrative.winnerProfileB = `${entityB}-fit: ${generated.winner_profile}`;
      }
      if (generated.cultural_tradeoff) narrative.tradeOffSummary = generated.cultural_tradeoff;
    } catch {
      // Use default narrative
    }
  }

  // Fetch similar jobs for internal linking
  let similarSuggestions: { jobTitle: string; slug: string }[] = [];
  try {
    const similar = await getSimilarJobs(entityA, 4);
    similarSuggestions = similar
      .filter((s) => s.jobTitle.toLowerCase() !== entityB.toLowerCase())
      .slice(0, 4);
  } catch {
    // Non-critical
  }

  const statsA = {
    medianTotalComp: profileA.medianTotalComp,
    medianBaseSalary: profileA.medianBaseSalary,
    medianNonBaseComp: profileA.medianNonBaseComp,
    sampleSize: profileA.sampleSize,
  };
  const statsB = {
    medianTotalComp: profileB.medianTotalComp,
    medianBaseSalary: profileB.medianBaseSalary,
    medianNonBaseComp: profileB.medianNonBaseComp,
    sampleSize: profileB.sampleSize,
  };

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
      { "@type": "ListItem", position: 2, name: "Compare", item: "https://avgpay.com/compare" },
      { "@type": "ListItem", position: 3, name: title, item: `https://avgpay.com/compare/${slug}` },
    ],
  };

  const datasetSchema = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: `${title} Compensation Dataset`,
    description: `Database-backed salary distribution snapshot comparing ${entityA} and ${entityB}.`,
    creator: { "@type": "Organization", name: "AvgPay" },
    variableMeasured: ["totalComp", "baseSalary", "medianTotalComp", "p25TotalComp", "p75TotalComp", "sampleSize"],
  };

  return (
    <main className="min-h-screen bg-white pt-24 pb-12">
      <Script id={`faq-schema-${slug}`} type="application/ld+json">
        {JSON.stringify(faqSchema)}
      </Script>
      <Script id={`breadcrumb-schema-${slug}`} type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </Script>
      <Script id={`dataset-schema-${slug}`} type="application/ld+json">
        {JSON.stringify(datasetSchema)}
      </Script>

      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <Link href="/compare" className="text-sm text-emerald-700 hover:text-emerald-600 font-medium">
          &larr; Back to compare
        </Link>

        <header className="mt-6 space-y-4">
          <h1 className="text-4xl font-bold text-slate-900">{title}</h1>
          <p className="text-lg text-slate-600">{description}</p>
          <p className="text-slate-500">
            <span className="font-semibold text-slate-700">Why compare these?</span> {whyPopular}
          </p>
        </header>

        {/* Data confidence banner */}
        {confidence.confidenceLabel === "insufficient" && (
          <div className="mt-4 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Limited data available</p>
              <p>This comparison has {confidence.totalSampleSize} total data points. Results may not be representative. More submissions will improve accuracy.</p>
            </div>
          </div>
        )}

        {/* Compensation snapshot */}
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-xl font-bold text-slate-900">{entityA} vs {entityB} compensation snapshot</h2>
          <p className="mt-3 text-slate-700">
            Our database shows a median total compensation of{" "}
            <span className="font-semibold">{formatCurrency(statsA.medianTotalComp)}</span> for {entityA} versus{" "}
            <span className="font-semibold">{formatCurrency(statsB.medianTotalComp)}</span> for {entityB}, based on{" "}
            {statsA.sampleSize + statsB.sampleSize} combined data points.
          </p>
        </section>

        {/* Distribution table */}
        <section className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-xl font-bold text-slate-900">Compensation distribution</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-sm border border-slate-200 rounded-lg overflow-hidden bg-white">
              <thead className="bg-slate-100 text-slate-700">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Metric</th>
                  <th className="px-4 py-3 text-left font-semibold">{entityA}</th>
                  <th className="px-4 py-3 text-left font-semibold">{entityB}</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-slate-200">
                  <td className="px-4 py-3 text-slate-600">P25 total compensation</td>
                  <td className="px-4 py-3 text-slate-900 font-medium">{formatCurrency(profileA.p25TotalComp)}</td>
                  <td className="px-4 py-3 text-slate-900 font-medium">{formatCurrency(profileB.p25TotalComp)}</td>
                </tr>
                <tr className="border-t border-slate-200">
                  <td className="px-4 py-3 text-slate-600">Median total compensation</td>
                  <td className="px-4 py-3 text-slate-900 font-medium">{formatCurrency(statsA.medianTotalComp)}</td>
                  <td className="px-4 py-3 text-slate-900 font-medium">{formatCurrency(statsB.medianTotalComp)}</td>
                </tr>
                <tr className="border-t border-slate-200">
                  <td className="px-4 py-3 text-slate-600">P75 total compensation</td>
                  <td className="px-4 py-3 text-slate-900 font-medium">{formatCurrency(profileA.p75TotalComp)}</td>
                  <td className="px-4 py-3 text-slate-900 font-medium">{formatCurrency(profileB.p75TotalComp)}</td>
                </tr>
                <tr className="border-t border-slate-200">
                  <td className="px-4 py-3 text-slate-600">Observed range</td>
                  <td className="px-4 py-3 text-slate-900 font-medium">{formatCurrency(profileA.minTotalComp)} &ndash; {formatCurrency(profileA.maxTotalComp)}</td>
                  <td className="px-4 py-3 text-slate-900 font-medium">{formatCurrency(profileB.minTotalComp)} &ndash; {formatCurrency(profileB.maxTotalComp)}</td>
                </tr>
                <tr className="border-t border-slate-200">
                  <td className="px-4 py-3 text-slate-600">Sample size</td>
                  <td className="px-4 py-3 text-slate-900 font-medium">{statsA.sampleSize.toLocaleString()}</td>
                  <td className="px-4 py-3 text-slate-900 font-medium">{statsB.sampleSize.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Location coverage */}
        {(profileA.topLocations.length > 0 || profileB.topLocations.length > 0) && (
          <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-xl font-bold text-slate-900">Location coverage</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <article className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4">
                <h3 className="font-semibold text-slate-900">Top markets for {entityA}</h3>
                <ul className="mt-2 space-y-1 text-slate-700 text-sm">
                  {profileA.topLocations.length > 0
                    ? profileA.topLocations.map((row) => (
                        <li key={row.location}>{row.location} ({row.sampleSize} samples)</li>
                      ))
                    : <li>No location data yet.</li>}
                </ul>
              </article>
              <article className="rounded-xl border border-blue-200 bg-blue-50/60 p-4">
                <h3 className="font-semibold text-slate-900">Top markets for {entityB}</h3>
                <ul className="mt-2 space-y-1 text-slate-700 text-sm">
                  {profileB.topLocations.length > 0
                    ? profileB.topLocations.map((row) => (
                        <li key={row.location}>{row.location} ({row.sampleSize} samples)</li>
                      ))
                    : <li>No location data yet.</li>}
                </ul>
              </article>
            </div>
            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
              <p>
                {entityA}&rsquo;s IQR band ({formatCurrency(profileA.p25TotalComp)} &ndash; {formatCurrency(profileA.p75TotalComp)}) versus {entityB}&rsquo;s IQR band ({formatCurrency(profileB.p25TotalComp)} &ndash; {formatCurrency(profileB.p75TotalComp)}) gives you a better estimate of realistic outcomes than headline medians alone.
              </p>
            </div>
          </section>
        )}

        {/* Takeaways */}
        <section className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Key compensation takeaways</h2>
          <ul className="space-y-3">
            {takeaways.map((takeaway) => (
              <li key={takeaway} className="flex items-start gap-2 text-slate-700">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                <span>{takeaway}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* A vs B decision frame */}
        <ComparisonInsights
          entityA={entityA}
          entityB={entityB}
          statsA={statsA}
          statsB={statsB}
          tradeOffSummary={narrative.tradeOffSummary}
          narrative={{
            philosophicalDivergence: narrative.philosophicalDivergence,
            culturalTradeOff: narrative.culturalTradeOff,
            winnerProfileA: narrative.winnerProfileA,
            winnerProfileB: narrative.winnerProfileB,
          }}
        />

        {/* FAQs */}
        <section className="mt-8 grid gap-4">
          <h2 className="text-2xl font-bold text-slate-900">Frequently asked questions</h2>
          {faqs.map((faq) => (
            <article key={faq.question} className="rounded-xl border border-slate-200 p-5">
              <h3 className="font-semibold text-slate-900">{faq.question}</h3>
              <p className="mt-2 text-slate-600">{faq.answer}</p>
            </article>
          ))}
        </section>

        {/* Similar comparisons (internal linking) */}
        {similarSuggestions.length > 0 && (
          <section className="mt-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Related comparisons</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {similarSuggestions.map((s) => {
                const compareSlug = getComparisonSlug(entityA, s.jobTitle);
                return (
                  <Link
                    key={s.slug}
                    href={`/compare/${compareSlug}`}
                    className="block rounded-lg border border-slate-200 p-4 hover:border-emerald-300 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-slate-900">{entityA} vs {s.jobTitle}</span>
                      <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                        Compare
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="mt-10 rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
          <h2 className="text-xl font-bold text-slate-900">Ready to benchmark your own offer?</h2>
          <p className="text-slate-600 mt-2">
            Use AvgPay&apos;s Offer Analyzer to compare your package against verified market salary data.
          </p>
          <Link
            href={ctaHref}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-3 font-semibold text-white hover:bg-emerald-700"
          >
            {ctaLabel}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </section>
      </section>
    </main>
  );
}
