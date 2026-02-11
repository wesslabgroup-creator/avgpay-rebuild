// avgpay/src/app/guides/equity/page.tsx
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

const heroLearnItems = [
  "Key differences between stock options and RSUs.",
  "Understanding vesting schedules and cliffs.",
  "Tax implications of different equity types.",
  "Strategies for exercising and managing your equity.",
  "How equity impacts startup vs. big tech roles.",
];

const takeaways = [
  {
    icon: DollarSign,
    iconClassName: "text-success",
    title: "Value & Risk",
    description:
      "Equity's value tied to company performance; RSUs offer more predictable value than options.",
  },
  {
    icon: Star,
    iconClassName: "text-warning",
    title: "Vesting Schedules",
    description:
      "Understand vests to know when your equity becomes truly yours. Plan around cliffs and grant dates.",
  },
  {
    icon: Percent,
    iconClassName: "text-accent",
    title: "Tax Implications",
    description:
      "Be aware of tax events (exercise, vesting) and consult professionals for optimal tax strategies.",
  },
];

const resourceLinks = [
  {
    label: "Equity Simulator",
    href: "/tools/equity-simulator",
    description: "Model dilution, vesting timelines, and potential upside across outcomes.",
  },
  {
    label: "Stock Calculator",
    href: "/tools/stock-calculator",
    description: "Estimate strike price scenarios and tax-aware exercise costs.",
  },
  {
    label: "Startup vs. Big Tech Guide",
    href: "/guides/startup-vs-bigtech",
    description: "Compare the tradeoff between option upside and public-company RSU stability.",
  },
  {
    label: "Salary Database",
    href: "/salaries",
    description: "Contextualize cash compensation so you can value equity in total package terms.",
  },
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

      <GuideHero
        title="Understanding Equity Compensation"
        description="Navigate the complexities of equity compensation, from stock options to RSUs, and learn how to leverage ownership for financial growth."
        learnIcon={GitBranch}
        learnItems={heroLearnItems}
        summaryIcon={Percent}
        summary="Equity compensation can be a significant wealth-building tool, offering employees a stake in their company's success. Whether through stock options in startups or RSUs in public companies, understanding the terms, value, and tax implications is crucial. This guide breaks down the core concepts of equity compensation to empower your financial decisions."
      />

      <section className="mb-12">
        <h2 className="mb-6 text-3xl font-bold text-text-primary">Types of Equity Compensation</h2>
        <p className="mb-4 text-text-secondary">
          These rows summarize evidence-backed equity mechanics and tax treatment from IRS guidance plus compensation benchmark studies.
        </p>
        <DataTable headers={equityHeaders} rows={equityRows} />
        <p className="mt-4 text-sm text-text-muted">
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

      <GuideKeyTakeaways title="Key Takeaways for Equity" takeaways={takeaways} />

      <section className="mb-12">
        <h2 className="mb-6 text-3xl font-bold text-text-primary">Quick Wins</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex items-start">
            <Lightbulb className="h-5 w-5 text-warning mr-2 flex-shrink-0" />
            <p className="text-text-secondary">
              <strong>Read the Fine Print:</strong> Always understand the specific terms of your equity grant, including strike price, FMV, and expiration.
            </p>
          </div>
          <div className="flex items-start">
            <Copy className="h-5 w-5 text-info mr-2 flex-shrink-0" />
            <p className="text-text-secondary">
              <strong>Track Your Vesting:</strong> Use a spreadsheet or app to monitor your vesting schedule and upcoming vesting dates.
            </p>
          </div>
          <div className="flex items-start">
            <Search className="h-5 w-5 text-success mr-2 flex-shrink-0" />
            <p className="text-text-secondary">
              <strong>Research Company Valuation:</strong> For options, understanding the company&apos;s current valuation and growth potential is crucial for decision-making.
            </p>
          </div>
          <div className="flex items-start">
            <DollarSign className="h-5 w-5 text-error mr-2 flex-shrink-0" />
            <p className="text-text-secondary">
              <strong>Consult Experts:</strong> Consider consulting with a financial advisor or tax professional experienced in equity compensation.
            </p>
          </div>
        </div>
      </section>

      <GuideFaqSection faqs={faqs} />

      <GuideResourceLinks links={resourceLinks} />

      <section className="mb-12 rounded-lg border border-border bg-surface-subtle p-6">
        <h2 className="mb-3 text-2xl font-bold text-text-primary">Last updated</h2>
        <p className="text-text-secondary">Updated on February 11, 2026. Tax references are refreshed after each IRS filing-season update and benchmark ranges are reviewed quarterly.</p>
        <h3 className="mb-2 mt-6 text-xl font-semibold text-text-primary">Data sources</h3>
        <ul className="list-disc space-y-2 pl-6 text-text-secondary">
          <li>IRS Publication 525, Topic 427, and Form 3921 instructions for option/RSU taxation rules.</li>
          <li>Carta startup option benchmark reports (2025) for grant-size distributions.</li>
          <li>SEC compensation disclosures for public-company RSU practices.</li>
        </ul>
      </section>

      <GuideCtaSection
        title="Unlock Your Equity's Potential"
        description="Use our advanced analyzer to understand your equity grants, potential value, and tax implications."
        ctaLabel="Go to Analyzer"
        ctaHref="/analyze-offer"
      />

      <GuideFooterLinks currentGuide="/guides/equity" />
    </div>
  );
};

export default EquityPage;
