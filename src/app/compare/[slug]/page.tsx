import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { ComparisonInsights } from "@/components/comparison-insights";
import { supabaseAdmin } from "@/lib/supabaseClient";
import { generateComparisonAnalysis } from "@/lib/comparisonEngine";
import {
  CURATED_COMPARISONS,
  getComparisonBySlug,
} from "@/app/compare/data/curated-comparisons";


interface RuntimeComparison {
  slug: string;
  title: string;
  description: string;
  whyPopular: string;
  companies: [string, string];
  roles: string[];
  takeaways: string[];
  faqs: Array<{ question: string; answer: string }>;
  cta: { label: string; href: string };
}

function toDisplayEntity(raw: string) {
  return raw
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function parseDynamicComparison(slug: string): RuntimeComparison | null {
  const [left, right] = slug.split('-vs-');
  if (!left || !right) return null;

  const entityA = toDisplayEntity(left);
  const entityB = toDisplayEntity(right);

  return {
    slug,
    title: `${entityA} vs ${entityB}`,
    description: `Data-backed compensation and market narrative comparison for ${entityA} and ${entityB}.`,
    whyPopular: 'This page is generated on-demand when users compare two entities with overlapping salary bands.',
    companies: [entityA, entityB],
    roles: ['Software Engineer'],
    takeaways: [
      `Compare pay mix, compensation volatility, and expected promotion cadence between ${entityA} and ${entityB}.`,
      'Use median and distribution deltas to benchmark both short-term cash flow and long-term upside.',
      'Treat candidate-market fit as a first-order variable when two packages are close on headline compensation.',
    ],
    faqs: [
      {
        question: `How should I compare ${entityA} vs ${entityB} beyond salary?`,
        answer: 'Evaluate base salary, variable compensation mix, expected vesting horizon, and operating culture trade-offs together instead of isolating one metric.',
      },
      {
        question: 'Why do median compensation numbers differ from my offer?',
        answer: 'Offer outcomes vary by level, team, market, and timing. Use medians as a baseline and anchor negotiations with your scope and leveling evidence.',
      },
    ],
    cta: {
      label: 'Analyze my offer',
      href: '/tools/offer-analyzer',
    },
  };
}

interface ComparisonPageProps {
  params: Promise<{ slug: string }>;
}

interface SalaryRecord {
  totalComp: number;
  baseSalary: number | null;
  Location?: {
    city: string;
    state?: string | null;
  } | null;
}

interface ComparisonStats {
  medianTotalComp: number;
  medianBaseSalary: number;
  medianNonBaseComp: number;
  sampleSize: number;
}

interface ComparisonNarrative {
  philosophicalDivergence: string;
  culturalTradeOff: string;
  winnerProfileA: string;
  winnerProfileB: string;
  tradeOffSummary: string;
}

interface EntityLocationInsight {
  location: string;
  sampleSize: number;
}

interface EntityCompensationProfile {
  stats: ComparisonStats;
  p25TotalComp: number;
  p75TotalComp: number;
  minTotalComp: number;
  maxTotalComp: number;
  topLocations: EntityLocationInsight[];
}

function percentile(values: number[], p: number) {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const index = Math.floor((p / 100) * (sorted.length - 1));
  return sorted[index] ?? 0;
}

function median(values: number[]) {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? Math.round((sorted[mid - 1] + sorted[mid]) / 2) : sorted[mid];
}

function formatCurrency(value: number) {
  return `$${Math.round(value).toLocaleString()}`;
}

function getDefaultNarrative(entityA: string, entityB: string): ComparisonNarrative {
  return {
    philosophicalDivergence:
      `${entityA} and ${entityB} typically optimize compensation in different ways: one skews toward stable annual cash while the other leans into variable upside and performance-linked growth.`,
    culturalTradeOff:
      "The core trade-off is execution pace versus predictability. Team environment fit often compounds over multiple promotion cycles and can outweigh small first-year cash deltas.",
    winnerProfileA:
      `${entityA}-fit: candidates who prioritize this package usually value this company's operating model, compensation cadence, and long-term growth path.`,
    winnerProfileB:
      `${entityB}-fit: candidates who choose this package usually prefer the alternative risk/reward profile and day-to-day expectations.`,
    tradeOffSummary:
      "The better offer depends on whether you optimize for predictable annual cash flow or for potentially higher upside through equity, bonus, and long-term vesting outcomes.",
  };
}

function getTopLocations(records: SalaryRecord[]) {
  const locationCounts = new Map<string, number>();

  for (const record of records) {
    if (!record.Location?.city) continue;
    const label = record.Location.state ? `${record.Location.city}, ${record.Location.state}` : record.Location.city;
    locationCounts.set(label, (locationCounts.get(label) ?? 0) + 1);
  }

  return Array.from(locationCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([location, sampleSize]) => ({ location, sampleSize }));
}

async function getCompensationProfile(company: string, role: string): Promise<EntityCompensationProfile> {
  const { data, error } = await supabaseAdmin
    .from("Salary")
    .select(`
      totalComp,
      baseSalary,
      Company!inner(name),
      Role!inner(title),
      Location(city, state)
    `)
    .eq("Company.name", company)
    .eq("Role.title", role)
    .not("totalComp", "is", null)
    .limit(1000);

  if (error || !data?.length) {
    return {
      stats: {
        medianTotalComp: 0,
        medianBaseSalary: 0,
        medianNonBaseComp: 0,
        sampleSize: 0,
      },
      p25TotalComp: 0,
      p75TotalComp: 0,
      minTotalComp: 0,
      maxTotalComp: 0,
      topLocations: [],
    };
  }

  const records = data as unknown as SalaryRecord[];

  const totalCompValues = records
    .map((record) => record.totalComp)
    .filter((value): value is number => typeof value === "number");
  const baseSalaryValues = records
    .map((record) => record.baseSalary ?? 0)
    .filter((value): value is number => typeof value === "number");

  const medianTotalComp = median(totalCompValues);
  const medianBaseSalary = median(baseSalaryValues);
  const sortedTotals = [...totalCompValues].sort((a, b) => a - b);

  return {
    stats: {
      medianTotalComp,
      medianBaseSalary,
      medianNonBaseComp: Math.max(medianTotalComp - medianBaseSalary, 0),
      sampleSize: records.length,
    },
    p25TotalComp: percentile(sortedTotals, 25),
    p75TotalComp: percentile(sortedTotals, 75),
    minTotalComp: sortedTotals[0] ?? 0,
    maxTotalComp: sortedTotals[sortedTotals.length - 1] ?? 0,
    topLocations: getTopLocations(records),
  };
}

export async function generateStaticParams() {
  return CURATED_COMPARISONS.map((comparison) => ({ slug: comparison.slug }));
}

export async function generateMetadata({ params }: ComparisonPageProps): Promise<Metadata> {
  const { slug } = await params;
  const comparison = getComparisonBySlug(slug) ?? parseDynamicComparison(slug);

  if (!comparison) {
    return {
      title: "Comparison Not Found | AvgPay",
    };
  }

  return {
    title: `${comparison.title} Compensation Comparison | AvgPay`,
    description: comparison.description,
    alternates: {
      canonical: `/compare/${comparison.slug}`,
    },
    openGraph: {
      title: `${comparison.title} Compensation Comparison | AvgPay`,
      description: comparison.description,
      url: `https://avgpay.com/compare/${comparison.slug}`,
      siteName: "AvgPay",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${comparison.title} Compensation Comparison | AvgPay`,
      description: comparison.description,
    },
  };
}

export default async function ComparisonPage({ params }: ComparisonPageProps) {
  const { slug } = await params;
  const comparison = getComparisonBySlug(slug) ?? parseDynamicComparison(slug);

  if (!comparison) {
    notFound();
  }

  const [entityA, entityB] = comparison.companies;
  const role = comparison.roles[0] ?? "Software Engineer";

  const defaults = getDefaultNarrative(entityA, entityB);

  const [profileA, profileB, generated] = await Promise.all([
    getCompensationProfile(entityA, role),
    getCompensationProfile(entityB, role),
    generateComparisonAnalysis(entityA, entityB, role, comparison.slug),
  ]);

  const narrative: ComparisonNarrative = {
    philosophicalDivergence: generated.philosophical_divergence || defaults.philosophicalDivergence,
    culturalTradeOff: generated.cultural_tradeoff || defaults.culturalTradeOff,
    winnerProfileA: `${entityA}-fit: ${generated.winner_profile || defaults.winnerProfileA}`,
    winnerProfileB: `${entityB}-fit: ${generated.winner_profile || defaults.winnerProfileB}`,
    tradeOffSummary: generated.cultural_tradeoff || defaults.tradeOffSummary,
  };

  const statsA = profileA.stats;
  const statsB = profileB.stats;

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: comparison.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://avgpay.com" },
      { "@type": "ListItem", position: 2, name: "Comparisons", item: "https://avgpay.com/compare" },
      {
        "@type": "ListItem",
        position: 3,
        name: comparison.title,
        item: `https://avgpay.com/compare/${comparison.slug}`,
      },
    ],
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${comparison.title} Compensation Comparison`,
    description: comparison.description,
    mainEntityOfPage: `https://avgpay.com/compare/${comparison.slug}`,
    about: [entityA, entityB, role],
    author: {
      "@type": "Organization",
      name: "AvgPay",
    },
  };

  const datasetSchema = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: `${comparison.title} Compensation Dataset`,
    description: `Database-backed salary distribution snapshot for ${role} offers across ${entityA} and ${entityB}.`,
    creator: {
      "@type": "Organization",
      name: "AvgPay",
    },
    variableMeasured: [
      "totalComp",
      "baseSalary",
      "medianTotalComp",
      "p25TotalComp",
      "p75TotalComp",
      "sampleSize",
    ],
  };

  return (
    <main className="min-h-screen bg-white pt-24 pb-12">
      <Script id={`faq-schema-${comparison.slug}`} type="application/ld+json">
        {JSON.stringify(faqSchema)}
      </Script>
      <Script id={`breadcrumb-schema-${comparison.slug}`} type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </Script>
      <Script id={`article-schema-${comparison.slug}`} type="application/ld+json">
        {JSON.stringify(articleSchema)}
      </Script>
      <Script id={`dataset-schema-${comparison.slug}`} type="application/ld+json">
        {JSON.stringify(datasetSchema)}
      </Script>

      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <Link href="/compare" className="text-sm text-emerald-700 hover:text-emerald-600 font-medium">
          ← Back to all comparisons
        </Link>

        <header className="mt-6 space-y-4">
          <h1 className="text-4xl font-bold text-slate-900">{comparison.title}</h1>
          <p className="text-lg text-slate-600">{comparison.description}</p>
          <p className="text-slate-500">
            <span className="font-semibold text-slate-700">Why this is in our curated set:</span> {comparison.whyPopular}
          </p>
        </header>

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-xl font-bold text-slate-900">{entityA} vs {entityB} compensation data snapshot</h2>
          <p className="mt-3 text-slate-700">
            For {role} candidates, our database currently shows a median total compensation of <span className="font-semibold">{formatCurrency(statsA.medianTotalComp)}</span> at {entityA} versus <span className="font-semibold">{formatCurrency(statsB.medianTotalComp)}</span> at {entityB}. We also compare distribution width, location mix, and non-base compensation so this page is useful beyond a single headline median.
          </p>
        </section>

        <section className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-xl font-bold text-slate-900">Database-backed compensation distribution</h2>
          <p className="mt-2 text-slate-600">
            These rows are derived directly from reported salaries in our database for {role}, making the comparison more indexable and more useful for candidates searching for specific compensation bands.
          </p>
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
                  <td className="px-4 py-3 text-slate-900 font-medium">{formatCurrency(profileA.minTotalComp)} - {formatCurrency(profileA.maxTotalComp)}</td>
                  <td className="px-4 py-3 text-slate-900 font-medium">{formatCurrency(profileB.minTotalComp)} - {formatCurrency(profileB.maxTotalComp)}</td>
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

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-xl font-bold text-slate-900">Location coverage and candidate implications</h2>
          <p className="mt-2 text-slate-600">
            Compensation outcomes vary by market. Showing where submissions cluster helps candidates interpret whether a package is being benchmarked against high-cost hubs or broader national data.
          </p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <article className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4">
              <h3 className="font-semibold text-slate-900">Top submitted markets for {entityA}</h3>
              <ul className="mt-2 space-y-1 text-slate-700 text-sm">
                {profileA.topLocations.length > 0 ? profileA.topLocations.map((row) => (
                  <li key={`${entityA}-${row.location}`}>{row.location} ({row.sampleSize} samples)</li>
                )) : <li>No location sample data yet.</li>}
              </ul>
            </article>
            <article className="rounded-xl border border-blue-200 bg-blue-50/60 p-4">
              <h3 className="font-semibold text-slate-900">Top submitted markets for {entityB}</h3>
              <ul className="mt-2 space-y-1 text-slate-700 text-sm">
                {profileB.topLocations.length > 0 ? profileB.topLocations.map((row) => (
                  <li key={`${entityB}-${row.location}`}>{row.location} ({row.sampleSize} samples)</li>
                )) : <li>No location sample data yet.</li>}
              </ul>
            </article>
          </div>
          <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
            <p>
              Candidate implication: {entityA}&rsquo;s IQR band ({formatCurrency(profileA.p25TotalComp)} - {formatCurrency(profileA.p75TotalComp)}) versus {entityB}&rsquo;s IQR band ({formatCurrency(profileB.p25TotalComp)} - {formatCurrency(profileB.p75TotalComp)}) gives you a better estimate of realistic outcomes than headline medians alone.
            </p>
          </div>
        </section>

        <section className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Key compensation takeaways</h2>
          <ul className="space-y-3">
            {comparison.takeaways.map((takeaway) => (
              <li key={takeaway} className="flex items-start gap-2 text-slate-700">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                <span>{takeaway}</span>
              </li>
            ))}
          </ul>
        </section>

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

        <section className="mt-8 grid gap-4">
          <h2 className="text-2xl font-bold text-slate-900">Frequently asked questions</h2>
          {comparison.faqs.map((faq) => (
            <article key={faq.question} className="rounded-xl border border-slate-200 p-5">
              <h3 className="font-semibold text-slate-900">{faq.question}</h3>
              <p className="mt-2 text-slate-600">{faq.answer}</p>
            </article>
          ))}
        </section>

        <section className="mt-10 rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
          <h2 className="text-xl font-bold text-slate-900">Ready to benchmark your own offer?</h2>
          <p className="text-slate-600 mt-2">
            Use AvgPay&apos;s Offer Analyzer to compare your package against verified market salary data.
          </p>
          <Link
            href={comparison.cta.href}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-3 font-semibold text-white hover:bg-emerald-700"
          >
            {comparison.cta.label}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </section>
      </section>
    </main>
  );
}
