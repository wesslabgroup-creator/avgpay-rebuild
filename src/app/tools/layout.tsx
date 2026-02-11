import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";

const TOOL_QUICKLINKS = [
  { href: "/tools/negotiation-email", label: "Negotiation Email Generator" },
  { href: "/tools/compensation-breakdown", label: "Compensation Breakdown Calculator" },
  { href: "/tools/compare-offers", label: "Compare Offers Tool" },
  { href: "/tools/stock-calculator", label: "Stock Compensation Calculator" },
  { href: "/tools/equity-simulator", label: "Equity Growth Simulator" },
  { href: "/tools/percentile-calculator", label: "Salary Percentile Calculator" },
];

const GUIDE_LINKS = [
  { href: "/guides/negotiation", label: "Salary Negotiation Guide" },
  { href: "/guides/equity", label: "Equity Compensation Guide" },
  { href: "/guides/startup-vs-bigtech", label: "Startup vs Big Tech Compensation" },
];

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="mx-auto w-full max-w-6xl px-4 pt-6 sm:px-6">
        <Breadcrumbs items={[{ label: "Tools", href: "/tools" }]} />
      </div>
      {children}
      <section className="bg-white border-y border-slate-200">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <h2 className="text-2xl font-bold text-slate-900">Next best pages for compensation planning</h2>
          <p className="mt-2 text-slate-600">Move from calculators to market benchmarks and negotiation prep in one click.</p>
          <div className="mt-6 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {TOOL_QUICKLINKS.map((link) => (
              <Link key={link.href} href={link.href} className="rounded-lg border border-slate-200 p-4 font-medium text-slate-700 hover:border-emerald-300 hover:text-emerald-700">
                {link.label}
              </Link>
            ))}
          </div>
          <div className="mt-8 rounded-xl bg-slate-50 p-5">
            <h3 className="font-semibold text-slate-900">Pair tools with strategy guides</h3>
            <div className="mt-3 flex flex-wrap gap-3">
              {GUIDE_LINKS.map((link) => (
                <Link key={link.href} href={link.href} className="text-sm text-emerald-700 hover:underline">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
