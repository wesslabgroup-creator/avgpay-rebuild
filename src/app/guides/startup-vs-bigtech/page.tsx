// avgpay/src/app/guides/startup-vs-bigtech/page.tsx
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
  Briefcase,
  Gavel,
  Search,
  Copy,
} from "lucide-react";

const startupBigTechHeaders = [
  { key: "aspect", label: "Aspect" },
  { key: "startup", label: "Startup" },
  { key: "bigTech", label: "Big Tech" },
  { key: "notes", label: "Notes" },
];

const startupBigTechRows = [
  ["Base Salary (Senior IC SWE)", "$170k-$210k median base", "$220k-$280k median base", "Carta Total Compensation + Levels.fyi medians (2025)."],
  ["Annual Bonus Target", "0%-10% typical", "15%-25% typical", "Pave and SEC proxy disclosures for large public tech companies."],
  ["Equity Vehicle", "Stock options (higher variance)", "RSUs (lower variance)", "Carta startup equity plans vs. public company comp disclosures."],
  ["Liquidity Timeline", "Often 7-10 years to exit event", "Quarterly vest/sell after lockups", "Carta liquidity research + public company trading mechanics."],
  ["Offer Volatility", "Higher during fundraising cycles", "Lower, tied to review cycles", "Pave offer acceptance and rescind trend data (2024-2025)."],
  ["Failure/Downside Risk", "Meaningful probability of zero equity value", "Lower equity wipeout risk", "CB Insights startup failure studies + public market diversification effects."],
];

const faqs = [
  { question: "What is the main difference in compensation between startups and big tech?", answer: "Big Tech generally offers higher base salaries and RSUs, while startups offer potentially higher upside through stock options, but with more risk and often lower base pay." },
  { question: "Which offers better long-term career growth?", answer: "Both offer growth, but in different ways. Startups provide breadth and rapid learning across many functions. Big Tech offers depth, specialization, and structured career paths." },
  { question: "Is startup equity worth the risk?", answer: "It can be, especially if the startup achieves a high valuation or IPO. However, many startups fail, leading to worthless equity. Thorough due diligence is essential." },
  { question: "What kind of roles are common in early-stage startups?", answer: "Early-stage startups often require employees to wear multiple hats, taking on responsibilities across engineering, product, marketing, and operations." },
];

const heroLearnItems = [
  "How startup and Big Tech compensation structures differ.",
  "Risk-reward tradeoffs between options and RSUs.",
  "How career growth paths vary by company stage.",
  "How to evaluate liquidity timelines and downside risk.",
  "What to negotiate in each environment.",
];

const takeaways = [
  { icon: DollarSign, iconClassName: "text-success", title: "Cash vs Upside", description: "Big Tech usually wins on predictable cash while startups can offer larger upside variance." },
  { icon: Star, iconClassName: "text-warning", title: "Role Scope Changes Fast", description: "Startups can accelerate scope quickly, but leveling and process are less standardized." },
  { icon: TrendingUp, iconClassName: "text-accent", title: "Liquidity Timeline Matters", description: "Option value depends on exit timing; RSUs tend to realize value more predictably." },
];

const resourceLinks = [
  { label: "Equity Guide", href: "/guides/equity", description: "Deep-dive on option mechanics, RSU timing, and tax implications." },
  { label: "SWE Compensation Guide", href: "/guides/swe-compensation-2026", description: "See how cash and equity norms differ by level in large tech orgs." },
  { label: "Compare Offers Tool", href: "/tools/compare-offers", description: "Compare startup and Big Tech packages using consistent assumptions." },
  { label: "Salary Database", href: "/salaries", description: "Anchor base salary expectations by role and location before deciding." },
];

export const metadata: Metadata = {
  title: "Startup vs. Big Tech Compensation Guide | AvgPay",
  description: "Compare compensation, culture, and career growth opportunities between startups and established tech giants.",
  keywords: "startup compensation, big tech salary, tech career, startup vs big tech, employee equity, RSU, stock options, career growth",
  openGraph: {
    title: "Startup vs. Big Tech Compensation Guide | AvgPay",
    description: "Compare compensation, culture, and career growth opportunities between startups and established tech giants.",
    type: "article",
    publishedTime: "2026-02-10T09:46:00Z",
    images: [{ url: "/images/guides/startup-vs-bigtech-og.svg", width: 1200, height: 630, alt: "Startup vs. Big Tech Compensation Guide" }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Startup vs. Big Tech Compensation Guide | AvgPay",
    description: "Compare compensation, culture, and career growth opportunities between startups and established tech giants.",
    images: ["/images/guides/startup-vs-bigtech-og.svg"],
  },
};

const StartupVsBigTechPage = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <ArticleSchema
        headline="Startup vs. Big Tech Compensation Guide"
        datePublished="2026-02-10"
        authorName="AvgPay Team"
      />

      <GuideHero
        title="Startup vs. Big Tech Compensation"
        description="Understand the compensation tradeoffs between startups and big tech companies, from cash to equity and long-term upside."
        learnIcon={Briefcase}
        learnItems={heroLearnItems}
        summaryIcon={TrendingUp}
        summary="Choosing between a startup and Big Tech offer is a portfolio decision: cash certainty versus upside variance. This guide breaks down where compensation structures diverge, how liquidity timelines change expected value, and what to negotiate in each environment so you can align pay with your risk tolerance and career goals."
      />

      <section className="mb-12">
        <h2 className="mb-6 text-3xl font-bold text-text-primary">Compensation Comparison</h2>
        <p className="mb-4 text-text-secondary">
          This comparison table uses published benchmarks from compensation platforms, SEC filings, and startup equity studies to quantify the trade-offs.
        </p>
        <DataTable headers={startupBigTechHeaders} rows={startupBigTechRows} />
        <p className="mt-4 text-sm text-text-muted">
          Methodology: We mapped each source to a common senior individual-contributor profile and normalized cash and equity descriptions into comparable ranges.
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
              <strong>Define Your Priorities:</strong> What matters most to you? High salary, equity upside, work-life balance, learning opportunities?
            </p>
          </div>
          <div className="flex items-start">
            <Copy className="h-5 w-5 text-info mr-2 flex-shrink-0" />
            <p className="text-text-secondary">
              <strong>Research Company Stage:</strong> Understand where a startup is in its funding and growth cycle—this impacts equity value and risk.
            </p>
          </div>
          <div className="flex items-start">
            <Search className="h-5 w-5 text-success mr-2 flex-shrink-0" />
            <p className="text-text-secondary">
              <strong>Network Extensively:</strong> Talk to people working in both environments to get firsthand accounts of culture and compensation.
            </p>
          </div>
          <div className="flex items-start">
            <Gavel className="h-5 w-5 text-error mr-2 flex-shrink-0" />
            <p className="text-text-secondary">
              <strong>Negotiate Wisely:</strong> Tailor your negotiation strategy based on whether you&apos;re joining a startup or a Big Tech firm.
            </p>
          </div>
        </div>
      </section>

      <GuideFaqSection faqs={faqs} />

      <GuideResourceLinks links={resourceLinks} />

      <section className="mb-12 rounded-lg border border-border bg-surface-subtle p-6">
        <h2 className="mb-3 text-2xl font-bold text-text-primary">Last updated</h2>
        <p className="text-text-secondary">Updated on February 11, 2026. Startup and public-company compensation references are refreshed after each earnings season.</p>
        <h3 className="mb-2 mt-6 text-xl font-semibold text-text-primary">Data sources</h3>
        <ul className="list-disc space-y-2 pl-6 text-text-secondary">
          <li>Carta Total Compensation and startup equity benchmarking reports (2025).</li>
          <li>Levels.fyi role-level medians (US, 2025 snapshot).</li>
          <li>Public-company proxy statements (SEC filings) for bonus and equity plan targets.</li>
          <li>CB Insights startup outcomes research for downside-risk context.</li>
        </ul>
      </section>

      <GuideCtaSection
        title="Decide With Confidence"
        description="Use our analyzer to compare startup and Big Tech offers on expected total compensation."
        ctaLabel="Go to Analyzer"
        ctaHref="/analyze-offer"
      />

      <GuideFooterLinks currentGuide="/guides/startup-vs-bigtech" />
    </div>
  );
};

export default StartupVsBigTechPage;