import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import {
  CURATED_COMPARISONS,
  getComparisonBySlug,
} from "@/app/compare/data/curated-comparisons";

interface ComparisonPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return CURATED_COMPARISONS.map((comparison) => ({ slug: comparison.slug }));
}

export async function generateMetadata({ params }: ComparisonPageProps): Promise<Metadata> {
  const { slug } = await params;
  const comparison = getComparisonBySlug(slug);

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
  };
}

export default async function ComparisonPage({ params }: ComparisonPageProps) {
  const { slug } = await params;
  const comparison = getComparisonBySlug(slug);

  if (!comparison) {
    notFound();
  }

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

  return (
    <main className="min-h-screen bg-surface pt-24 pb-12">
      <Script id={`faq-schema-${comparison.slug}`} type="application/ld+json">
        {JSON.stringify(faqSchema)}
      </Script>
      <Script id={`breadcrumb-schema-${comparison.slug}`} type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </Script>

      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <Link href="/compare" className="text-sm text-primary-hover hover:text-primary font-medium">
          ← Back to all comparisons
        </Link>

        <header className="mt-6 space-y-4">
          <h1 className="text-4xl font-bold text-text-primary">{comparison.title}</h1>
          <p className="text-lg text-text-secondary">{comparison.description}</p>
          <p className="text-text-muted">
            <span className="font-semibold text-text-secondary">Why this is in our curated set:</span> {comparison.whyPopular}
          </p>
        </header>

        <section className="mt-10 rounded-2xl border border-border bg-surface-subtle p-6">
          <h2 className="text-xl font-bold text-text-primary mb-4">Key compensation takeaways</h2>
          <ul className="space-y-3">
            {comparison.takeaways.map((takeaway) => (
              <li key={takeaway} className="flex items-start gap-2 text-text-secondary">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span>{takeaway}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-8 grid gap-4">
          <h2 className="text-2xl font-bold text-text-primary">Frequently asked questions</h2>
          {comparison.faqs.map((faq) => (
            <article key={faq.question} className="rounded-xl border border-border p-5">
              <h3 className="font-semibold text-text-primary">{faq.question}</h3>
              <p className="mt-2 text-text-secondary">{faq.answer}</p>
            </article>
          ))}
        </section>

        <section className="mt-10 rounded-2xl border border-primary-subtle bg-primary-subtle p-6">
          <h2 className="text-xl font-bold text-text-primary">Ready to benchmark your own offer?</h2>
          <p className="text-text-secondary mt-2">
            Use AvgPay&apos;s Offer Analyzer to compare your package against verified market salary data.
          </p>
          <Link
            href={comparison.cta.href}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 font-semibold text-text-inverse hover:bg-primary-hover"
          >
            {comparison.cta.label}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </section>
      </section>
    </main>
  );
}
