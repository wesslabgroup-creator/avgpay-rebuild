import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Scale, Building2, Briefcase } from "lucide-react";
import { getPopularComparisons } from "@/lib/comparisonEngine";
import { CompareSearchForm } from "@/components/compare-search-form";

export const revalidate = 3600; // ISR: revalidate every hour

export const metadata: Metadata = {
  title: "Compare Salaries | AvgPay",
  description:
    "Compare compensation between any two jobs, companies, or cities. Dynamic salary comparisons powered by real market data.",
};

export default async function CompareIndexPage() {
  let popularComparisons: { entityA: string; entityB: string; slug: string; type: "company" | "job"; totalSampleSize: number }[] = [];
  try {
    popularComparisons = await getPopularComparisons(12);
  } catch {
    // Fallback to empty
  }

  return (
    <main className="min-h-screen bg-slate-50 pt-24 pb-12">
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Hero */}
        <div className="text-center mb-10 space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700">
            <Scale className="h-4 w-4" />
            Salary Comparison Tool
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900">
            Compare Any Two Salaries
          </h1>
          <p className="max-w-3xl mx-auto text-lg text-slate-600">
            Select two jobs, companies, or cities to see a side-by-side compensation comparison powered by real salary data.
          </p>
        </div>

        {/* Search Form */}
        <CompareSearchForm />

        {/* Popular Comparisons */}
        {popularComparisons.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Popular comparisons</h2>
            <p className="text-slate-600 mb-6">
              Generated dynamically from our most data-rich entities.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {popularComparisons.map((comparison) => (
                <Link
                  key={comparison.slug}
                  href={`/compare/${comparison.slug}`}
                  className="group rounded-xl border border-slate-200 bg-white p-5 hover:border-emerald-300 hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">
                    {comparison.type === "company" ? (
                      <Building2 className="h-3.5 w-3.5" />
                    ) : (
                      <Briefcase className="h-3.5 w-3.5" />
                    )}
                    {comparison.type} comparison
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-600">
                    {comparison.entityA} vs {comparison.entityB}
                  </h3>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs text-slate-500">
                      {comparison.totalSampleSize.toLocaleString()} data points
                    </span>
                    <ArrowRight className="h-4 w-4 text-emerald-600 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
