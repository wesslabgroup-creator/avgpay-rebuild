// avgpay/src/app/guides/remote-pay/page.tsx
import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table";
import { ArticleSchema } from "@/components/schema-markup";
import {
  GuideCtaSection,
  GuideFaqSection,
  GuideFooterLinks,
  GuideHero,
  GuideKeyTakeaways,
  GuideResourceLinks,
} from "@/components/guides/guide-shell";
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


const heroLearnItems = [
  "Different models for setting remote pay (geo-adjusted, national bands).",
  "Factors influencing your remote salary.",
  "Pros and cons of different remote pay strategies.",
  "How to research and negotiate remote compensation.",
  "Considerations for international remote work.",
];

const takeaways = [
  {
    icon: DollarSign,
    iconClassName: "text-green-600",
    title: "Location Matters (Usually)",
    description: "Most companies adjust pay based on location, influencing both base salary and equity ranges.",
  },
  {
    icon: Home,
    iconClassName: "text-yellow-600",
    title: "Company Policy is Crucial",
    description: "Understand your employer's specific pay philosophy for remote workers.",
  },
  {
    icon: Globe,
    iconClassName: "text-purple-600",
    title: "Skills Still Command Value",
    description: "In-demand skills and experience continue to be primary drivers of compensation, even remotely.",
  },
];

const resourceLinks = [
  { label: "Salary Database", href: "/salaries", description: "Benchmark your target pay across cities before accepting geo-adjustments." },
  { label: "Salary Comparison Tool", href: "/tools/salary-comparison", description: "Compare compensation scenarios when moving between markets." },
  { label: "Compare Offers", href: "/tools/compare-offers", description: "Evaluate competing remote offers with consistent total-comp math." },
  { label: "Startup vs. Big Tech", href: "/guides/startup-vs-bigtech", description: "See how remote policies diverge by company stage and risk profile." },
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

      <GuideHero
        title="Navigating Remote Compensation"
        description="Explore how remote work affects your salary. Understand location adjustments, pay bands, and how to maximize your earnings in a distributed workforce."
        learnIcon={Home}
        learnItems={heroLearnItems}
        summaryIcon={Globe}
        summary="The rise of remote work has fundamentally changed compensation strategies. Companies today employ diverse methods, from geo-adjusting salaries based on local cost of living to national pay bands. Understanding these models and their implications is essential for making informed career decisions and maximizing your earning potential in a remote-first world."
      />

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

      <GuideKeyTakeaways title="Key Takeaways for Remote Compensation" takeaways={takeaways} />

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

      <GuideFaqSection faqs={faqs} />

      <GuideResourceLinks links={resourceLinks} />

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

      <GuideCtaSection
        title="Optimize Your Remote Pay"
        description="Use our advanced analyzer to benchmark your remote compensation and understand location-based adjustments."
        ctaLabel="Go to Analyzer"
        ctaHref="/analyze-offer"
      />

      <GuideFooterLinks currentGuide="/guides/remote-pay" />
    </div>
  );
};

export default RemotePayPage;