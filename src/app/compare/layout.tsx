import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";

export default function CompareLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="mx-auto w-full max-w-6xl px-4 pt-6 sm:px-6">
        <Breadcrumbs items={[{ label: "Compare Offers", href: "/compare" }]} />
      </div>
      {children}
      <section className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <h2 className="text-2xl font-bold text-slate-900">Keep your comparison momentum</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <Link href="/analyze-offer" className="rounded-lg border border-slate-200 bg-white p-4 font-semibold text-slate-800 hover:border-emerald-300 hover:text-emerald-700">Analyze this offer with personalized benchmarks</Link>
            <Link href="/tools/compare-offers" className="rounded-lg border border-slate-200 bg-white p-4 font-semibold text-slate-800 hover:border-emerald-300 hover:text-emerald-700">Use the Compare Offers calculator</Link>
            <Link href="/guides/negotiation" className="rounded-lg border border-slate-200 bg-white p-4 font-semibold text-slate-800 hover:border-emerald-300 hover:text-emerald-700">Read the salary negotiation playbook</Link>
            <Link href="/salaries" className="rounded-lg border border-slate-200 bg-white p-4 font-semibold text-slate-800 hover:border-emerald-300 hover:text-emerald-700">Explore salary ranges by role and location</Link>
          </div>
        </div>
      </section>
    </>
  );
}
