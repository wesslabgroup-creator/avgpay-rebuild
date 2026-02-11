// avgpay/src/app/guides/negotiation/page.tsx
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
  Gavel,
  Search,
  Copy,
  HeartHandshake,
  Handshake,
} from "lucide-react";

const negotiationHeaders = [
  { key: "factor", label: "Negotiation Factor" },
  { key: "impact", label: "Observed impact" },
  { key: "notes", label: "Evidence" },
  { key: "source", label: "Source" },
];

const negotiationRows = [
  ["Competing offer", "Strong", "Candidates with at least one alternative offer are significantly more likely to secure improved terms.", "Hired Salary Negotiation Survey (2024)."],
  ["Role scarcity", "Strong", "Niche roles (AI/ML, security) show wider accepted-offer ranges than generalist SWE postings.", "Levels.fyi + Pave role-band dispersion (2025)."],
  ["Preparation with market data", "Moderate to strong", "Candidates citing objective range data get higher first-revision success than candidates without reference data.", "Payscale recruiter survey and Hired findings (2024-2025)."],
  ["Negotiating total package", "Moderate", "Equity refresh, sign-on, and level changes frequently move total comp when base salary is constrained.", "SEC proxy statements + compensation committee disclosures."],
  ["Timing", "Moderate", "Offer stage and promotion windows consistently produce higher concession rates than ad-hoc requests.", "Lattice performance cycle analysis + recruiter benchmarks."],
];

const faqs = [
  { question: "When should I negotiate my salary?", answer: "The optimal times are usually during a job offer, annual performance reviews, or when taking on significant new responsibilities. Be prepared." },
  { question: "What if the company says their offer is final?", answer: "Acknowledge their position, but restate your case by highlighting your unique value proposition and market research. If still firm, consider other aspects of the total compensation package." },
  { question: "How do I research salary ranges?", answer: "Utilize online resources like AvgPay, Glassdoor, Levels.fyi, and industry-specific reports. Network with peers for insights." },
  { question: "Should I mention my current salary?", answer: "In many regions, it's illegal for employers to ask for salary history. Focus on your desired salary based on market value and contribution, not past earnings." },
];

const heroLearnItems = [
  "Key negotiation principles and strategies.",
  "How to research and determine your market value.",
  "Effective communication techniques during negotiation.",
  "Negotiating beyond base salary (bonuses, equity, benefits).",
  "Common negotiation mistakes to avoid.",
];

const takeaways = [
  {
    icon: DollarSign,
    iconClassName: "text-success",
    title: "Research is Paramount",
    description:
      "Know your worth. Thorough research into market rates and company compensation practices is your strongest asset.",
  },
  {
    icon: Handshake,
    iconClassName: "text-warning",
    title: "Practice Your Pitch",
    description:
      "Rehearse your talking points both mentally and out loud to build confidence and clarity.",
  },
  {
    icon: Gavel,
    iconClassName: "text-accent",
    title: "Focus on Total Compensation",
    description:
      "Consider base salary, bonus potential, equity, benefits, and professional development opportunities.",
  },
];

const resourceLinks = [
  {
    label: "Offer Analyzer",
    href: "/analyze-offer",
    description: "Model negotiation levers and identify your strongest package tradeoffs.",
  },
  {
    label: "Negotiation Email Tool",
    href: "/tools/negotiation-email",
    description: "Generate a polished follow-up email anchored in market-based requests.",
  },
  {
    label: "Salary Database",
    href: "/salaries",
    description: "Cross-check your ask against role and location medians before countering.",
  },
  {
    label: "SWE Compensation Guide",
    href: "/guides/swe-compensation-2026",
    description: "Map the salary bands and equity norms recruiters expect in 2026.",
  },
];

export const metadata: Metadata = {
  title: "Salary Negotiation Guide | AvgPay",
  description: "Master the art of salary negotiation. Learn strategies, tips, and common pitfalls to secure the compensation you deserve.",
  keywords: "salary negotiation, job offer negotiation, how to negotiate salary, tech salary negotiation, compensation negotiation, career advice",
  openGraph: {
    title: "Salary Negotiation Guide | AvgPay",
    description: "Master the art of salary negotiation. Learn strategies, tips, and common pitfalls to secure the compensation you deserve.",
    type: "article",
    publishedTime: "2026-02-10T09:46:00Z",
    images: [{ url: "/images/guides/negotiation-og.svg", width: 1200, height: 630, alt: "Salary Negotiation Guide" }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Salary Negotiation Guide | AvgPay",
    description: "Master the art of salary negotiation. Learn strategies, tips, and common pitfalls to secure the compensation you deserve.",
    images: ["/images/guides/negotiation-og.svg"],
  },
};

const NegotiationPage = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <ArticleSchema
        headline="Salary Negotiation Guide"
        datePublished="2026-02-10"
        authorName="AvgPay Team"
      />

      <GuideHero
        title="Mastering Salary Negotiation"
        description="Equip yourself with the knowledge and strategies to confidently negotiate your compensation and achieve your career goals."
        learnIcon={Handshake}
        learnItems={heroLearnItems}
        summaryIcon={Gavel}
        summary="Negotiation is a critical skill for career advancement and financial well-being. This guide demystifies the negotiation process, providing actionable steps and proven strategies to help you secure fair compensation. By understanding market dynamics, preparing thoroughly, and communicating effectively, you can significantly increase your earning potential."
      />

      <section className="mb-12">
        <h2 className="mb-6 text-3xl font-bold text-text-primary">Factors Influencing Your Negotiation Power</h2>
        <p className="mb-4 text-text-secondary">
          This table replaces generic advice with findings from compensation and recruiting datasets on what most changes outcomes.
        </p>
        <DataTable headers={negotiationHeaders} rows={negotiationRows} />
        <p className="mt-4 text-sm text-text-muted">
          Methodology: We prioritized studies with explicit sample sizes and converted qualitative findings into a simple impact rubric (strong / moderate).
        </p>
        <div className="mt-4 flex justify-center">
          <Link href="/analyze-offer">
            <Button variant="outline" className="group">
              Get Your Personalized Analyzer <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </section>

      <GuideKeyTakeaways title="Key Takeaways for Negotiation" takeaways={takeaways} />

      <section className="mb-12">
        <h2 className="mb-6 text-3xl font-bold text-text-primary">Quick Wins</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex items-start">
            <Lightbulb className="h-5 w-5 text-warning mr-2 flex-shrink-0" />
            <p className="text-text-secondary">
              <strong>Be Confident, Not Demanding:</strong> Present your case with data and assertiveness, but maintain professionalism.
            </p>
          </div>
          <div className="flex items-start">
            <Copy className="h-5 w-5 text-info mr-2 flex-shrink-0" />
            <p className="text-text-secondary">
              <strong>Ask for Time to Consider:</strong> It&apos;s okay to ask for 24-48 hours to review an offer carefully.
            </p>
          </div>
          <div className="flex items-start">
            <Search className="h-5 w-5 text-success mr-2 flex-shrink-0" />
            <p className="text-text-secondary">
              <strong>Identify Your Priorities:</strong> Know what aspects of compensation are most important to you before you start negotiating.
            </p>
          </div>
          <div className="flex items-start">
            <HeartHandshake className="h-5 w-5 text-error mr-2 flex-shrink-0" />
            <p className="text-text-secondary">
              <strong>Build Rapport:</strong> Negotiation is a conversation. Aim for a win-win outcome that benefits both you and the employer.
            </p>
          </div>
        </div>
      </section>

      <GuideFaqSection faqs={faqs} />

      <GuideResourceLinks links={resourceLinks} />

      <section className="mb-12 rounded-lg border border-border bg-surface-subtle p-6">
        <h2 className="mb-3 text-2xl font-bold text-text-primary">Last updated</h2>
        <p className="text-text-secondary">Updated on February 11, 2026. Negotiation outcome data is reviewed biannually because employer market conditions can shift quickly.</p>
        <h3 className="mb-2 mt-6 text-xl font-semibold text-text-primary">Data sources</h3>
        <ul className="list-disc space-y-2 pl-6 text-text-secondary">
          <li>Hired salary negotiation survey research (2024).</li>
          <li>Pave and Levels.fyi compensation dispersion analyses (2025).</li>
          <li>Public-company proxy statements for bonus/equity negotiation flexibility signals.</li>
          <li>Lattice review-cycle and compensation timing research.</li>
        </ul>
      </section>

      <GuideCtaSection
        title="Ready to Negotiate Like a Pro?"
        description="Use our advanced analyzer to get personalized negotiation strategies and benchmark your target compensation."
        ctaLabel="Go to Analyzer"
        ctaHref="/analyze-offer"
      />

      <GuideFooterLinks currentGuide="/guides/negotiation" />
    </div>
  );
};

export default NegotiationPage;
