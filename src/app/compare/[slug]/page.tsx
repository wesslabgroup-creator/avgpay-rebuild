import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import {
  CURATED_COMPARISONS,
  getComparisonBySlug,
} from "@/app/compare/data/curated-comparisons";
import {
  getOrGenerateComparisonAnalysis,
  resolveComparisonEntitiesFromSlug,
  resolveComparisonTitle,
} from "@/lib/comparisons";

interface ComparisonPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return CURATED_COMPARISONS.map((comparison) => ({ slug: comparison.slug }));
}

export async function generateMetadata({ params }: ComparisonPageProps): Promise<Metadata> {
  const { slug } = await params;
  const comparison = getComparisonBySlug(slug);

  const dynamicTitle = comparison ? comparison.title : await resolveComparisonTitle(slug);

  if (!comparison && dynamicTitle === "Comparison Not Found") {
    return {
      title: "Comparison Not Found | AvgPay",
    };
  }

  return {
    title: `${dynamicTitle} Compensation Comparison | AvgPay`,
    description: comparison?.description
      ?? `Compensation comparison and negotiation insights for ${dynamicTitle}.`,
    alternates: {
      canonical: `/compare/${slug}`,
    },
  };
}

export default async function ComparisonPage({ params }: ComparisonPageProps) {
  const { slug } = await params;
  const curatedComparison = getComparisonBySlug(slug);
  const resolvedEntities = await resolveComparisonEntitiesFromSlug(slug);

  if (!resolvedEntities) {
    notFound();
  }

  const comparisonAnalysis = await getOrGenerateComparisonAnalysis(
    resolvedEntities.entityA,
    resolvedEntities.entityB
  );

  const title = curatedComparison?.title
    ?? (resolvedEntities.role
      ? `${resolvedEntities.role.name}: ${resolvedEntities.entityA.name} vs ${resolvedEntities.entityB.name}`
      : `${resolvedEntities.entityA.name} vs ${resolvedEntities.entityB.name}`);

  const fallbackTakeaways = [
    comparisonAnalysis.insights.summary,
    comparisonAnalysis.insights.compensation_delta,
    comparisonAnalysis.insights.risk_reward_profile,
  ].filter(Boolean);

  const fallbackFaqs = [
    {
      question: `How should I evaluate ${resolvedEntities.entityA.name} vs ${resolvedEntities.entityB.name}?`,
      answer: comparisonAnalysis.insights.summary,
    },
    {
      question: "What is the best negotiation angle in this comparison?",
      answer: comparisonAnalysis.insights.negotiation_angle,
    },
  ].filter((faq) => faq.answer);

  const description = curatedComparison?.description
    ?? `Compare compensation expectations for ${title} using database-backed salary snapshots and generated insights.`;

  const whyPopular = curatedComparison?.whyPopular
    ?? `This page is generated from salary records for ${resolvedEntities.entityA.name} and ${resolvedEntities.entityB.name}.`;

  const takeaways = curatedComparison?.takeaways.length
    ? curatedComparison.takeaways
    : fallbackTakeaways;

  const faqs = curatedComparison?.faqs.length
    ? curatedComparison.faqs
    : fallbackFaqs;

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
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
        name: title,
        item: `https://avgpay.com/compare/${slug}`,
      },
    ],
  };

  return (
    <main className="min-h-screen bg-white pt-24 pb-12">
      <Script id={`faq-schema-${slug}`} type="application/ld+json">
        {JSON.stringify(faqSchema)}
      </Script>
      <Script id={`breadcrumb-schema-${slug}`} type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </Script>

      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <Link href="/compare" className="text-sm text-emerald-700 hover:text-emerald-600 font-medium">
          ← Back to all comparisons
        </Link>

        <header className="mt-6 space-y-4">
          <h1 className="text-4xl font-bold text-slate-900">{title}</h1>
          <p className="text-lg text-slate-600">{description}</p>
          <p className="text-slate-500">
            <span className="font-semibold text-slate-700">Why this comparison exists:</span> {whyPopular}
          </p>
        </header>

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

        <section className="mt-8 grid gap-4">
          <h2 className="text-2xl font-bold text-slate-900">Frequently asked questions</h2>
          {faqs.map((faq) => (
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
            href={curatedComparison?.cta.href ?? "/analyze-offer"}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-3 font-semibold text-white hover:bg-emerald-700"
          >
            {curatedComparison?.cta.label ?? "Analyze my offer"}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </section>
      </section>
    </main>
  );
}
