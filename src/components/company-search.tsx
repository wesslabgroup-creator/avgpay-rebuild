"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X, Building2 } from "lucide-react";
import Link from "next/link";

interface Company {
  id: string;
  name: string;
  slug: string;
  salaryCount?: number;
}

export function CompanySearch() {
  const [query, setQuery] = useState("");
  const [companies, setCompanies] = useState<Company[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch companies on mount
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await fetch("/api/analyzer-data", { cache: 'no-store' });
        const data = await response.json();
        const companyList = (data.companies || []).map((name: string, index: number) => ({
          id: index.toString(),
          name,
          slug: name.toLowerCase().replace(/\s+/g, "-"),
        }));
        setCompanies(companyList);
        setFilteredCompanies(companyList);
      } catch (error) {
        console.error("Failed to fetch companies:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  // Filter companies as user types
  useEffect(() => {
    if (query.length === 0) {
      setFilteredCompanies(companies);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const filtered = companies.filter((company) =>
      company.name.toLowerCase().includes(lowerQuery)
    );
    setFilteredCompanies(filtered);
  }, [query, companies]);

  const clearSearch = () => {
    setQuery("");
    setFilteredCompanies(companies);
    inputRef.current?.focus();
  };

  return (
    <div className="space-y-6">
      {/* Search Input */}
      <div className="relative max-w-md mx-auto">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search companies..."
          className="w-full pl-12 pr-12 py-3 bg-white border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Company Grid */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-emerald-500 border-t-transparent mx-auto"></div>
          <p className="text-slate-500 mt-4">Loading companies...</p>
        </div>
      ) : filteredCompanies.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCompanies.map((company) => (
            <Link
              key={company.id}
              href={`/company/${encodeURIComponent(company.name)}`}
              className="group p-6 rounded-xl bg-white border border-slate-200 hover:border-emerald-500 hover:shadow-lg transition-all"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                    {company.name}
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">
                    View salary data →
                  </p>
                </div>
                <Building2 className="w-8 h-8 text-slate-300 group-hover:text-emerald-500 transition-colors" />
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-slate-500">No companies found matching &quot;{query}&quot;</p>
        </div>
      )}

      {/* Results Count */}
      {!isLoading && (
        <p className="text-center text-sm text-slate-500">
          Showing {filteredCompanies.length} of {companies.length} companies
        </p>
      )}
    </div>
  );
}
