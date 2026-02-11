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
        const response = await fetch("/api/salaries?view=role_global");
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
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search job titles (e.g., Software Engineer, Product Manager)..."
          className="w-full pl-12 pr-12 py-4 text-lg bg-surface border-2 border-border rounded-2xl focus:border-primary focus:outline-none focus:ring-4 focus:ring-ring/10 transition-all shadow-sm"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-text-muted hover:text-text-secondary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Results Count */}
      {!isLoading && (
        <p className="text-center text-sm text-text-muted">
          Showing {filteredJobs.length} of {allJobs.length} job titles
        </p>
      )}

      {/* Quick Filters */}
      <div className="flex flex-wrap justify-center gap-2">
        {["Engineer", "Manager", "Designer", "Analyst", "Director"].map((term) => (
          <button
            key={term}
            onClick={() => setQuery(term)}
            className="px-3 py-1.5 text-sm bg-surface-muted hover:bg-surface-muted text-text-secondary rounded-full transition-colors"
          >
            {term}
          </button>
        ))}
      </div>

      {/* Results Table */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mx-auto"></div>
          <p className="text-text-muted mt-4">Loading salaries...</p>
        </div>
      ) : filteredJobs.length > 0 ? (
        <div className="bg-surface rounded-xl border border-border overflow-hidden">
          <table className="w-full">
            <thead className="bg-surface-subtle border-b border-border">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-text-secondary">Job Title</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-text-secondary">Range</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-text-secondary">Median</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-text-secondary">Data Points</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredJobs.map((job, index) => (
                <tr key={index} className="hover:bg-surface-subtle transition-colors">
                  <td className="px-6 py-4">
                    <Link
                      href={`/jobs/${encodeURIComponent(job.groupKey)}`}
                      className="flex items-center gap-2 text-primary hover:text-primary-hover font-medium transition-colors"
                    >
                      <Briefcase className="w-4 h-4" />
                      {job.groupKey}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-text-secondary">
                    {formatCurrency(job.minComp)} - {formatCurrency(job.maxComp)}
                  </td>
                  <td className="px-6 py-4 font-semibold text-text-primary">
                    {formatCurrency(job.medianTotalComp)}
                  </td>
                  <td className="px-6 py-4 text-text-muted">
                    {job.count.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-text-muted">No job titles found matching &quot;{query}&quot;</p>
        </div>
      )}
    </div>
  );
}
