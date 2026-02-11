// avgpay/src/app/guides/equity/page.tsx
import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table";
import { ArticleSchema } from "@/components/schema-markup";
import { Card, CardContent } from "@/components/ui/card";
import { ExpandableFAQ } from "@/components/ExpandableFAQ";
import {
  Lightbulb,
  ArrowRight,
  DollarSign,
  Star,
  Search,
  Copy,
  GitBranch,
  Percent,
} from "lucide-react";

const equityHeaders = [
  { key: "type", label: "Equity Type" },
  { key: "value", label: "Typical economics" },
  { key: "commonIn", label: "Commonly Found In" },
  { key: "requires", label: "Key Considerations" },
  { key: "source", label: "Source" },
];

const equityRows = [
  ["Stock Options", "Median new-hire grants often cluster around 0.02%-0.20% in early-stage startups.", "Seed to Series C startups", "Dilution, strike price, 90-day post-termination window", "Carta Option Benchmark Report (2025)."],
  ["ISOs", "Can receive long-term capital-gains treatment if holding rules are met.", "US startups", "AMT exposure, 1-year post-exercise and 2-year post-grant holding tests", "IRS Publication 525 and Form 3921 guidance."],
  ["NSOs", "Taxed as ordinary income on spread at exercise.", "Startups + late-stage private firms", "Withholding and cash needed to exercise", "IRS Topic 427 + employer stock-plan docs."],
  ["RSUs", "Value equals shares delivered at vest date; no strike price.", "Public companies and pre-IPO late-stage firms", "Tax withholding at vest and blackout windows", "SEC public-company compensation disclosures (2024-2025)."],
];

const faqs = [
  { question: "What is a vesting schedule?", answer: "A vesting schedule is the timeline over which you earn the right to exercise your stock options or own your RSUs. Common schedules include 4-year vesting with a 1-year cliff." },
  { question: "What's the difference between ISOs and NSOs?", answer: "ISOs offer potential tax advantages upon exercise and sale if certain conditions are met, while NSOs are taxed as ordinary income at exercise." },
  { question: "How do I value my stock options?", answer: "Valuation depends on the strike price, current fair market value (FMV) of the company's stock, and potential future growth. Use online calculators and consult financial advisors." },
  { question: "When should I exercise my stock options?", answer: "This is a complex decision. Consider your financial situation, the company's growth prospects, tax implications, and the expiration date of your options." },
];

export const metadata: Metadata = {
  title: "Equity Compensation Guide | AvgPay",
  description: "Understand stock options, RSUs, and other equity compensation. Learn how to maximize your earnings from company ownership.",
  keywords: "equity compensation, stock options, RSUs, ISOs, NSOs, startup equity, tech compensation, employee stock purchase plan",
  openGraph: {
    title: "Equity Compensation Guide | AvgPay",
    description: "Understand stock options, RSUs, and other equity compensation. Learn how to maximize your earnings from company ownership.",
    type: "article",
    publishedTime: "2026-02-10T09:46:00Z",
    images: [{ url: "/images/guides/equity-og.svg", width: 1200, height: 630, alt: "Equity Compensation Guide" }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Equity Compensation Guide | AvgPay",
    description: "Understand stock options, RSUs, and other equity compensation. Learn how to maximize your earnings from company ownership.",
    images: ["/images/guides/equity-og.svg"],
  },
};

const EquityPage = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <ArticleSchema
        headline="Equity Compensation Guide"
        datePublished="2026-02-10"
        authorName="AvgPay Team"
      />

      <h1 className="mb-4 text-4xl font-bold text-gray-900 sm:text-5xl lg:text-6xl">
        Understanding Equity Compensation
      </h1>
      <p className="mb-8 text-lg text-gray-600">
        Navigate the complexities of equity compensation, from stock options to RSUs, and learn how to leverage ownership for financial growth.
      </p>

      <div className="mb-12 grid gap-8 md:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center mb-3">
              <GitBranch className="h-6 w-6 text-blue-600 mr-2" />
              <h3 className="text-xl font-semibold text-gray-900">What You&apos;ll Learn</h3>
            </div>
            <ul className="space-y-2 text-gray-700">
              <li>Key differences between stock options and RSUs.</li>
              <li>Understanding vesting schedules and cliffs.</li>
              <li>Tax implications of different equity types.</li>
              <li>Strategies for exercising and managing your equity.</li>
              <li>How equity impacts startup vs. big tech roles.</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 bg-blue-50 border border-blue-200 shadow-inner">
            <div className="flex items-center mb-3">
              <Percent className="h-6 w-6 text-blue-600 mr-2" />
              <h3 className="text-xl font-semibold text-blue-800">Executive Summary</h3>
            </div>
            <p className="text-gray-800">
              Equity compensation can be a significant wealth-building tool, offering employees a stake in their company&apos;s success. Whether through stock options in startups or RSUs in public companies, understanding the terms, value, and tax implications is crucial. This guide breaks down the core concepts of equity compensation to empower your financial decisions.
            </p>
          </CardContent>
        </Card>
      </div>

      <section className="mb-12">
        <h2 className="mb-6 text-3xl font-bold text-gray-900">Types of Equity Compensation</h2>
        <p className="mb-4 text-gray-700">
          These rows summarize evidence-backed equity mechanics and tax treatment from IRS guidance plus compensation benchmark studies.
        </p>
        <DataTable headers={equityHeaders} rows={equityRows} />
        <p className="mt-4 text-sm text-gray-600">
          Methodology: We combined statutory tax rules (IRS) with startup/public-company benchmark ranges and intentionally separated tax facts from market-range estimates.
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
        <h2 className="mb-6 text-3xl font-bold text-gray-900">Key Takeaways for Equity</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center mb-3">
                <DollarSign className="h-6 w-6 text-green-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Value & Risk</h3>
              </div>
              <p className="text-gray-700">Equity&apos;s value tied to company performance; RSUs offer more predictable value than options.</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center mb-3">
                <Star className="h-6 w-6 text-yellow-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Vesting Schedules</h3>
              </div>
              <p className="text-gray-700">Understand vests to know when your equity becomes truly yours. Plan around cliffs and grant dates.</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center mb-3">
                <Percent className="h-6 w-6 text-purple-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Tax Implications</h3>
              </div>
              <p className="text-gray-700">Be aware of tax events (exercise, vesting) and consult professionals for optimal tax strategies.</p>
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
              <strong>Read the Fine Print:</strong> Always understand the specific terms of your equity grant, including strike price, FMV, and expiration.
            </p>
          </div>
          <div className="flex items-start">
            <Copy className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" />
            <p className="text-gray-700">
              <strong>Track Your Vesting:</strong> Use a spreadsheet or app to monitor your vesting schedule and upcoming vesting dates.
            </p>
          </div>
          <div className="flex items-start">
            <Search className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
            <p className="text-gray-700">
              <strong>Research Company Valuation:</strong> For options, understanding the company&apos;s current valuation and growth potential is crucial for decision-making.
            </p>
          </div>
          <div className="flex items-start">
            <DollarSign className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
            <p className="text-gray-700">
              <strong>Consult Experts:</strong> Consider consulting with a financial advisor or tax professional experienced in equity compensation.
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
        <p className="text-gray-700">Updated on February 11, 2026. Tax references are refreshed after each IRS filing-season update and benchmark ranges are reviewed quarterly.</p>
        <h3 className="mb-2 mt-6 text-xl font-semibold text-gray-900">Data sources</h3>
        <ul className="list-disc space-y-2 pl-6 text-gray-700">
          <li>IRS Publication 525, Topic 427, and Form 3921 instructions for option/RSU taxation rules.</li>
          <li>Carta startup option benchmark reports (2025) for grant-size distributions.</li>
          <li>SEC compensation disclosures for public-company RSU practices.</li>
        </ul>
      </section>

      <section className="text-center py-12 bg-gray-50 rounded-lg">
        <h2 className="mb-6 text-3xl font-bold text-gray-900">Unlock Your Equity&apos;s Potential</h2>
        <p className="mb-8 text-lg text-gray-700">
          Use our advanced analyzer to understand your equity grants, potential value, and tax implications.
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
          <Link href="/guides/swe-compensation-2026" className="hover:underline">SWE Compensation 2026</Link>
          <Link href="/guides/pm-compensation-2026" className="hover:underline">PM Compensation 2026</Link>
          <Link href="/guides/negotiation" className="hover:underline">Negotiation Guide</Link>
          <Link href="/guides/equity" className="font-semibold text-blue-600">Equity Guide</Link>
          <Link href="/guides/remote-pay" className="hover:underline">Remote Pay Guide</Link>
          <Link href="/guides/startup-vs-bigtech" className="hover:underline">Startup vs. Big Tech</Link>
        </div>
      </footer>
    </div>
  );
};

export default EquityPage;