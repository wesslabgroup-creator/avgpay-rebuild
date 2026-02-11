"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X, Briefcase } from "lucide-react";
import Link from "next/link";

interface JobResult {
  groupKey: string;
  medianTotalComp: number;
  minComp: number;
  maxComp: number;
  count: number;
}

interface SalarySearchProps {
  onResultsChange?: (results: JobResult[]) => void;
}

export function SalarySearch({ onResultsChange }: SalarySearchProps) {
  const [query, setQuery] = useState("");
  const [allJobs, setAllJobs] = useState<JobResult[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<JobResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch all jobs on mount
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch(`/api/salaries?view=role_global&t=${Date.now()}`, {
          cache: "no-store",
        });
        const data = await response.json();
        setAllJobs(data);
        setFilteredJobs(data);
        onResultsChange?.(data);
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchJobs();
  }, [onResultsChange]);

  // Filter jobs as user types
  useEffect(() => {
    if (query.length === 0) {
      setFilteredJobs(allJobs);
      onResultsChange?.(allJobs);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const filtered = allJobs.filter((job) =>
      job.groupKey.toLowerCase().includes(lowerQuery)
    );
    setFilteredJobs(filtered);
    onResultsChange?.(filtered);
  }, [query, allJobs, onResultsChange]);

  const clearSearch = () => {
    setQuery("");
    setFilteredJobs(allJobs);
    onResultsChange?.(allJobs);
    inputRef.current?.focus();
  };

  const formatCurrency = (n: number) => `$${(n / 1000).toFixed(0)}k`;

  return (
    <div className="space-y-6">
      {/* Search Input */}
      <div className="relative max-w-xl mx-auto">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search job titles (e.g., Software Engineer, Product Manager)..."
          className="w-full pl-12 pr-12 py-4 text-lg bg-white border-2 border-slate-200 rounded-2xl focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all shadow-sm"
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

      {/* Results Count */}
      {!isLoading && (
        <p className="text-center text-sm text-slate-500">
          Showing {filteredJobs.length} of {allJobs.length} job titles
        </p>
      )}

      {/* Quick Filters */}
      <div className="flex flex-wrap justify-center gap-2">
        {["Engineer", "Manager", "Designer", "Analyst", "Director"].map((term) => (
          <button
            key={term}
            onClick={() => setQuery(term)}
            className="px-3 py-1.5 text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full transition-colors"
          >
            {term}
          </button>
        ))}
      </div>

      {/* Results Table */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-emerald-500 border-t-transparent mx-auto"></div>
          <p className="text-slate-500 mt-4">Loading salaries...</p>
        </div>
      ) : filteredJobs.length > 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">Job Title</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">Range</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">Median</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">Data Points</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredJobs.map((job, index) => (
                <tr key={index} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <Link
                      href={`/jobs/${encodeURIComponent(job.groupKey)}`}
                      className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
                    >
                      <Briefcase className="w-4 h-4" />
                      {job.groupKey}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {formatCurrency(job.minComp)} - {formatCurrency(job.maxComp)}
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-900">
                    {formatCurrency(job.medianTotalComp)}
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {job.count.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-slate-500">No job titles found matching &quot;{query}&quot;</p>
        </div>
      )}
    </div>
  );
}
