// avgpay/src/app/guides/remote-pay/page.tsx
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
  Search,
  Copy,
  Home,
  Globe,
} from "lucide-react";

const remotePayHeaders = [
  { key: "factor", label: "Factor" },
  { key: "impact", label: "Impact" },
  { key: "metric", label: "Evidence-backed metric" },
  { key: "source", label: "Source" },
];

const remotePayRows = [
  ["Geo-adjusted pay in large tech firms", "High", "10% to 20% base-pay reduction is a common relocation adjustment from top-tier markets to lower-cost US metros.", "Meta, Google, and Stripe policy memos compiled by Protocol and Reuters (2021-2024)."],
  ["Location-agnostic pay", "Medium", "~15% of US tech employers report using one national cash band for fully-remote software roles.", "Pave Compensation Benchmarking Report 2025."],
  ["Role scarcity", "High", "High-demand specialties (AI/ML, security, distributed systems) continue to show premium remote offers even outside Tier-1 cities.", "Levels.fyi 2025 role-segment medians."],
  ["Labor market cooling", "Medium", "US software job openings remained below the 2021 peak, reducing across-the-board offer inflation.", "US BLS JOLTS + CompTIA State of Tech Workforce 2025."],
  ["Cross-border compliance", "High", "Employer payroll/tax overhead can add 8% to 18% to gross cash comp for international remote hires.", "Deel and Remote global employment benchmark reports (2025)."],
];

const faqs = [
  { question: "How do companies determine remote pay?", answer: "Companies use various models: geo-adjusted pay (based on COL), national pay bands, or location-agnostic pay. Policy varies significantly by employer." },
  { question: "Will my salary decrease if I move to a lower COL area?", answer: "Possibly. Many companies adjust salaries based on the employee's location's cost of living. It's crucial to understand your company's specific remote pay policy." },
  { question: "Is it better to be remote in a high-COL city or a low-COL city?", answer: "This depends on your priorities. High-COL cities might offer higher base pay but also higher living expenses. Low-COL cities may offer lower pay but greater savings potential." },
  { question: "What about working remotely internationally?", answer: "International remote work adds layers of complexity including tax laws, employment regulations, and payroll differences, often requiring specific company policies or PEOs (Professional Employer Organizations)." },
];

export const metadata: Metadata = {
  title: "Remote Work Compensation Guide | AvgPay",
  description: "Understand how remote work impacts pay. Learn about location-based adjustments, national pay bands, and navigating your remote compensation.",
  keywords: "remote pay, work from home salary, location based pay, geo-adjusted pay, remote compensation, tech salaries, WFH",
  openGraph: {
    title: "Remote Work Compensation Guide | AvgPay",
    description: "Understand how remote work impacts pay. Learn about location-based adjustments, national pay bands, and navigating your remote compensation.",
    type: "article",
    publishedTime: "2026-02-10T09:46:00Z",
    images: [{ url: "/images/guides/remote-pay-og.svg", width: 1200, height: 630, alt: "Remote Work Compensation Guide" }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Remote Work Compensation Guide | AvgPay",
    description: "Understand how remote work impacts pay. Learn about location-based adjustments, national pay bands, and navigating your remote compensation.",
    images: ["/images/guides/remote-pay-og.svg"],
  },
};

const RemotePayPage = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <ArticleSchema
        headline="Remote Work Compensation Guide"
        datePublished="2026-02-10"
        authorName="AvgPay Team"
      />

      <h1 className="mb-4 text-4xl font-bold text-gray-900 sm:text-5xl lg:text-6xl">
        Navigating Remote Compensation
      </h1>
      <p className="mb-8 text-lg text-gray-600">
        Explore how remote work affects your salary. Understand location adjustments, pay bands, and how to maximize your earnings in a distributed workforce.
      </p>

      <div className="mb-12 grid gap-8 md:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center mb-3">
              <Home className="h-6 w-6 text-blue-600 mr-2" />
              <h3 className="text-xl font-semibold text-gray-900">What You&apos;ll Learn</h3>
            </div>
            <ul className="space-y-2 text-gray-700">
              <li>Different models for setting remote pay (geo-adjusted, national bands).</li>
              <li>Factors influencing your remote salary.</li>
              <li>Pros and cons of different remote pay strategies.</li>
              <li>How to research and negotiate remote compensation.</li>
              <li>Considerations for international remote work.</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 bg-blue-50 border border-blue-200 shadow-inner">
            <div className="flex items-center mb-3">
              <Globe className="h-6 w-6 text-blue-600 mr-2" />
              <h3 className="text-xl font-semibold text-blue-800">Executive Summary</h3>
            </div>
            <p className="text-gray-800">
              The rise of remote work has fundamentally changed compensation strategies. Companies today employ diverse methods, from geo-adjusting salaries based on local cost of living to establishing national pay bands. Understanding these models and how they apply to your situation is key to ensuring fair compensation and maximizing your financial well-being as a remote employee.
            </p>
          </CardContent>
        </Card>
      </div>

      <section className="mb-12">
        <h2 className="mb-6 text-3xl font-bold text-gray-900">Key Factors in Remote Pay</h2>
        <p className="mb-4 text-gray-700">
          These figures summarize published compensation and labor-market data on remote-pay policies, including relocation adjustments, national bands, and compliance overhead.
        </p>
        <DataTable headers={remotePayHeaders} rows={remotePayRows} />
        <p className="mt-4 text-sm text-gray-600">
          Methodology: We prioritized public reports with disclosed sample windows, then extracted numeric findings most relevant to software and product hiring in US-led companies.
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
        <h2 className="mb-6 text-3xl font-bold text-gray-900">Key Takeaways for Remote Compensation</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center mb-3">
                <DollarSign className="h-6 w-6 text-green-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Location Matters (Usually)</h3>
              </div>
              <p className="text-gray-700">Most companies adjust pay based on location, influencing both base salary and equity ranges.</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center mb-3">
                <Home className="h-6 w-6 text-yellow-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Company Policy is Crucial</h3>
              </div>
              <p className="text-gray-700">Understand your employer&apos;s specific pay philosophy for remote workers.</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center mb-3">
                <Globe className="h-6 w-6 text-purple-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Skills Still Command Value</h3>
              </div>
              <p className="text-gray-700">In-demand skills and experience continue to be primary drivers of compensation, even remotely.</p>
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
              <strong>Ask About the Policy:</strong> Inquire about the company&apos;s remote compensation philosophy early in the interview process.
            </p>
          </div>
          <div className="flex items-start">
            <Copy className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" />
            <p className="text-gray-700">
              <strong>Research Multiple Locations:</strong> Compare salary ranges for your role in various potential remote locations using compensation tools.
            </p>
          </div>
          <div className="flex items-start">
            <Search className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
            <p className="text-gray-700">
              <strong>Factor in Total Compensation:</strong> Consider benefits and cost of living when comparing offers across different locations or companies.
            </p>
          </div>
          <div className="flex items-start">
            <ArrowRight className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
            <p className="text-gray-700">
              <strong>Be Prepared for Adjustments:</strong> If you move, understand how it might impact your pay and ensure clear communication with your employer.
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
        <p className="text-gray-700">Updated on February 11, 2026. Remote-pay policy data is reviewed each quarter because company geo-pay policies change frequently.</p>
        <h3 className="mb-2 mt-6 text-xl font-semibold text-gray-900">Data sources</h3>
        <ul className="list-disc space-y-2 pl-6 text-gray-700">
          <li>Protocol/Reuters coverage of major tech geo-pay policies (Meta, Google, Stripe).</li>
          <li>Pave Compensation Benchmarking Report (2025).</li>
          <li>US BLS JOLTS, CompTIA State of the Tech Workforce (2025).</li>
          <li>Deel and Remote employer-cost benchmarks for international hiring (2025).</li>
        </ul>
      </section>

      <section className="text-center py-12 bg-gray-50 rounded-lg">
        <h2 className="mb-6 text-3xl font-bold text-gray-900">Optimize Your Remote Pay</h2>
        <p className="mb-8 text-lg text-gray-700">
          Use our advanced analyzer to benchmark your remote compensation and understand location-based adjustments.
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
          <Link href="/guides/equity" className="hover:underline">Equity Guide</Link>
          <Link href="/guides/remote-pay" className="font-semibold text-blue-600">Remote Pay Guide</Link>
          <Link href="/guides/startup-vs-bigtech" className="hover:underline">Startup vs. Big Tech</Link>
        </div>
      </footer>
    </div>
  );
};

export default RemotePayPage;