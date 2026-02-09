import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArticleSchema } from "@/components/schema-markup";

export const metadata: Metadata = {
  title: "How to Negotiate Tech Offers | AvgPay",
  description: "Data-driven strategies for negotiating compensation. Learn when to push, what to ask for, and how to handle competing offers.",
  openGraph: {
    type: "article",
    publishedTime: "2026-02-09",
  },
};

export default function NegotiationGuidePage() {
  return (
    <main className="min-h-screen bg-white">
      <ArticleSchema headline="How to Negotiate Tech Offers" datePublished="2026-02-09" authorName="AvgPay Team" />
      
      <article className="max-w-3xl mx-auto px-6 py-12 prose prose-slate lg:prose-lg">
        <div className="mb-8 not-prose">
          <span className="text-indigo-600 text-sm font-medium">February 2026</span>
          <h1 className="text-4xl font-bold text-slate-900 mt-2">How to Negotiate Tech Offers</h1>
          <p className="text-xl text-slate-600 mt-4">
            Stop leaving money on the table. A data-driven framework to increase your total compensation by 10-20% without risking the offer.
          </p>
        </div>

        <h2>The Golden Rule: Information is Leverage</h2>
        <p>
          Recruiters negotiate for a living; you do it once every few years. To level the playing field, you need data. 
          Never give a number first. If asked for your expectations, say:
        </p>
        <blockquote>
          "I'm open to market rates for this role and level. Can you share the compensation band you have budgeted for this position?"
        </blockquote>

        <h2>The 3 Levers of Compensation</h2>
        <p>
          Most candidates focus on base salary, but that's often the hardest lever to move. Focus on the total package:
        </p>
        <ul>
          <li><strong>Base Salary:</strong> Fixed bands. Hard to move more than 5-10% above the midpoint without a competing offer.</li>
          <li><strong>Equity (RSUs/Options):</strong> The biggest wealth builder. Hiring managers often have more discretion here. 
          Standard grants can often be increased by 20-50% for top candidates.</li>
          <li><strong>Sign-on Bonus:</strong> The easiest "yes". It's a one-time cost for the company. 
          Always ask: "Is there a signing bonus to bridge the gap?"</li>
        </ul>

        <h2>The "Competing Offer" Strategy</h2>
        <p>
          The single most powerful negotiation tool is a second offer. It creates scarcity and social proof.
        </p>
        <ol>
          <li><strong>Timing matters:</strong> Try to line up interview loops so offers land within the same week.</li>
          <li><strong>Don't bluff:</strong> Only use a real offer. Recruiters may ask to see it (you don't have to show the document, but you must know the numbers).</li>
          <li><strong>The Script:</strong> "I'm really excited about [Company A], but [Company B] has offered $X. 
          If you can match the equity component, I'm ready to sign today."</li>
        </ol>

        <h2>Script: When the Offer is Too Low</h2>
        <p>
          "Thank you for the offer. I'm excited about the team. However, looking at market data for [Role] in [Location] 
          and my experience level, I was expecting something closer to [$X]. What flexibility do we have to get closer to that number?"
        </p>

        <h2>Script: Asking for a Sign-on Bonus</h2>
        <p>
          "I'm walking away from unvested equity at my current role valued at roughly $Y. 
          Can we structure a sign-on bonus to help offset that loss?"
        </p>

        <div className="not-prose my-12 p-8 bg-slate-50 border border-slate-200 rounded-xl text-center">
          <h3 className="text-2xl font-bold text-slate-900 mb-2">Know your worth before you ask</h3>
          <p className="text-slate-600 mb-6">
            Don't guess. See exactly where your current offer stands against verified market data.
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
