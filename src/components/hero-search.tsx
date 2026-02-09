"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X, Briefcase, Building2 } from "lucide-react";
import Link from "next/link";

interface SearchSuggestion {
  type: "role" | "company";
  value: string;
  display: string;
}

export function HeroSearch() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [allData, setAllData] = useState<{ roles: string[]; companies: string[] }>({ roles: [], companies: [] });
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/analyzer-data");
        const data = await response.json();
        setAllData({
          roles: data.roles || [],
          companies: data.companies || [],
        });
      } catch (error) {
        console.error("Failed to fetch search data:", error);
      }
    };
    fetchData();
  }, []);

  // Filter suggestions as user types
  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const filteredRoles = allData.roles
      .filter((role) => role.toLowerCase().includes(lowerQuery))
      .slice(0, 5)
      .map((role) => ({ type: "role" as const, value: role, display: role }));

    const filteredCompanies = allData.companies
      .filter((company) => company.toLowerCase().includes(lowerQuery))
      .slice(0, 5)
      .map((company) => ({ type: "company" as const, value: company, display: company }));

    setSuggestions([...filteredRoles, ...filteredCompanies]);
  }, [query, allData]);

  const clearSearch = () => {
    setQuery("");
    setSuggestions([]);
    inputRef.current?.focus();
  };

  const handleSelect = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.display);
    setIsOpen(false);
    setSuggestions([]);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search job titles or companies..."
          className="w-full pl-12 pr-12 py-4 text-lg bg-white border-2 border-slate-200 rounded-2xl focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all shadow-lg"
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

      {/* Suggestions Dropdown */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-50">
          {suggestions.map((suggestion, index) => (
            <Link
              key={`${suggestion.type}-${index}`}
              href={
                suggestion.type === "role"
                  ? `/salaries?role=${encodeURIComponent(suggestion.value)}`
                  : `/companies/${encodeURIComponent(suggestion.value)}`
              }
              onClick={() => handleSelect(suggestion)}
              className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-b-0"
            >
              {suggestion.type === "role" ? (
                <Briefcase className="w-4 h-4 text-emerald-500" />
              ) : (
                <Building2 className="w-4 h-4 text-blue-500" />
              )}
              <div>
                <span className="font-medium text-slate-900">{suggestion.display}</span>
                <span className="ml-2 text-xs text-slate-400 capitalize">{suggestion.type}</span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Quick Links */}
      {isOpen && query.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-50 p-4">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Popular Searches</p>
          <div className="flex flex-wrap gap-2">
            {["Software Engineer", "Product Manager", "Data Scientist", "Google", "Meta", "Amazon"].map((item) => (
              <button
                key={item}
                onClick={() => {
                  setQuery(item);
                  setIsOpen(false);
                }}
                className="px-3 py-1.5 text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full transition-colors"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
