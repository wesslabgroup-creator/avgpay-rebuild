import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { generatePageMeta } from "@/lib/meta";
import { FAQSchema } from "@/components/schema-markup";

export const metadata = generatePageMeta({
  title: "Salary Tools",
  description:
    "Use compensation calculators and planning tools to compare offers, model equity, adjust for inflation, and negotiate a better package.",
  path: "/tools",
});

const tools = [
  {
    name: "Offer Comparison",
    description:
      "Break down competing offers by base, bonus, equity, and vesting to pick the strongest long-term package.",
    href: "/tools/compare-offers",
    cta: "Compare Offers",
  },
  {
    name: "Compensation Breakdown",
    description:
      "Convert annual compensation into monthly take-home components so you can evaluate true day-to-day value.",
    href: "/tools/compensation-breakdown",
    cta: "Break Down Pay",
  },
  {
    name: "Inflation Calculator",
    description:
      "Measure real wage growth using inflation-adjusted dollars and avoid misleading nominal salary increases.",
    href: "/tools/inflation-calculator",
    cta: "Adjust for Inflation",
  },
  {
    name: "Percentile Calculator",
    description:
      "See where your compensation falls in the market and identify realistic negotiation targets.",
    href: "/tools/percentile-calculator",
    cta: "Find Percentile",
  },
  {
    name: "Salary Comparison",
    description:
      "Compare roles, locations, and level bands side by side before making a career move.",
    href: "/tools/salary-comparison",
    cta: "Compare Salaries",
  },
  {
    name: "Equity Simulator",
    description:
      "Model dilution, growth scenarios, and vesting outcomes to understand startup equity upside.",
    href: "/tools/equity-simulator",
    cta: "Simulate Equity",
  },
  {
    name: "Stock Calculator",
    description:
      "Project stock-based compensation outcomes under conservative, base, and upside price scenarios.",
    href: "/tools/stock-calculator",
    cta: "Model Stock Value",
  },
  {
    name: "Negotiation Email Generator",
    description:
      "Generate structured, respectful negotiation messages backed by data from your market benchmark.",
    href: "/tools/negotiation-email",
    cta: "Draft Email",
  },
];

const faqItems = [
  {
    question: "Which tool should I start with?",
    answer:
      "Start with Offer Comparison if you have multiple offers, or Percentile Calculator if you need to benchmark a single offer before negotiating.",
  },
  {
    question: "Are these tools based on real salary data?",
    answer:
      "Yes. AvgPay tools use salary benchmarks built from BLS, H-1B, and pay transparency datasets plus community submissions.",
  },
  {
    question: "Can I use these tools without creating an account?",
    answer:
      "Yes. Most tools are available instantly without signup so you can evaluate compensation quickly and privately.",
  },
];

export default function ToolsPage() {
  return (
    <main className="min-h-screen bg-white px-4 py-12 md:py-16">
      <FAQSchema items={faqItems} />
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="space-y-4 text-center md:text-left">
          <h1 className="text-4xl font-black tracking-tight text-slate-900 md:text-5xl">Compensation Tools</h1>
          <p className="max-w-3xl text-lg leading-relaxed text-slate-700">
            Use practical calculators to make better career decisions, strengthen your negotiation strategy, and avoid accepting below-market pay.
          </p>
        </header>

        <section className="grid gap-5 md:grid-cols-2">
          {tools.map((tool) => (
            <Card key={tool.href} className="flex h-full flex-col justify-between border border-slate-200 p-6">
              <div className="space-y-3">
                <h2 className="text-2xl font-bold text-slate-900">{tool.name}</h2>
                <p className="text-slate-700 leading-relaxed">{tool.description}</p>
              </div>
              <Link href={tool.href} className="mt-6 block">
                <Button className="w-full bg-slate-900 text-white hover:bg-slate-800">{tool.cta}</Button>
              </Link>
            </Card>
          ))}
        </section>

        <section className="rounded-2xl border border-slate-200 p-6 md:p-8">
          <h2 className="text-2xl font-bold text-slate-900">How to use this toolkit</h2>
          <ol className="mt-4 space-y-3 list-decimal pl-5 text-slate-700">
            <li>Benchmark your current package with the Percentile Calculator.</li>
            <li>Estimate realistic upside with Equity Simulator or Stock Calculator.</li>
            <li>Use Offer Comparison to choose between final offers.</li>
            <li>Generate a clear, data-backed negotiation email before you respond.</li>
          </ol>
        </section>
      </div>
    </main>
  );
}
