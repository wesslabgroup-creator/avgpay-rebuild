import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table";
import { ArticleSchema } from "@/components/schema-markup";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Software Engineer Salary Guide 2026 | AvgPay",
  description: "From L3 to Staff+. Compensation breakdowns at Google, Meta, Amazon, and startups. Plus leveling guides.",
  openGraph: {
    type: "article",
    publishedTime: "2026-02-05",
  },
};

export default function SWEGuidePage() {
  const levelData = {
    headers: ["Level", "Base Salary", "Equity (Annual)", "Bonus", "Total Comp"],
    rows: [
      ["Junior (L3)", 140000, 25000, 15000, 180000],
      ["Mid-Level (L4)", 175000, 60000, 25000, 260000],
      ["Senior (L5)", 210000, 120000, 40000, 370000],
      ["Staff (L6)", 260000, 220000, 70000, 550000],
      ["Principal (L7+)", 320000, 400000, 100000, 820000],
    ],
  };

  const locationData = {
    headers: ["Location", "Median Total Comp", "Premium/Discount"],
    rows: [
      ["San Francisco Bay Area", 280000, "+30%"],
      ["New York", 260000, "+22%"],
      ["Seattle", 255000, "+20%"],
      ["Austin", 210000, "+2%"],
      ["Remote (US)", 220000, "+6%"],
    ],
  };

  return (
    <main className="min-h-screen bg-slate-950">
      <ArticleSchema headline="Software Engineer Salary Guide 2026" datePublished="2026-02-05" authorName="AvgPay Team" />
      
      <article className="max-w-3xl mx-auto px-6 py-12 prose prose-invert prose-lg">
        <div className="mb-8 not-prose">
          <span className="text-indigo-400 text-sm font-medium">February 2026</span>
          <h1 className="text-4xl font-bold text-slate-100 mt-2">Software Engineer Salary Guide 2026</h1>
          <p className="text-xl text-slate-400 mt-4">
            A deep dive into Software Engineering compensation across the tech industry. 
            Based on 8,000+ verified data points from BLS, H-1B filings, and public pay transparency data.
          </p>
        </div>

        <div className="not-prose my-8 p-6 bg-indigo-900/20 border border-indigo-500/30 rounded-lg">
          <h2 className="text-lg font-semibold text-indigo-300 mb-2">Executive Summary</h2>
          <p className="text-slate-300">
            Software Engineers command the highest median compensation in tech, with a median total comp of $260,000 for mid-level roles in major hubs. 
            AI/ML specializations are seeing a 20-30% premium over generalist roles.
          </p>
        </div>

        <h2>Compensation by Level</h2>
        <div className="not-prose my-6">
          <DataTable headers={levelData.headers} rows={levelData.rows} />
        </div>

        <h2>Compensation by Location</h2>
        <p>While remote work remains popular, top-tier compensation is still concentrated in major tech hubs:</p>
        
        <div className="not-prose my-6">
          <DataTable headers={locationData.headers} rows={locationData.rows} />
        </div>

        <h2>Top Paying Companies (Staff L6+)</h2>
        <p>At the Staff level, equity packages significantly diverge:</p>
        
        <ol>
          <li><strong>OpenAI / Anthropic:</strong> $900,000+ total comp (liquid equity varies)</li>
          <li><strong>Netflix:</strong> $750,000 (all cash option available)</li>
          <li><strong>Meta:</strong> $700,000</li>
          <li><strong>Google:</strong> $650,000</li>
          <li><strong>Databricks:</strong> $620,000</li>
        </ol>

        <h2>Negotiation Tips for Engineers</h2>
        
        <h3>1. Multiple Offers are Key</h3>
        <p>
          Engineers with competing offers see an average initial offer increase of 22%. 
          Companies have specific bands, but competing offers unlock &quot;out-of-band&quot; approvals.
        </p>

        <h3>2. Understand the Equity Grant</h3>
        <p>
          Ask about the 409A valuation (for private companies) or the grant price (public). 
          Understand the vesting schedule—Amazon is back-weighted (5/15/40/40), while Google is front-weighted (33/33/22/12) or flat (25% annually).
        </p>

        <h3>3. Sign-on Bonuses</h3>
        <p>
          Sign-on bonuses, often ranging from $20k to $100k+, are the easiest lever for recruiters 
          to pull to close a candidate without disrupting salary bands. 
          Always ask for a sign-on if the base salary is inflexible.
        </p>

        <h2>Future Outlook</h2>
        <p>
          Demand for specialized roles (ML Infra, Kernel, Distributed Systems) is outpacing general 
          full-stack web development. Engineers investing in lower-level systems knowledge or 
          model deployment pipelines are seeing faster career velocity.
        </p>

        <div className="not-prose my-8 p-6 bg-slate-800/50 border border-slate-700 rounded-lg text-center">
          <h3 className="text-lg font-semibold text-slate-200 mb-2">Check your market rate</h3>
          <p className="text-slate-400 mb-4">
            See exactly where your offer lands against verified benchmarks.
          </p>
          <Link href="/#analyzer">
            <Button size="lg" className="bg-gradient-to-r from-indigo-600 to-violet-600">
              Analyze Your Offer
            </Button>
          </Link>
        </div>

        <hr className="border-slate-800" />
        
        <p className="text-slate-400 text-sm not-prose">
          Last updated: February 2026. Data sourced from BLS, H-1B filings, and 
          pay transparency laws.
        </p>
      </article>
    </main>
  );
}
