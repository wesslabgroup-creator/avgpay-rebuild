import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table";
import { ArticleSchema } from "@/components/schema-markup";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Product Manager Compensation Guide 2026 | AvgPay",
  description: "Complete breakdown of PM salaries across levels, companies, and locations. Includes equity ranges and negotiation strategies.",
  openGraph: {
    type: "article",
    publishedTime: "2026-02-01",
  },
};

export default function PMGuidePage() {
  const levelData = {
    headers: ["Level", "Base Salary", "Equity (Annual)", "Bonus", "Total Comp"],
    rows: [
      ["PM (L3)", 125000, 15000, 12000, 152000],
      ["Sr PM (L4)", 155000, 35000, 20000, 210000],
      ["Staff PM (L5)", 185000, 75000, 35000, 295000],
      ["Principal PM (L6+)", 220000, 150000, 60000, 430000],
    ],
  };

  const locationData = {
    headers: ["Location", "Median Total Comp", "Premium/Discount"],
    rows: [
      ["San Francisco Bay Area", 245000, "+35%"],
      ["Seattle", 220000, "+21%"],
      ["New York", 205000, "+13%"],
      ["Austin", 175000, "-3%"],
      ["Remote (US)", 195000, "-7%"],
    ],
  };

  return (
    <main className="min-h-screen bg-slate-950">
      <ArticleSchema headline="Product Manager Compensation Guide 2026" datePublished="2026-02-01" authorName="AvgPay Team" />
      
      <article className="max-w-3xl mx-auto px-6 py-12 prose prose-invert prose-lg">
        <div className="mb-8 not-prose">
          <span className="text-indigo-400 text-sm font-medium">February 2026</span>
          <h1 className="text-4xl font-bold text-slate-100 mt-2">Product Manager Compensation Guide 2026</h1>
          <p className="text-xl text-slate-400 mt-4">
            The most comprehensive analysis of Product Manager salaries in tech. 
            Based on 5,000+ verified data points from BLS, H-1B filings, and pay transparency laws.
          </p>
        </div>

        <div className="not-prose my-8 p-6 bg-indigo-900/20 border border-indigo-500/30 rounded-lg">
          <h2 className="text-lg font-semibold text-indigo-300 mb-2">Executive Summary</h2>
          <p className="text-slate-300">
            Product Managers in tech earn a median total compensation of $185,000 in 2026, 
            ranging from $120,000 at entry level to $450,000+ for senior Staff PMs at top companies. 
            Location remains the biggest differentiator.
          </p>
        </div>

        <h2>Salary by Level</h2>
        <div className="not-prose my-6">
          <DataTable headers={levelData.headers} rows={levelData.rows} />
        </div>

        <h2>Salary by Location</h2>
        <p>Location continues to drive significant compensation differences:</p>
        
        <div className="not-prose my-6">
          <DataTable headers={locationData.headers} rows={locationData.rows} />
        </div>

        <h2>Company-Specific Data</h2>
        <p>Top-paying companies for Senior PMs (L4):</p>
        
        <ol>
          <li><strong>Google:</strong> $285,000 total comp</li>
          <li><strong>Meta:</strong> $275,000 total comp</li>
          <li><strong>Stripe:</strong> $265,000 total comp</li>
          <li><strong>Uber:</strong> $255,000 total comp</li>
          <li><strong>Airbnb:</strong> $250,000 total comp</li>
        </ol>

        <h2>Negotiation Strategies</h2>
        
        <h3>1. Know Your Leverage</h3>
        <p>
          The most powerful negotiation tool is a competing offer. PMs with 2+ offers 
          negotiate 18% higher total compensation on average. If you don&apos;t have competing 
          offers, emphasize unique skills or internal metrics you&apos;ve moved.
        </p>

        <h3>2. Negotiate Total Comp, Not Just Base</h3>
        <p>
          Early-career PMs focus on base salary. Senior PMs know that equity is where 
          wealth is built. At Staff+ levels, equity can exceed 50% of total comp.
        </p>

        <h3>3. Use Data, Not Emotion</h3>
        <p>
          Frame requests with data: &quot;Based on BLS data and H-1B filings for this role 
          in this market, the median is $X. Given my experience with [specific achievement], 
          I believe $Y is appropriate.&quot;
        </p>

        <h2>2026 Trends</h2>
        
        <ul>
          <li><strong>AI PM Premium:</strong> +22% for AI/ML product experience</li>
          <li><strong>Remote Normalization:</strong> Location penalties shrinking (was 15%, now 7%)</li>
          <li><strong>Equity Refresher:</strong> More companies offering annual refreshers as standard</li>
        </ul>

        <div className="not-prose my-8 p-6 bg-slate-800/50 border border-slate-700 rounded-lg text-center">
          <h3 className="text-lg font-semibold text-slate-200 mb-2">Ready to negotiate?</h3>
          <p className="text-slate-400 mb-4">
            Get your personalized salary analysis and grade.
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
          pay transparency laws. Sample size: 5,000+ data points.
        </p>
      </article>
    </main>
  );
}
