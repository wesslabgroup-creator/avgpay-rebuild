import { Metadata } from &quot;next&quot;;
import { Button } from &quot;@/components/ui/button&quot;;
import { Navigation } from &quot;@/components/navigation&quot;;
import { DataTable } from &quot;@/components/data-table&quot;;
import { ArticleSchema } from &quot;@/components/schema-markup&quot;;
import Link from &quot;next/link&quot;;

export const metadata: Metadata = {
  title: &quot;Software Engineer Salary Guide 2026 | AvgPay&quot;,
  description: &quot;From L3 to Staff+. Compensation breakdowns at Google, Meta, Amazon, and startups. Plus leveling guides.&quot;,
  openGraph: {
    type: &quot;article&quot;,
    publishedTime: &quot;2026-02-05&quot;,
  },
};

export default function SWEGuidePage() {
  const levelData = {
    headers: [&quot;Level&quot;, &quot;Base Salary&quot;, &quot;Equity (Annual)&quot;, &quot;Bonus&quot;, &quot;Total Comp&quot;],
    rows: [
      [&quot;Junior (L3)&quot;, 140000, 25000, 15000, 180000],
      [&quot;Mid-Level (L4)&quot;, 175000, 60000, 25000, 260000],
      [&quot;Senior (L5)&quot;, 210000, 120000, 40000, 370000],
      [&quot;Staff (L6)&quot;, 260000, 220000, 70000, 550000],
      [&quot;Principal (L7+)&quot;, 320000, 400000, 100000, 820000],
    ],
  };

  const locationData = {
    headers: [&quot;Location&quot;, &quot;Median Total Comp&quot;, &quot;Premium/Discount&quot;],
    rows: [
      [&quot;San Francisco Bay Area&quot;, 280000, &quot;+30%&quot;],
      [&quot;New York&quot;, 260000, &quot;+22%&quot;],
      [&quot;Seattle&quot;, 255000, &quot;+20%&quot;],
      [&quot;Austin&quot;, 210000, &quot;+2%&quot;],
      [&quot;Remote (US)&quot;, 220000, &quot;+6%&quot;],
    ],
  };

  return (
    <main className=&quot;min-h-screen bg-slate-950&quot;>
      <Navigation />
      <ArticleSchema headline=&quot;Software Engineer Salary Guide 2026&quot; datePublished=&quot;2026-02-05&quot; authorName=&quot;AvgPay Team&quot; />
      
      <article className=&quot;max-w-3xl mx-auto px-6 py-12 prose prose-invert prose-lg&quot;>
        <div className=&quot;mb-8 not-prose&quot;>
          <span className=&quot;text-indigo-400 text-sm font-medium&quot;>February 2026</span>
          <h1 className=&quot;text-4xl font-bold text-slate-100 mt-2&quot;>Software Engineer Salary Guide 2026</h1>
          <p className=&quot;text-xl text-slate-400 mt-4&quot;>
            A deep dive into Software Engineering compensation across the tech industry. 
            Based on 8,000+ verified data points from BLS, H-1B filings, and public pay transparency data.
          </p>
        </div>

        <div className=&quot;not-prose my-8 p-6 bg-indigo-900/20 border border-indigo-500/30 rounded-lg&quot;>
          <h2 className=&quot;text-lg font-semibold text-indigo-300 mb-2&quot;>Executive Summary</h2>
          <p className=&quot;text-slate-300&quot;>
            Software Engineers command the highest median compensation in tech, with a median total comp of $260,000 for mid-level roles in major hubs. 
            AI/ML specializations are seeing a 20-30% premium over generalist roles.
          </p>
        </div>

        <h2>Compensation by Level</h2>
        <div className=&quot;not-prose my-6&quot;>
          <DataTable headers={levelData.headers} rows={levelData.rows} />
        </div>

        <h2>Compensation by Location</h2>
        <p>While remote work remains popular, top-tier compensation is still concentrated in major tech hubs:</p>
        
        <div className=&quot;not-prose my-6&quot;>
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
          Understand the vesting schedule—Amazon is back-weighted (5/15/40/40), while verify
          Google is front-weighted (33/33/22/12) or flat (25% annually).
        </p>

        <h3>3. Sign-on Bonuses</h3>
        <p>
          Sign-on bonuses, often ranging from $20k to $100k+, are the easiest lever for recruiters 
          to pull to close a candidate without disrupting salary bands. 
          Allows ask for a sign-on if the base salary is inflexible.
        </p>

        <h2>Future Outlook</h2>
        <p>
          Demand for specialized roles (ML Infra, Kernel, Distributed Systems) is outpacing general 
          full-stack web development. Engineers investing in lower-level systems knowledge or 
          model deployment pipelines are seeing faster career velocity.
        </p>

        <div className=&quot;not-prose my-8 p-6 bg-slate-800/50 border border-slate-700 rounded-lg text-center&quot;>
          <h3 className=&quot;text-lg font-semibold text-slate-200 mb-2&quot;>Check your market rate</h3>
          <p className=&quot;text-slate-400 mb-4&quot;>
            See exactly where your offer lands against verified benchmarks.
          </p>
          <Link href=&quot;/#analyzer&quot;>
            <Button size=&quot;lg&quot; className=&quot;bg-gradient-to-r from-indigo-600 to-violet-600&quot;>
              Analyze Your Offer
            </Button>
          </Link>
        </div>

        <hr className=&quot;border-slate-800&quot; />
        
        <p className=&quot;text-slate-400 text-sm not-prose&quot;>
          Last updated: February 2026. Data sourced from BLS, H-1B filings, and 
          pay transparency laws.
        </p>
      </article>
    </main>
  );
}
