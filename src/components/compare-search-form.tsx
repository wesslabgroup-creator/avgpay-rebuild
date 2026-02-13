"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowRight, X } from "lucide-react";

interface SearchItem {
  type: "role" | "company";
  value: string;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function CompareSearchForm() {
  const router = useRouter();
  const [entityA, setEntityA] = useState("");
  const [entityB, setEntityB] = useState("");
  const [suggestionsA, setSuggestionsA] = useState<SearchItem[]>([]);
  const [suggestionsB, setSuggestionsB] = useState<SearchItem[]>([]);
  const [showDropdownA, setShowDropdownA] = useState(false);
  const [showDropdownB, setShowDropdownB] = useState(false);
  const [allData, setAllData] = useState<{ roles: string[]; companies: string[] }>({ roles: [], companies: [] });
  const refA = useRef<HTMLDivElement>(null);
  const refB = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/analyzer-data", { cache: "no-store" });
        const data = await response.json();
        setAllData({ roles: data.roles || [], companies: data.companies || [] });
      } catch {
        // Silently fail
      }
    };
    fetchData();
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (refA.current && !refA.current.contains(e.target as Node)) setShowDropdownA(false);
      if (refB.current && !refB.current.contains(e.target as Node)) setShowDropdownB(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function filterSuggestions(query: string): SearchItem[] {
    if (query.length < 2) return [];
    const lower = query.toLowerCase();
    const roles = allData.roles
      .filter((r) => r.toLowerCase().includes(lower))
      .slice(0, 5)
      .map((r) => ({ type: "role" as const, value: r }));
    const companies = allData.companies
      .filter((c) => c.toLowerCase().includes(lower))
      .slice(0, 5)
      .map((c) => ({ type: "company" as const, value: c }));
    return [...roles, ...companies];
  }

  function handleCompare() {
    if (!entityA.trim() || !entityB.trim()) return;
    const slugA = slugify(entityA.trim());
    const slugB = slugify(entityB.trim());
    router.push(`/compare/${slugA}-vs-${slugB}`);
  }

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-lg p-6 md:p-8">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-end">
        {/* Entity A */}
        <div ref={refA} className="relative">
          <label className="block text-sm font-semibold text-slate-700 mb-2">Job, Company, or City A</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={entityA}
              onChange={(e) => {
                setEntityA(e.target.value);
                setSuggestionsA(filterSuggestions(e.target.value));
                setShowDropdownA(true);
              }}
              onFocus={() => setShowDropdownA(true)}
              placeholder="e.g. Software Engineer"
              className="w-full pl-10 pr-8 py-3 text-sm bg-white border border-slate-200 rounded-xl focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/10"
            />
            {entityA && (
              <button onClick={() => { setEntityA(""); setSuggestionsA([]); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          {showDropdownA && suggestionsA.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-lg border border-slate-200 z-50 max-h-48 overflow-y-auto">
              {suggestionsA.map((s, i) => (
                <button
                  key={`${s.type}-${i}`}
                  onClick={() => { setEntityA(s.value); setShowDropdownA(false); }}
                  className="w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50 flex items-center gap-2"
                >
                  <span className="text-xs text-slate-400 capitalize">{s.type}</span>
                  <span className="text-slate-900">{s.value}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* VS badge */}
        <div className="flex items-end justify-center pb-3">
          <span className="text-lg font-bold text-slate-400">vs</span>
        </div>

        {/* Entity B */}
        <div ref={refB} className="relative">
          <label className="block text-sm font-semibold text-slate-700 mb-2">Job, Company, or City B</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={entityB}
              onChange={(e) => {
                setEntityB(e.target.value);
                setSuggestionsB(filterSuggestions(e.target.value));
                setShowDropdownB(true);
              }}
              onFocus={() => setShowDropdownB(true)}
              placeholder="e.g. Product Manager"
              className="w-full pl-10 pr-8 py-3 text-sm bg-white border border-slate-200 rounded-xl focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/10"
            />
            {entityB && (
              <button onClick={() => { setEntityB(""); setSuggestionsB([]); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          {showDropdownB && suggestionsB.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-lg border border-slate-200 z-50 max-h-48 overflow-y-auto">
              {suggestionsB.map((s, i) => (
                <button
                  key={`${s.type}-${i}`}
                  onClick={() => { setEntityB(s.value); setShowDropdownB(false); }}
                  className="w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50 flex items-center gap-2"
                >
                  <span className="text-xs text-slate-400 capitalize">{s.type}</span>
                  <span className="text-slate-900">{s.value}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Compare button */}
      <button
        onClick={handleCompare}
        disabled={!entityA.trim() || !entityB.trim()}
        className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 font-semibold text-white hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Compare salaries
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}
