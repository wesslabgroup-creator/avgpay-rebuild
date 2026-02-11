import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Scale, Sparkles } from "lucide-react";
import { CURATED_COMPARISONS } from "@/app/compare/data/curated-comparisons";

export const metadata: Metadata = {
  title: "Salary Comparisons | AvgPay",
  description:
    "Curated, high-demand company and role compensation comparisons with actionable negotiation takeaways.",
};

export default function CompareIndexPage() {
  return (
    <main className="min-h-screen bg-surface-subtle pt-24 pb-12">
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10 space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary-subtle bg-primary-subtle px-4 py-2 text-sm font-medium text-primary-hover">
            <Scale className="h-4 w-4" />
            High-Demand Offer Matchups
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-text-primary">Compare Top Compensation Paths</h1>
          <p className="max-w-3xl mx-auto text-lg text-text-secondary">
            Start with the most requested role/company combinations from our existing market interest trends.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {CURATED_COMPARISONS.map((comparison) => (
            <Link
              key={comparison.slug}
              href={`/compare/${comparison.slug}`}
              className="group rounded-2xl border border-border bg-surface p-6 hover:border-primary hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-primary-hover mb-3">
                <Sparkles className="h-4 w-4" />
                Curated Comparison
              </div>
              <h2 className="text-2xl font-bold text-text-primary group-hover:text-primary">{comparison.title}</h2>
              <p className="mt-3 text-text-secondary">{comparison.summary}</p>
              <div className="mt-4 text-sm text-text-muted">
                <p><span className="font-semibold text-text-secondary">Why demand is high:</span> {comparison.whyPopular}</p>
              </div>
              <div className="mt-4 inline-flex items-center gap-2 text-primary-hover font-semibold">
                Explore comparison
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
