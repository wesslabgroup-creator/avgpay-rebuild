// avgpay/src/app/guides/pm-compensation-2026/page.tsx
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
  Briefcase,
  Star,
  TrendingUp,
  Gavel,
  Copy,
  HeartHandshake,
  Award,
} from "lucide-react";

// Placeholder data for DataTable
const compensationHeaders = [
  { key: "role", label: "Role" },
  { key: "level", label: "Level" },
  { key: "salary", label: "Base Salary" },
  { key: "bonus", label: "Annual Bonus" },
  { key: "equity", label: "Annual Equity" },
];

const compensationRows = [
  ["Associate Product Manager", "APM", "$100,000", "$5,000", "$30,000"],
  ["Product Manager", "P2", "$130,000", "$10,000", "$70,000"],
  ["Senior Product Manager", "P3", "$160,000", "$15,000", "$150,000"],
  ["Director of Product Management", "P4", "$200,000", "$20,000", "$300,000"],
];

const faqs = [
  { question: "What is the average PM salary in 2026?", answer: "The average base salary for Product Managers in 2026 is estimated to be around $140,000, with total compensation potentially reaching $180,000+ depending on experience and company." },
  { question: "How critical is equity for PMs?", answer: "Equity is highly critical, especially in startups and growth-stage companies, often forming a substantial portion of the total compensation package." },
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
    images: [], // Add image URLs if available
  },
  twitter: {
    card: "summary_large_image",
    title: "PM Compensation Guide 2026 | AvgPay",
    description: "A comprehensive guide to Product Manager compensation in 2026, covering salary, bonuses, equity, and career progression.",
  },
};

const PMCompensationPage = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <ArticleSchema
        headline="Product Manager Compensation Guide 2026"
        datePublished="2026-02-10"
        authorName="AvgPay Team"
      />

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
          Delve into the typical compensation structure for Product Managers in 2026, including base salary, annual bonuses, and equity.
        </p>
        <DataTable headers={compensationHeaders} rows={compensationRows} />
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