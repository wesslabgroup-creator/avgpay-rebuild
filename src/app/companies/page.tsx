import { Metadata } from "next";
import Link from "next/link";
import { CompanySearch } from "@/components/company-search";

export const metadata: Metadata = {
  title: "Companies | AvgPay",
  description: "Explore salary data across top tech companies. Search and compare compensation across the industry.",
};

const discoveryLinks = [
  {
    href: "/compare",
    label: "Company vs company compensation comparisons",
    description: "Jump to curated side-by-side offer and pay trajectory breakdowns.",
  },
  {
    href: "/guides/startup-vs-bigtech",
    label: "Startup vs Big Tech compensation guide",
    description: "Understand risk-adjusted upside before picking your next company stage.",
  },
  {
    href: "/tools/compare-offers",
    label: "Compare offers calculator",
    description: "Model salary, equity, and bonus trade-offs before you choose.",
  },
  {
    href: "/submit",
    label: "Submit salary data",
    description: "Help improve benchmark coverage and strengthen data quality for your peers.",
  },
];

export default function CompaniesPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="px-6 py-12">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-slate-900">Companies</h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Discover salary insights across leading technology companies. Search to find specific employers.
            </p>
          </div>

          <CompanySearch />

          <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-3">Keep exploring compensation by company</h2>
            <p className="text-slate-600 mb-6">
              After finding a company page, use these links to compare options, pressure-test offers, and build a stronger negotiation narrative.
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              {discoveryLinks.map((link) => (
                <Link key={link.href} href={link.href} className="rounded-xl border border-slate-200 p-4 hover:border-emerald-300 hover:bg-emerald-50/30 transition-colors">
                  <p className="font-semibold text-slate-900">{link.label}</p>
                  <p className="text-sm text-slate-600 mt-1">{link.description}</p>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
