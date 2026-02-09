import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArticleSchema } from "@/components/schema-markup";

export const metadata: Metadata = {
  title: "Understanding Tech Equity | AvgPay",
  description: "RSUs vs options, vesting schedules, 409A valuations, and tax implications. Everything you need to evaluate equity offers.",
  openGraph: {
    type: "article",
    publishedTime: "2026-02-09",
  },
};

export default function EquityGuidePage() {
  return (
    <main className="min-h-screen bg-white">
      <ArticleSchema headline="Understanding Tech Equity" datePublished="2026-02-09" authorName="AvgPay Team" />
      
      <article className="max-w-3xl mx-auto px-6 py-12 prose prose-slate lg:prose-lg">
        <div className="mb-8 not-prose">
          <span className="text-indigo-600 text-sm font-medium">February 2026</span>
          <h1 className="text-4xl font-bold text-slate-900 mt-2">Understanding Tech Equity</h1>
          <p className="text-xl text-slate-600 mt-4">
            RSUs vs Options? Vesting vs Cliff? Don't let confusing jargon cost you six figures. 
            The complete guide to evaluating equity offers.
          </p>
        </div>

        <h2>RSUs: Simple Stock</h2>
        <p>
          Restricted Stock Units (RSUs) are the standard for public companies (e.g., Google, Amazon) 
          and late-stage startups.
        </p>
        <ul>
          <li><strong>What it is:</strong> You get actual shares of stock.</li>
          <li><strong>Value:</strong> (Number of Shares) x (Current Share Price).</li>
          <li><strong>Tax:</strong> RSUs are taxed as ordinary income when they vest. You own them free and clear.</li>
          <li><strong>Example:</strong> You vest 1,000 RSUs of a stock trading at $200. You owe tax on $200,000 of income.</li>
        </ul>

        <h2>Stock Options (ISOs/NSOs): High Risk, High Reward</h2>
        <p>
          Options are common in early-stage startups. You don't own the stock; you own the 
          <em>right to buy</em> (exercise) the stock at a fixed price (Strike Price).
        </p>
        <ul>
          <li><strong>Strike Price:</strong> The price you pay to buy the stock. Usually the 409A valuation at grant time.</li>
          <li><strong>Value:</strong> (Current Share Price - Strike Price) x Number of Options.</li>
          <li><strong>Risk:</strong> If the company value drops below your Strike Price, your options are worthless ("underwater").</li>
          <li><strong>Tax:</strong> Exercising options triggers complex tax events (AMT for ISOs). Consult a CPA.</li>
        </ul>

        <h2>Vesting Schedules: The Golden Handcuffs</h2>
        <p>
          Equity isn't yours immediately. You earn it over time.
        </p>
        <ul>
          <li><strong>Standard 4-Year Vesting with 1-Year Cliff:</strong> 
          You get 0 shares for the first year. At the 1-year mark ("the cliff"), you vest 25%. 
          Then you vest monthly (1/48th) for the remaining 3 years.</li>
          <li><strong>Amazon's Back-Loaded Schedule:</strong> 5% Year 1, 15% Year 2, 40% Year 3, 40% Year 4. 
          Brutal if you leave early.</li>
          <li><strong>Google's Front-Loaded Schedule:</strong> 33% Year 1, 33% Year 2, 22% Year 3, 12% Year 4. 
          Great for shorter tenure.</li>
        </ul>

        <h2>Evaluating a Startup Offer</h2>
        <p>
          Don't just look at the percentage ownership (e.g., "0.1%"). Ask:
        </p>
        <ol>
          <li><strong>"What is the current 409A valuation?"</strong> (Your strike price usually matches this).</li>
          <li><strong>"What was the preferred price at the last funding round?"</strong> (What VCs paid—often 3-5x the 409A).</li>
          <li><strong>"What is the total number of outstanding shares?"</strong> (To calculate your true ownership percentage).</li>
        </ol>

        <div className="not-prose my-12 p-8 bg-slate-50 border border-slate-200 rounded-xl text-center">
          <h3 className="text-2xl font-bold text-slate-900 mb-2">Check your market rate</h3>
          <p className="text-slate-600 mb-6">
            Compare your equity grant against verified market data for your role and level.
          </p>
          <Link href="/#analyzer">
            <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all">
              Analyze Your Offer Now
            </Button>
          </Link>
        </div>
      </article>
    </main>
  );
}
