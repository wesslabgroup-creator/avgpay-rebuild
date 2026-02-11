import { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { ComponentType } from "react";
import { ArrowRight, Briefcase, Calculator, CandlestickChart, Clock3, GitCompare, Handshake, LineChart, Mail, Sparkles, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Salary Tools & Calculators | AvgPay",
  description:
    "Explore AvgPay salary tools and calculators to negotiate offers, model equity, compare compensation packages, and plan your next move.",
  keywords: [
    "salary tools",
    "salary calculator",
    "compensation calculator",
    "offer comparison tool",
    "equity calculator",
    "negotiation tools",
  ],
  alternates: {
    canonical: "/tools",
  },
  openGraph: {
    title: "Salary Tools & Calculators | AvgPay",
    description:
      "A central hub of calculators and generators for salary negotiation, valuation, comparison, and equity planning.",
    url: "https://avgpay.com/tools",
    type: "website",
  },
};

type Tool = {
  name: string;
  href: string;
  summary: string;
  outcome: string;
  timeToComplete: string;
  icon: ComponentType<{ className?: string }>;
  guideLinks: Array<{ label: string; href: string }>;
  analyzerLinks: Array<{ label: string; href: string }>;
};

type ToolGroup = {
  intent: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
  tools: Tool[];
};

const TOOL_GROUPS: ToolGroup[] = [
  {
    intent: "Negotiation",
    description: "Prepare a stronger ask, structure your narrative, and enter compensation conversations with confidence.",
    icon: Handshake,
    tools: [
      {
        name: "Negotiation Email Generator",
        href: "/tools/negotiation-email",
        summary: "Generate polished counteroffer and follow-up messaging based on your situation.",
        outcome: "A ready-to-send email draft tailored for leverage and tone.",
        timeToComplete: "3-5 min",
        icon: Mail,
        guideLinks: [
          { label: "How to Negotiate Tech Offers", href: "/guides/negotiation" },
          { label: "Startup vs Big Tech Compensation", href: "/guides/startup-vs-bigtech" },
        ],
        analyzerLinks: [{ label: "Offer Analyzer", href: "/analyze-offer" }],
      },
    ],
  },
  {
    intent: "Valuation",
    description: "Break offers into understandable components and estimate real value over time.",
    icon: CandlestickChart,
    tools: [
      {
        name: "Compensation Breakdown Calculator",
        href: "/tools/compensation-breakdown",
        summary: "Split base, equity, bonus, and sign-on into annual and total compensation views.",
        outcome: "A clearer valuation of your package by component.",
        timeToComplete: "5-7 min",
        icon: Calculator,
        guideLinks: [
          { label: "Software Engineer Compensation Guide 2026", href: "/guides/swe-compensation-2026" },
          { label: "PM Compensation Guide 2026", href: "/guides/pm-compensation-2026" },
        ],
        analyzerLinks: [{ label: "Salary Analyzer", href: "/analyze-salary" }],
      },
      {
        name: "Stock Compensation Calculator",
        href: "/tools/stock-calculator",
        summary: "Estimate annualized stock value and understand how grants impact TC.",
        outcome: "A practical stock value estimate for planning and negotiation.",
        timeToComplete: "4-6 min",
        icon: LineChart,
        guideLinks: [
          { label: "Understanding Tech Equity", href: "/guides/equity" },
          { label: "Startup vs Big Tech Compensation", href: "/guides/startup-vs-bigtech" },
        ],
        analyzerLinks: [{ label: "Offer Analyzer", href: "/analyze-offer" }],
      },
      {
        name: "Inflation Calculator",
        href: "/tools/inflation-calculator",
        summary: "Adjust compensation numbers by inflation to compare older offers to today's dollars.",
        outcome: "Normalized salary figures for better long-term decision making.",
        timeToComplete: "2-3 min",
        icon: Target,
        guideLinks: [
          { label: "The Remote Work Pay Cut Myth", href: "/guides/remote-pay" },
          { label: "Software Engineer Compensation Guide 2026", href: "/guides/swe-compensation-2026" },
        ],
        analyzerLinks: [{ label: "Salary Analyzer", href: "/analyze-salary" }],
      },
    ],
  },
  {
    intent: "Comparison",
    description: "Compare market benchmarks and competing offers to select the best path.",
    icon: GitCompare,
    tools: [
      {
        name: "Compare Offers Tool",
        href: "/tools/compare-offers",
        summary: "Evaluate multiple offers side-by-side across salary, equity, bonus, and year-one value.",
        outcome: "A ranked view of your strongest options and trade-offs.",
        timeToComplete: "6-8 min",
        icon: GitCompare,
        guideLinks: [
          { label: "Startup vs Big Tech Compensation", href: "/guides/startup-vs-bigtech" },
          { label: "How to Negotiate Tech Offers", href: "/guides/negotiation" },
        ],
        analyzerLinks: [{ label: "Offer Analyzer", href: "/analyze-offer" }],
      },
      {
        name: "Salary Comparison Calculator",
        href: "/tools/salary-comparison",
        summary: "Benchmark your target compensation against role, location, and market context.",
        outcome: "A grounded comparison you can use in hiring and review cycles.",
        timeToComplete: "4-6 min",
        icon: Briefcase,
        guideLinks: [
          { label: "Software Engineer Compensation Guide 2026", href: "/guides/swe-compensation-2026" },
          { label: "PM Compensation Guide 2026", href: "/guides/pm-compensation-2026" },
        ],
        analyzerLinks: [{ label: "Salary Analyzer", href: "/analyze-salary" }],
      },
      {
        name: "Percentile Calculator",
        href: "/tools/percentile-calculator",
        summary: "Find where your offer sits relative to salary distributions.",
        outcome: "A percentile-based signal for whether to negotiate or accept.",
        timeToComplete: "2-4 min",
        icon: Sparkles,
        guideLinks: [
          { label: "How to Negotiate Tech Offers", href: "/guides/negotiation" },
          { label: "The Remote Work Pay Cut Myth", href: "/guides/remote-pay" },
        ],
        analyzerLinks: [{ label: "Salary Analyzer", href: "/analyze-salary" }],
      },
    ],
  },
  {
    intent: "Equity Planning",
    description: "Model vesting outcomes and understand long-term equity scenarios before committing.",
    icon: LineChart,
    tools: [
      {
        name: "Equity Simulator",
        href: "/tools/equity-simulator",
        summary: "Run equity scenarios using growth assumptions, vesting, and risk profiles.",
        outcome: "A forward-looking view of expected equity outcomes.",
        timeToComplete: "8-10 min",
        icon: LineChart,
        guideLinks: [
          { label: "Understanding Tech Equity", href: "/guides/equity" },
          { label: "Startup vs Big Tech Compensation", href: "/guides/startup-vs-bigtech" },
        ],
        analyzerLinks: [{ label: "Offer Analyzer", href: "/analyze-offer" }],
      },
    ],
  },
];

const FAQS = [
  {
    question: "Which salary tool should I use first?",
    answer:
      "Start with Compare Offers if you already have multiple packages. If you only have one offer, begin with Compensation Breakdown and then use the Offer Analyzer for market context.",
  },
  {
    question: "Are these calculators useful for negotiation prep?",
    answer:
      "Yes. The calculators translate raw offer numbers into expected outcomes, which makes it easier to justify your ask with concrete, data-based reasoning.",
  },
  {
    question: "Can I use these tools for equity-heavy startup offers?",
    answer:
      "Absolutely. Use Stock Compensation Calculator and Equity Simulator together to estimate realistic value ranges and downside/ upside scenarios.",
  },
];

export default function ToolsPage() {
  const flatTools = TOOL_GROUPS.flatMap((group) => group.tools);

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "AvgPay Salary Tools and Calculators",
    itemListElement: flatTools.map((tool, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: tool.name,
      url: `https://avgpay.com${tool.href}`,
      description: tool.summary,
    })),
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <main className="min-h-screen bg-surface-subtle pt-20 pb-14">
      <Script id="tools-itemlist-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      <Script id="tools-faq-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <section className="mb-12 text-center">
          <p className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-subtle text-primary-hover text-sm font-semibold mb-4">
            <Calculator className="w-4 h-4" />
            Salary tools / calculators hub
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-text-primary mb-4">Compensation Tools That Help You Decide Faster</h1>
          <p className="text-lg text-text-secondary max-w-3xl mx-auto">
            Explore every AvgPay calculator and generator in one place. Pick by intent, estimate outcomes quickly, and jump directly to the guides and analyzers that support your next move.
          </p>
        </section>

        <div className="space-y-8">
          {TOOL_GROUPS.map((group) => {
            const GroupIcon = group.icon;
            return (
              <section key={group.intent} className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-surface border border-border flex items-center justify-center">
                    <GroupIcon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-text-primary">{group.intent}</h2>
                    <p className="text-text-secondary">{group.description}</p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {group.tools.map((tool) => {
                    const ToolIcon = tool.icon;
                    return (
                      <Card key={tool.href} className="border-border bg-surface">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between gap-3">
                            <CardTitle className="text-xl text-text-primary flex items-center gap-2">
                              <ToolIcon className="w-5 h-5 text-primary" />
                              {tool.name}
                            </CardTitle>
                            <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-surface-muted text-text-secondary">
                              <Clock3 className="w-3 h-3" />
                              {tool.timeToComplete}
                            </span>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <p className="text-text-secondary text-sm">{tool.summary}</p>
                          <p className="text-sm text-text-secondary">
                            <span className="font-semibold text-text-primary">Expected outcome:</span> {tool.outcome}
                          </p>

                          <div className="text-sm space-y-2">
                            <p className="font-semibold text-text-primary">Related guides</p>
                            <div className="flex flex-wrap gap-2">
                              {tool.guideLinks.map((guide) => (
                                <Link key={guide.href} href={guide.href} className="px-2.5 py-1 rounded bg-surface-muted text-text-secondary hover:bg-surface-muted transition-colors">
                                  {guide.label}
                                </Link>
                              ))}
                            </div>
                          </div>

                          <div className="text-sm space-y-2">
                            <p className="font-semibold text-text-primary">Analyzer flows</p>
                            <div className="flex flex-wrap gap-2">
                              {tool.analyzerLinks.map((analyzer) => (
                                <Link
                                  key={analyzer.href}
                                  href={analyzer.href}
                                  className="px-2.5 py-1 rounded bg-primary-subtle text-primary-hover hover:bg-primary-subtle transition-colors"
                                >
                                  {analyzer.label}
                                </Link>
                              ))}
                            </div>
                          </div>

                          <Link href={tool.href} className="inline-flex items-center gap-1.5 text-primary-hover font-semibold hover:text-success-foreground">
                            Open tool
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>

        <section className="mt-14 bg-surface border border-border rounded-xl p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-text-primary mb-5">Salary Tools FAQ</h2>
          <div className="space-y-4">
            {FAQS.map((faq) => (
              <div key={faq.question} className="border-b border-surface-muted pb-4 last:border-none last:pb-0">
                <h3 className="font-semibold text-text-primary mb-1">{faq.question}</h3>
                <p className="text-text-secondary">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
