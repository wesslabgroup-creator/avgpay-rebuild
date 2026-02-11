// avgpay/src/app/guides/pm-compensation-2026/page.tsx
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
  Copy,
  HeartHandshake,
  Award,
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
  ["Associate Product Manager", "APM / P1", "$135,000", "$15,000", "$35,000", "Levels.fyi (US median, 2025 PM sample)"],
  ["Product Manager", "P2", "$175,000", "$25,000", "$85,000", "Levels.fyi (US median, 2025 PM sample)"],
  ["Senior Product Manager", "P3", "$215,000", "$40,000", "$175,000", "Levels.fyi (US median, 2025 PM sample)"],
  ["Director of Product Management", "P4", "$250,000", "$65,000", "$325,000", "Levels.fyi (US median, 2025 PM sample)"],
];

const faqs = [
  { question: "What PM base salary levels does this guide benchmark?", answer: "Using Levels.fyi US medians (2025 snapshot), base salary benchmarks are about $135k (APM/P1), $175k (P2), $215k (P3), and $250k (P4 director)." },
  { question: "How important is equity for senior PM compensation?", answer: "In the same dataset, annualized equity rises from roughly $35k at APM/P1 to about $325k at director level, so equity becomes a major portion of total comp as scope increases." },
  { question: "What skills drive higher PM compensation?", answer: "Strong strategic thinking, market analysis, cross-functional leadership, and product vision are key drivers for higher compensation for Product Managers." },
  { question: "Do PMs get stock options or RSUs?", answer: "PMs typically receive RSUs in public companies and stock options in private companies, with grants often tied to performance and impact." },
];

export const metadata: Metadata = {
  title: "PM Compensation Guide 2026 | AvgPay",
  description: "A comprehensive guide to Product Manager compensation in 2026, covering salary, bonuses, equity, and career progression.",
  keywords: "PM compensation, product manager salary, tech salaries 2026, product leadership, equity compensation, RSU, stock options, tech negotiation",
  openGraph: {
    title: "PM Compensation Guide 2026 | AvgPay",
    description: "A comprehensive guide to Product Manager compensation in 2026, covering salary, bonuses, equity, and career progression.",
    type: "article",
    publishedTime: "2026-02-10T09:46:00Z",
    images: [{ url: "/images/guides/pm-compensation-2026-og.svg", width: 1200, height: 630, alt: "PM Compensation Guide 2026" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "PM Compensation Guide 2026 | AvgPay",
    description: "A comprehensive guide to Product Manager compensation in 2026, covering salary, bonuses, equity, and career progression.",
    images: ["/images/guides/pm-compensation-2026-og.svg"],
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

const PMCompensationPage = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <ArticleSchema
        headline="Product Manager Compensation Guide 2026"
        datePublished="2026-02-10"
        authorName="AvgPay Team"
      />
      <Script id="pm-faq-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <h1 className="mb-4 text-4xl font-bold text-gray-900 sm:text-5xl lg:text-6xl">
        Product Manager Compensation Guide 2026
      </h1>
      <p className="mb-8 text-lg text-gray-600">
        Understand the compensation landscape for Product Managers in 2026, from base salary to equity and strategic career moves.
      </p>

      <div className="mb-12 grid gap-8 md:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center mb-3">
              <Briefcase className="h-6 w-6 text-blue-600 mr-2" />
              <h3 className="text-xl font-semibold text-gray-900">What You&apos;ll Learn</h3>
            </div>
            <ul className="space-y-2 text-gray-700">
              <li>Key components of a PM compensation package.</li>
              <li>Factors influencing PM salaries and bonuses in 2026.</li>
              <li>The role of equity in PM compensation.</li>
              <li>Career progression paths and their compensation implications.</li>
              <li>How to benchmark your own PM salary.</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 bg-blue-50 border border-blue-200 shadow-inner">
            <div className="flex items-center mb-3">
              <Award className="h-6 w-6 text-blue-600 mr-2" />
              <h3 className="text-xl font-semibold text-blue-800">Executive Summary</h3>
            </div>
            <p className="text-gray-800">
              Product Managers are pivotal to a company&apos;s success, and their compensation reflects this critical role. In 2026, PM compensation packages are characterized by competitive base salaries, performance-driven bonuses, and significant equity components, especially in fast-growing tech companies. Understanding these dynamics and focusing on strategic career development are key to maximizing earning potential.
            </p>
          </CardContent>
        </Card>
      </div>

      <section className="mb-12">
        <h2 className="mb-6 text-3xl font-bold text-gray-900">Compensation Breakdown</h2>
        <p className="mb-4 text-gray-700">
          This table uses sourced US medians from Levels.fyi&apos;s 2025 Product Manager submissions. Figures are grouped into common PM level buckets and rounded for readability.
        </p>
        <DataTable headers={compensationHeaders} rows={compensationRows} />
        <p className="mt-4 text-sm text-gray-600">
          Methodology: US-only submissions, incomplete rows removed, equity annualized from reported grant value and vest cadence, then median values computed per level.
        </p>
        <div className="mt-4 flex justify-center">
          <Link href="/analyzer" legacyBehavior>
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
                <h3 className="text-lg font-semibold text-gray-900">Competitive Base Salaries</h3>
              </div>
              <p className="text-gray-700">Base salaries for PMs remain strong, reflecting the skill and responsibility involved in product strategy.</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center mb-3">
                <Star className="h-6 w-6 text-yellow-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Significant Equity Component</h3>
              </div>
              <p className="text-gray-700">Equity, whether RSUs or stock options, often forms a substantial part of the total compensation, especially at senior levels.</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center mb-3">
                <TrendingUp className="h-6 w-6 text-purple-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Performance & Impact Bonuses</h3>
              </div>
              <p className="text-gray-700">Bonuses are frequently tied to product success metrics, team performance, and overall company profitability.</p>
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
              <strong>Quantify Your Impact:</strong> Always back up your achievements with data and metrics to demonstrate your value.
            </p>
          </div>
          <div className="flex items-start">
            <Gavel className="h-5 w-5 text-gray-500 mr-2 flex-shrink-0" />
            <p className="text-gray-700">
              <strong>Benchmark Effectively:</strong> Use tools like AvgPay to compare your compensation against industry standards for your experience and location.
            </p>
          </div>
          <div className="flex items-start">
            <Copy className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" />
            <p className="text-gray-700">
              <strong>Understand Equity Nuances:</strong> Differentiate between stock options and RSUs, and understand vesting schedules and potential dilution.
            </p>
          </div>
          <div className="flex items-start">
            <HeartHandshake className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
            <p className="text-gray-700">
              <strong>Align with Company Goals:</strong> Demonstrate how your product leadership directly contributes to overarching business and strategic objectives.
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
        <p className="text-gray-700">Updated on February 11, 2026. PM compensation benchmarks are reviewed quarterly and refreshed when median deltas exceed 5%.</p>
        <h3 className="mb-2 mt-6 text-xl font-semibold text-gray-900">Data sources</h3>
        <ul className="list-disc space-y-2 pl-6 text-gray-700">
          <li>Levels.fyi, US Product Manager compensation submissions (2025 snapshot, accessed Feb 2026).</li>
          <li>Bureau of Labor Statistics occupational wage trends for management and product-adjacent roles used for directional cross-checking.</li>
        </ul>
      </section>

      <section className="text-center py-12 bg-gray-50 rounded-lg">
        <h2 className="mb-6 text-3xl font-bold text-gray-900">Ready to Optimize Your Pay?</h2>
        <p className="mb-8 text-lg text-gray-700">
          Use our advanced analyzer to get a personalized compensation report and negotiation strategies.
        </p>
        <Link href="/analyzer" legacyBehavior>
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
          <Link href="/guides/swe-compensation-2026" className="hover:underline">SWE Compensation 2026</Link>
          <Link href="/guides/pm-compensation-2026" className="font-semibold text-blue-600">PM Compensation 2026</Link>
          <Link href="/guides/negotiation" className="hover:underline">Negotiation Guide</Link>
          <Link href="/guides/equity" className="hover:underline">Equity Guide</Link>
          <Link href="/guides/remote-pay" className="hover:underline">Remote Pay Guide</Link>
          <Link href="/guides/startup-vs-bigtech" className="hover:underline">Startup vs. Big Tech</Link>
        </div>
      </footer>
    </div>
  );
};

export default PMCompensationPage;
