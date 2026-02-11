import { Metadata } from "next";
import { CompanySearch } from "@/components/company-search";

export const metadata: Metadata = {
  title: "Companies | AvgPay",
  description: "Explore salary data across top tech companies. Search and compare compensation across the industry.",
};

export default function CompaniesPage() {
  return (
    <main className="min-h-screen bg-surface-subtle">
      <div className="px-6 py-12">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-text-primary">Companies</h1>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto">
              Discover salary insights across leading technology companies. Search to find specific employers.
            </p>
          </div>

          <CompanySearch />
        </div>
      </div>
    </main>
  );
}
