import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArticleSchema } from "@/components/schema-markup";

export const metadata: Metadata = {
  title: "Understanding Tech Equity | AvgPay",
  description: "RSUs vs options, vesting schedules, 409A valuations, and tax implications. Everything you need to evaluate equity offers.",
  openGraph: {
    type: "article",
    publishedTime: "2026-02-07",
  },
};

export default function EquityGuidePage() {
  return (
    <main className="min-h-screen bg-white">
      <ArticleSchema headline="Understanding Tech Equity" datePublished="2026-02-07" authorName="AvgPay Team" />
      
      <article className="max-w-3xl mx-auto px-6 py-12 prose prose-invert prose-lg">
        <div className="mb-8 not-prose">
          <span className="text-indigo-400 text-sm font-medium">February 2026</span>
          <h1 className="text-4xl font-bold text-slate-900 mt-2">Understanding Tech Equity</h1>
          <p className="text-xl text-slate-600 mt-4">
            RSUs vs options, vesting schedules, 409A valuations, and tax implications. Everything you need to evaluate equity offers.
          </p>
        </div>

        <div className="not-prose my-8 p-6 bg-indigo-900/20 border border-indigo-500/30 rounded-lg">
          <h2 className="text-lg font-semibold text-indigo-300 mb-2">Coming Soon</h2>
          <p className="text-slate-300">
            This comprehensive guide to tech equity is currently under development. We&apos;re breaking down complex topics like RSUs, stock options, vesting, 409A valuations, and tax implications to help you make informed decisions about your compensation. Check back soon!
          </p>
        </div>

        <div className="text-center not-prose mt-12">
          <p className="text-slate-600 mb-4">
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
