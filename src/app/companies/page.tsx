import { Metadata } from "next";
import Link from "next/link";
import { COMPANIES } from "@/lib/data"; // Import COMPANIES constant

export const metadata: Metadata = {
  title: "Companies | AvgPay",
  description: "Explore salary data across top tech companies.",
};

export default function CompaniesPage() {
  // Sort companies alphabetically for better UX
  const sortedCompanies = [...COMPANIES].sort();

  return (
    <main className="min-h-screen bg-slate-950">
      
      <div className="px-6 py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-slate-100">Companies</h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Discover salary insights across leading technology companies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedCompanies.map((company) => (
              <Link key={company} href={`/company/${encodeURIComponent(company)}`}>
                <div className="p-6 rounded-lg bg-slate-900/50 border border-slate-800 hover:border-indigo-500 transition-colors cursor-pointer">
                  <h2 className="text-2xl font-bold text-slate-100 mb-2">{company}</h2>
                  <p className="text-sm text-slate-400">View salary data</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
