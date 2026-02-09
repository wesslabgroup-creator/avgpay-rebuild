import { Metadata } from "next";
import { SalarySearch } from "@/components/salary-search";

export const metadata: Metadata = {
  title: "Salaries | AvgPay",
  description: "Search and compare tech salaries by job title. Real data from BLS, H-1B filings, and pay transparency laws.",
};

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
      </div>
    </main>
  );
}
