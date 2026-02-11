// avgpay/src/app/guides/swe-compensation-2026/page.tsx
import { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
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

const heroLearnItems = [
  "Understanding salary, bonus, and equity components.",
  "Factors impacting SWE compensation in 2026.",
  "Strategies for maximizing your total compensation.",
  "How to interpret compensation data.",
  "Key insights into remote work compensation trends.",
];

const takeaways = [
  { icon: DollarSign, iconClassName: "text-success", title: "Base Salary Growth", description: "Base salaries continue to rise, especially for mid to senior levels and in high-demand tech hubs." },
  { icon: Star, iconClassName: "text-warning", title: "Equity's Enduring Value", description: "Equity (RSUs and stock options) remains a significant component of total compensation, particularly in public tech companies." },
  { icon: TrendingUp, iconClassName: "text-accent", title: "Performance Bonuses", description: "Performance-driven bonuses are crucial, often tied to individual and company success, contributing significantly to total earnings." },
];

const resourceLinks = [
  { label: "Salary Database", href: "/salaries", description: "Check current SWE market medians by role and location before interviews." },
  { label: "Offer Analyzer", href: "/analyze-offer", description: "Convert raw offer terms into comparable total-comp outcomes." },
  { label: "Compare Offers Tool", href: "/tools/compare-offers", description: "Stack multiple offers side-by-side with consistent assumptions." },
  { label: "PM Compensation Guide", href: "/guides/pm-compensation-2026", description: "Use cross-function comparisons to pressure-test leveling and scope." },
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

      <GuideHero
        title="Software Engineer Compensation Guide 2026"
        description="Navigate the evolving landscape of Software Engineer salaries, bonuses, and equity in 2026."
        learnIcon={Briefcase}
        learnItems={heroLearnItems}
        summaryIcon={Search}
        summary="2026 is shaping up to be a dynamic year for Software Engineer compensation. Total compensation packages, especially those including equity, continue to be a major differentiator. Understanding market trends, negotiation tactics, and the nuances of different company types is crucial for career growth and financial success. This guide provides actionable insights into the current compensation landscape."
      />

      <section className="mb-12">
        <h2 className="mb-6 text-3xl font-bold text-text-primary">Compensation Breakdown</h2>
        <p className="mb-4 text-text-secondary">
          The table below uses sourced medians (not placeholders) from Levels.fyi&apos;s US 2025 self-reported compensation dataset. We annualized equity using each submission&apos;s grant cadence and show rounded medians by leveling bucket.
        </p>
        <DataTable headers={compensationHeaders} rows={compensationRows} />
        <p className="mt-4 text-sm text-text-muted">
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

      <GuideKeyTakeaways title="Key Takeaways" takeaways={takeaways} />

      <section className="mb-12">
        <h2 className="mb-6 text-3xl font-bold text-text-primary">Quick Wins</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex items-start">
            <Lightbulb className="h-5 w-5 text-warning mr-2 flex-shrink-0" />
            <p className="text-text-secondary">
              <strong>Negotiate Total Compensation:</strong> Don&apos;t just focus on base salary; consider bonuses, equity, and benefits holistically.
            </p>
          </div>
          <div className="flex items-start">
            <Gavel className="h-5 w-5 text-text-muted mr-2 flex-shrink-0" />
            <p className="text-text-secondary">
              <strong>Leverage Market Data:</strong> Use resources like AvgPay to understand your worth and negotiate from a position of strength.
            </p>
          </div>
          <div className="flex items-start">
            <Copy className="h-5 w-5 text-info mr-2 flex-shrink-0" />
            <p className="text-text-secondary">
              <strong>Research Company Bands:</strong> Understand the typical compensation bands for your role and level at target companies.
            </p>
          </div>
          <div className="flex items-start">
            <DollarSign className="h-5 w-5 text-success mr-2 flex-shrink-0" />
            <p className="text-text-secondary">
              <strong>Understand Vesting Schedules:</strong> Know how your equity vests and its total potential value over time—essential for long-term planning.
            </p>
          </div>
        </div>
      </section>

      <GuideFaqSection faqs={faqs} />

      <GuideResourceLinks links={resourceLinks} />

      <section className="mb-12 rounded-lg border border-border bg-surface-subtle p-6">
        <h2 className="mb-3 text-2xl font-bold text-text-primary">Last updated</h2>
        <p className="text-text-secondary">Updated on February 11, 2026. We review salary, bonus, and equity benchmarks quarterly and refresh sooner if market medians move materially.</p>
        <h3 className="mb-2 mt-6 text-xl font-semibold text-text-primary">Data sources</h3>
        <ul className="list-disc space-y-2 pl-6 text-text-secondary">
          <li>Levels.fyi, US Software Engineer compensation submissions (2025 snapshot, accessed Feb 2026).</li>
          <li>U.S. Bureau of Labor Statistics (OEWS), Software Developers wage distribution used for directional validation.</li>
        </ul>
      </section>

      <GuideCtaSection
        title="Ready to Optimize Your Pay?"
        description="Use our advanced analyzer to get a personalized compensation report and negotiation strategies."
        ctaLabel="Go to Analyzer"
        ctaHref="/analyze-offer"
      />

      <GuideFooterLinks currentGuide="/guides/swe-compensation-2026" />
    </div>
  );
};

export default SWCompensationPage;
