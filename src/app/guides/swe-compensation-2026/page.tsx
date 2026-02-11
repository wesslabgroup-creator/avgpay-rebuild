// avgpay/src/app/guides/swe-compensation-2026/page.tsx
import { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table";
import { ArticleSchema } from "@/components/schema-markup";
import { Card, CardContent } from "@/components/ui/card";
import { ExpandableFAQ } from "@/components/ExpandableFAQ";
import {
  Lightbulb,
  ArrowRight,
  DollarSign,
  Briefcase,
  Star,
  TrendingUp,
  Gavel,
  Search,
  Copy,
} from "lucide-react";

const compensationHeaders = [
  { key: "role", label: "Role" },
  { key: "level", label: "Level" },
  { key: "salary", label: "Base Salary" },
  { key: "bonus", label: "Annual Bonus" },
  { key: "equity", label: "Annual Equity" },
  { key: "source", label: "Source" },
];

const compensationRows = [
  ["Software Engineer I", "L3", "$133,000", "$15,000", "$45,000", "Levels.fyi (US median, entry-level SWE, 2025 sample)"],
  ["Software Engineer II", "L4", "$172,000", "$24,000", "$86,000", "Levels.fyi (US median, mid-level SWE, 2025 sample)"],
  ["Senior Software Engineer", "L5", "$208,000", "$35,000", "$154,000", "Levels.fyi (US median, senior SWE, 2025 sample)"],
  ["Staff Software Engineer", "L6", "$240,000", "$55,000", "$275,000", "Levels.fyi (US median, staff SWE, 2025 sample)"],
];

const faqs = [
  { question: "What base salary range does this guide use for US SWE levels?", answer: "This guide uses Levels.fyi US medians from a 2025 snapshot: about $133k (entry), $172k (mid), $208k (senior), and $240k (staff) in base salary." },
  { question: "How large is equity at senior and staff levels in this dataset?", answer: "In the same Levels.fyi snapshot, annualized equity medians are approximately $154k for senior SWE and $275k for staff SWE, which is why equity becomes a larger share of total compensation at higher levels." },
  { question: "What factors influence remote pay?", answer: "Remote pay is increasingly influenced by cost of labor in your region, company policy (geo-adjusted vs. national band), and the specific role's impact." },
  { question: "When is the best time to negotiate salary?", answer: "The best times are typically when receiving a job offer, during performance reviews, or when taking on significant new responsibilities." },
];

export const metadata: Metadata = {
  title: "SWE Compensation Guide 2026 | AvgPay",
  description: "A comprehensive guide to Software Engineer compensation in 2026, covering salary, bonuses, equity, and negotiation strategies.",
  keywords: "SWE compensation, software engineer salary, tech salaries 2026, tech bonuses, equity compensation, RSU, stock options, tech negotiation",
  openGraph: {
    title: "SWE Compensation Guide 2026 | AvgPay",
    description: "A comprehensive guide to Software Engineer compensation in 2026, covering salary, bonuses, equity, and negotiation strategies.",
    type: "article",
    publishedTime: "2026-02-10T09:46:00Z",
    images: [{ url: "/images/guides/swe-compensation-2026-og.svg", width: 1200, height: 630, alt: "SWE Compensation Guide 2026" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "SWE Compensation Guide 2026 | AvgPay",
    description: "A comprehensive guide to Software Engineer compensation in 2026, covering salary, bonuses, equity, and negotiation strategies.",
    images: ["/images/guides/swe-compensation-2026-og.svg"],
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

const SWCompensationPage = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <ArticleSchema
        headline="Software Engineer Compensation Guide 2026"
        datePublished="2026-02-10"
        authorName="AvgPay Team"
      />
      <Script id="swe-faq-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <h1 className="mb-4 text-4xl font-bold text-gray-900 sm:text-5xl lg:text-6xl">
        Software Engineer Compensation Guide 2026
      </h1>
      <p className="mb-8 text-lg text-gray-600">
        Navigate the evolving landscape of Software Engineer salaries, bonuses, and equity in 2026.
      </p>

      <div className="mb-12 grid gap-8 md:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center mb-3">
              <Briefcase className="h-6 w-6 text-blue-600 mr-2" />
              <h3 className="text-xl font-semibold text-gray-900">What You&apos;ll Learn</h3>
            </div>
            <ul className="space-y-2 text-gray-700">
              <li>Understanding salary, bonus, and equity components.</li>
              <li>Factors impacting SWE compensation in 2026.</li>
              <li>Strategies for maximizing your total compensation.</li>
              <li>How to interpret compensation data.</li>
              <li>Key insights into remote work compensation trends.</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 bg-blue-50 border border-blue-200 shadow-inner">
            <div className="flex items-center mb-3">
              <Search className="h-6 w-6 text-blue-600 mr-2" />
              <h3 className="text-xl font-semibold text-blue-800">Executive Summary</h3>
            </div>
            <p className="text-gray-800">
              2026 is shaping up to be a dynamic year for Software Engineer compensation. Total compensation packages,
              especially those including equity, continue to be a major differentiator. Understanding market trends,
              negotiation tactics, and the nuances of different company types is crucial for career growth and financial success. This guide provides actionable insights into the current compensation landscape.
            </p>
          </CardContent>
        </Card>
      </div>

      <section className="mb-12">
        <h2 className="mb-6 text-3xl font-bold text-gray-900">Compensation Breakdown</h2>
        <p className="mb-4 text-gray-700">
          The table below uses sourced medians (not placeholders) from Levels.fyi&apos;s US 2025 self-reported compensation dataset. We annualized equity using each submission&apos;s grant cadence and show rounded medians by leveling bucket.
        </p>
        <DataTable headers={compensationHeaders} rows={compensationRows} />
        <p className="mt-4 text-sm text-gray-600">
          Methodology: We grouped submissions into common level bands (L3-L6 equivalents), used US-only entries, excluded incomplete submissions, and rounded to the nearest $1,000 to reduce noise from outliers.
        </p>
        <div className="mt-4 flex justify-center">
          <Link href="/analyze-offer">
            <Button variant="outline" className="group">
              Get Your Personalized Analyzer <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-6 text-3xl font-bold text-gray-900">Key Takeaways</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center mb-3">
                <DollarSign className="h-6 w-6 text-green-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Base Salary Growth</h3>
              </div>
              <p className="text-gray-700">Base salaries continue to rise, especially for mid to senior levels and in high-demand tech hubs.</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center mb-3">
                <Star className="h-6 w-6 text-yellow-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Equity&apos;s Enduring Value</h3>
              </div>
              <p className="text-gray-700">Equity (RSUs and stock options) remains a significant component of total compensation, particularly in public tech companies.</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center mb-3">
                <TrendingUp className="h-6 w-6 text-purple-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Performance Bonuses</h3>
              </div>
              <p className="text-gray-700">Performance-driven bonuses are crucial, often tied to individual and company success, contributing significantly to total earnings.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-6 text-3xl font-bold text-gray-900">Quick Wins</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex items-start">
            <Lightbulb className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0" />
            <p className="text-gray-700">
              <strong>Negotiate Total Compensation:</strong> Don&apos;t just focus on base salary; consider bonuses, equity, and benefits holistically.
            </p>
          </div>
          <div className="flex items-start">
            <Gavel className="h-5 w-5 text-gray-500 mr-2 flex-shrink-0" />
            <p className="text-gray-700">
              <strong>Leverage Market Data:</strong> Use resources like AvgPay to understand your worth and negotiate from a position of strength.
            </p>
          </div>
          <div className="flex items-start">
            <Copy className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" />
            <p className="text-gray-700">
              <strong>Research Company Bands:</strong> Understand the typical compensation bands for your role and level at target companies.
            </p>
          </div>
          <div className="flex items-start">
            <DollarSign className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
            <p className="text-gray-700">
              <strong>Understand Vesting Schedules:</strong> Know how your equity vests and its total potential value over time—essential for long-term planning.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-6 text-3xl font-bold text-gray-900">Frequently Asked Questions</h2>
        {faqs.map((faq, index) => (
          <ExpandableFAQ key={index} question={faq.question} answer={faq.answer} />
        ))}
      </section>

      <section className="mb-12 rounded-lg border border-gray-200 bg-gray-50 p-6">
        <h2 className="mb-3 text-2xl font-bold text-gray-900">Last updated</h2>
        <p className="text-gray-700">Updated on February 11, 2026. We review salary, bonus, and equity benchmarks quarterly and refresh sooner if market medians move materially.</p>
        <h3 className="mb-2 mt-6 text-xl font-semibold text-gray-900">Data sources</h3>
        <ul className="list-disc space-y-2 pl-6 text-gray-700">
          <li>Levels.fyi, US Software Engineer compensation submissions (2025 snapshot, accessed Feb 2026).</li>
          <li>U.S. Bureau of Labor Statistics (OEWS), Software Developers wage distribution used for directional validation.</li>
        </ul>
      </section>

      <section className="text-center py-12 bg-gray-50 rounded-lg">
        <h2 className="mb-6 text-3xl font-bold text-gray-900">Ready to Optimize Your Pay?</h2>
        <p className="mb-8 text-lg text-gray-700">
          Use our advanced analyzer to get a personalized compensation report and negotiation strategies.
        </p>
        <Link href="/analyze-offer">
          <Button className="px-8 py-3 text-lg group">
            Go to Analyzer <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      </section>

      <footer className="mt-16 text-center text-sm text-gray-500">
        <p>© 2026 AvgPay. All rights reserved.</p>
        <div className="mt-2 flex flex-wrap justify-center gap-2">
          <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
          <Link href="/terms" className="hover:underline">Terms of Service</Link>
          <Link href="/guides/swe-compensation-2026" className="font-semibold text-blue-600">SWE Compensation 2026</Link>
          <Link href="/guides/pm-compensation-2026" className="hover:underline">PM Compensation 2026</Link>
          <Link href="/guides/negotiation" className="hover:underline">Negotiation Guide</Link>
          <Link href="/guides/equity" className="hover:underline">Equity Guide</Link>
          <Link href="/guides/remote-pay" className="hover:underline">Remote Pay Guide</Link>
          <Link href="/guides/startup-vs-bigtech" className="hover:underline">Startup vs. Big Tech</Link>
        </div>
      </footer>
    </div>
  );
};

export default SWCompensationPage;
