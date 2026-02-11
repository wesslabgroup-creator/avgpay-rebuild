import { Metadata } from "next";
import Link from "next/link";
import { SalarySearch } from "@/components/salary-search";
import { slugify } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Salaries | AvgPay",
  description: "Search and compare tech salaries by job title. Real data from BLS, H-1B filings, and pay transparency laws.",
};

const popularReports = [
  { role: "Software Engineer", location: "San Francisco, CA" },
  { role: "Product Manager", location: "New York, NY" },
  { role: "Data Scientist", location: "Seattle, WA" },
  { role: "Product Designer", location: "Austin, TX" },
  { role: "Engineering Manager", location: "San Francisco, CA" },
  { role: "Software Engineer", location: "Remote" },
];

const nextStepLinks = [
  {
    href: "/compare",
    title: "Compare top company-role combinations",
    description: "Move from market benchmarks to side-by-side comp paths in one click.",
  },
  {
    href: "/tools/salary-comparison",
    title: "Run the salary comparison calculator",
    description: "Estimate offer strength with role, location, and compensation context.",
  },
  {
    href: "/guides/swe-compensation-2026",
    title: "Read the engineering salary guide",
    description: "Use a negotiation-ready benchmark before your next review or offer call.",
  },
  {
    href: "/analyze-salary",
    title: "Analyze your current salary",
    description: "See whether your current package tracks with the broader tech market.",
  },
];

export default function SalariesPage() {
  return (
    <main className="min-h-screen bg-slate-50 pt-24 pb-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center space-y-4 mb-10">
          <h1 className="text-4xl font-bold text-slate-900">Tech Salaries</h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Search job titles to see real salary data. All data aggregated from BLS, H-1B filings, and state pay transparency laws.
          </p>
        </div>

        <SalarySearch />

        <div className="mt-16 border-t border-slate-200 pt-16">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">Popular Salary Reports</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularReports.map((report) => (
              <Link
                key={`${report.role}-${report.location}`}
                href={`/salaries/${slugify(report.role)}/${slugify(report.location)}`}
                className="group p-5 bg-white border border-slate-200 rounded-2xl hover:border-emerald-500 hover:shadow-md transition-all"
              >
                <h3 className="font-bold text-slate-900 group-hover:text-emerald-600 mb-1">{report.role}</h3>
                <p className="text-slate-500 text-sm flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
                  {report.location}
                </p>
              </Link>
            ))}
          </div>
        </div>

        <section className="mt-16 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-3">Related pages to keep your salary research moving</h2>
          <p className="text-slate-600 mb-6">
            Use these next steps to validate your benchmark, compare paths, and turn salary data into a stronger compensation outcome.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {nextStepLinks.map((link) => (
              <Link key={link.href} href={link.href} className="rounded-xl border border-slate-200 p-4 hover:border-emerald-300 hover:bg-emerald-50/30 transition-colors">
                <p className="font-semibold text-slate-900">{link.title}</p>
                <p className="text-sm text-slate-600 mt-1">{link.description}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
