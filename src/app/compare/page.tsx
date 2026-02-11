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
    <main className="min-h-screen bg-slate-50 pt-24 pb-12">
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10 space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700">
            <Scale className="h-4 w-4" />
            High-Demand Offer Matchups
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900">Compare Top Compensation Paths</h1>
          <p className="max-w-3xl mx-auto text-lg text-slate-600">
            Start with the most requested role/company combinations from our existing market interest trends.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {CURATED_COMPARISONS.map((comparison) => (
            <Link
              key={comparison.slug}
              href={`/compare/${comparison.slug}`}
              className="group rounded-2xl border border-slate-200 bg-white p-6 hover:border-emerald-300 hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-emerald-700 mb-3">
                <Sparkles className="h-4 w-4" />
                Curated Comparison
              </div>
              <h2 className="text-2xl font-bold text-slate-900 group-hover:text-emerald-600">{comparison.title}</h2>
              <p className="mt-3 text-slate-600">{comparison.summary}</p>
              <div className="mt-4 text-sm text-slate-500">
                <p><span className="font-semibold text-slate-700">Why demand is high:</span> {comparison.whyPopular}</p>
              </div>
              <div className="mt-4 inline-flex items-center gap-2 text-emerald-700 font-semibold">
                Explore comparison
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>


        <section className="mt-12 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-3">Where to go after a comparison</h2>
          <p className="text-slate-600 mb-6">Use this path to move from exploration to action: benchmark your current pay, model offers, then prepare your negotiation ask.</p>
          <div className="grid gap-4 md:grid-cols-3">
            <Link href="/salaries" className="rounded-xl border border-slate-200 p-4 hover:border-emerald-300 transition-colors">
              <p className="font-semibold text-slate-900">Salary benchmarks by role and location</p>
              <p className="text-sm text-slate-600 mt-1">Validate market baselines before comparing offers.</p>
            </Link>
            <Link href="/tools/compare-offers" className="rounded-xl border border-slate-200 p-4 hover:border-emerald-300 transition-colors">
              <p className="font-semibold text-slate-900">Compare Offers Tool</p>
              <p className="text-sm text-slate-600 mt-1">Quantify year-one and long-term compensation trade-offs.</p>
            </Link>
            <Link href="/guides/negotiation" className="rounded-xl border border-slate-200 p-4 hover:border-emerald-300 transition-colors">
              <p className="font-semibold text-slate-900">Negotiation playbook</p>
              <p className="text-sm text-slate-600 mt-1">Convert insights into a stronger counteroffer strategy.</p>
            </Link>
          </div>
        </section>
      </section>
    </main>
  );
}
