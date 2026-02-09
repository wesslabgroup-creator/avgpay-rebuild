import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArticleSchema } from "@/components/schema-markup";

export const metadata: Metadata = {
  title: "Startup vs Big Tech Compensation | AvgPay",
  description: "When does startup equity beat FAANG total comp? A probabilistic analysis with real data.",
  openGraph: {
    type: "article",
    publishedTime: "2026-02-07",
  },
};

export default function StartupVsBigTechGuidePage() {
  return (
    <main className="min-h-screen bg-slate-950">
      <Navigation />
      <ArticleSchema headline="Startup vs Big Tech Compensation" datePublished="2026-02-07" authorName="AvgPay Team" />
      
      <article className="max-w-3xl mx-auto px-6 py-12 prose prose-invert prose-lg">
        <div className="mb-8 not-prose">
          <span className="text-indigo-400 text-sm font-medium">February 2026</span>
          <h1 className="text-4xl font-bold text-slate-100 mt-2">Startup vs Big Tech Compensation</h1>
          <p className="text-xl text-slate-400 mt-4">
            When does startup equity beat FAANG total comp? A probabilistic analysis with real data.
          </p>
        </div>

        <div className="not-prose my-8 p-6 bg-indigo-900/20 border border-indigo-500/30 rounded-lg">
          <h2 className="text-lg font-semibold text-indigo-300 mb-2">Coming Soon</h2>
          <p className="text-slate-300">
            This analysis comparing compensation between startups and Big Tech firms is currently under development. We&apos;re crunching the numbers on equity, salary, and cash bonuses to see when high-growth startups truly outperform established tech giants. Stay tuned for the results!
          </p>
        </div>

        <div className="text-center not-prose mt-12">
          <p className="text-slate-400 mb-4">
            In the meantime, analyze your current offer to see how it stacks up.
          </p>
          <Link href="/#analyzer">
            <Button size="lg" className="bg-gradient-to-r from-indigo-600 to-violet-600">
              Analyze Your Offer
            </Button>
          </Link>
        </div>
      </article>
    </main>
  );
}
