import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table"; // Fixed import path
import { ArticleSchema } from "@/components/schema-markup";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Product Manager Compensation Guide 2026 | AvgPay",
  description: "Complete breakdown of PM salaries across levels, companies, and locations. Includes equity ranges and negotiation strategies.",
  openGraph: {
    type: "article",
    publishedTime: "2026-02-09",
  },
};

export default function PMGuidePage() {
  const levelData = {
    headers: [{label: "Level", key: "0"}, {label: "Base Salary", key: "1"}, {label: "Equity (Annual)", key: "2"}, {label: "Bonus", key: "3"}, {label: "Total Comp", key: "4"}],
    rows: [
      ["PM (L3)", "$125,000", "$15,000", "$12,000", "$152,000"],
      ["Sr PM (L4)", "$155,000", "$35,000", "$20,000", "$210,000"],
      ["Staff PM (L5)", "$185,000", "$75,000", "$35,000", "$295,000"],
      ["Principal PM (L6+)", "$220,000", "$150,000", "$60,000", "$430,000"],
    ],
  };

  const locationData = {
    headers: [{label: "Location", key: "0"}, {label: "Median Total Comp", key: "1"}, {label: "Premium/Discount", key: "2"}],
    rows: [
      ["San Francisco Bay Area", "$245,000", "+35%"],
      ["Seattle", "$220,000", "+21%"],
      ["New York", "$205,000", "+13%"],
      ["Austin", "$175,000", "-3%"],
      ["Remote (US)", "$195,000", "-7%"],
    ],
  };

  return (
    <main className="min-h-screen bg-white">
      <ArticleSchema headline="Product Manager Compensation Guide 2026" datePublished="2026-02-09" authorName="AvgPay Team" />
      
      <article className="max-w-3xl mx-auto px-6 py-12 prose prose-slate lg:prose-lg">
        <div className="mb-8 not-prose">
          <span className="text-emerald-600 text-sm font-medium">February 2026</span>
          <h1 className="text-4xl font-bold text-slate-900 mt-2">Product Manager Compensation Guide 2026</h1>
          <p className="text-xl text-slate-600 mt-4">
            The most comprehensive analysis of Product Manager salaries in tech. 
            Based on 5,000+ verified data points from BLS, H-1B filings, and pay transparency laws.
          </p>
        </div>

        <div className="not-prose my-8 p-6 bg-emerald-50 border border-emerald-200 rounded-lg">
          <h2 className="text-lg font-semibold text-emerald-700 mb-2">Executive Summary</h2>
          <p className="text-slate-700">
            Product Managers in tech earn a median total compensation of <strong>$185,000</strong> in 2026, 
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
          negotiate 18% higher total compensation on average. If you don't have competing 
          offers, emphasize unique skills or internal metrics you've moved.
        </p>

        <h3>2. Negotiate Total Comp, Not Just Base</h3>
        <p>
          Early-career PMs focus on base salary. Senior PMs know that equity is where 
          wealth is built. At Staff+ levels, equity can exceed 50% of total comp.
        </p>

        <h3>3. Use Data, Not Emotion</h3>
        <p>
          Frame requests with data: "Based on BLS data and H-1B filings for this role 
          in this market, the median is $X. Given my experience with [specific achievement], 
          I believe $Y is appropriate."
        </p>

        <h2>2026 Trends</h2>
        
        <ul>
          <li><strong>AI PM Premium:</strong> +22% for AI/ML product experience</li>
          <li><strong>Remote Normalization:</strong> Location penalties shrinking (was 15%, now 7%)</li>
          <li><strong>Equity Refresher:</strong> More companies offering annual refreshers as standard</li>
        </ul>

        <div className="not-prose my-12 p-8 bg-slate-50 border border-slate-200 rounded-xl text-center">
          <h3 className="text-2xl font-bold text-slate-900 mb-2">Ready to negotiate?</h3>
          <p className="text-slate-600 mb-6">
            Get your personalized salary analysis and grade.
          </p>
          <Link href="/#analyzer">
            <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all">
              Analyze Your Offer
            </Button>
          </Link>
        </div>

        <hr className="border-slate-200" />
        
        <p className="text-slate-600 text-sm not-prose">
          Last updated: February 2026. Data sourced from BLS, H-1B filings, and 
          pay transparency laws. Sample size: 5,000+ data points.
        </p>
      </article>
    </main>
  );
}
