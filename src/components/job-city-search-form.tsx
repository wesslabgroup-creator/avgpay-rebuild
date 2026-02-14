"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, ArrowRight, X } from "lucide-react";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function JobCitySearchForm() {
  const router = useRouter();
  const [jobTitle, setJobTitle] = useState("");
  const [city, setCity] = useState("");
  const [jobSuggestions, setJobSuggestions] = useState<string[]>([]);
  const [citySuggestions, setCitySuggestions] = useState<string[]>([]);
  const [showJobDropdown, setShowJobDropdown] = useState(false);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [allData, setAllData] = useState<{ roles: string[]; locations: string[] }>({ roles: [], locations: [] });
  const jobRef = useRef<HTMLDivElement>(null);
  const cityRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/analyzer-data", { cache: "no-store" });
        const data = await response.json();
        setAllData({ roles: data.roles || [], locations: data.locations || [] });
      } catch {
        // Silently fail
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (jobRef.current && !jobRef.current.contains(e.target as Node)) setShowJobDropdown(false);
      if (cityRef.current && !cityRef.current.contains(e.target as Node)) setShowCityDropdown(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function filterJobs(query: string): string[] {
    if (query.length < 2) return [];
    const lower = query.toLowerCase();
    return allData.roles.filter((r) => r.toLowerCase().includes(lower)).slice(0, 6);
  }

  function filterCities(query: string): string[] {
    if (query.length < 2) return [];
    const lower = query.toLowerCase();
    return allData.locations.filter((l) => l.toLowerCase().includes(lower)).slice(0, 6);
  }

  function handleSearch() {
    if (!jobTitle.trim()) return;
    const jobSlug = slugify(jobTitle.trim());
    if (city.trim()) {
      const citySlug = slugify(city.trim());
      router.push(`/jobs/${jobSlug}/${citySlug}`);
    } else {
      router.push(`/jobs/${jobSlug}`);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      handleSearch();
    }
  }

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-lg p-6 md:p-8">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-end">
        {/* Job Title */}
        <div ref={jobRef} className="relative">
          <label className="block text-sm font-semibold text-slate-700 mb-2">Job Title</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => {
                setJobTitle(e.target.value);
                setJobSuggestions(filterJobs(e.target.value));
                setShowJobDropdown(true);
              }}
              onFocus={() => { if (jobTitle.length >= 2) setShowJobDropdown(true); }}
              onKeyDown={handleKeyDown}
              placeholder="e.g. Software Engineer"
              className="w-full pl-10 pr-8 py-3 text-sm bg-white border border-slate-200 rounded-xl focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/10"
            />
            {jobTitle && (
              <button onClick={() => { setJobTitle(""); setJobSuggestions([]); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          {showJobDropdown && jobSuggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-lg border border-slate-200 z-50 max-h-48 overflow-y-auto">
              {jobSuggestions.map((s, i) => (
                <button
                  key={`job-${i}`}
                  onClick={() => { setJobTitle(s); setShowJobDropdown(false); }}
                  className="w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50 flex items-center gap-2"
                >
                  <Search className="w-3 h-3 text-slate-400" />
                  <span className="text-slate-900">{s}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* "in" connector */}
        <div className="flex items-end justify-center pb-3">
          <span className="text-lg font-bold text-slate-400">in</span>
        </div>

        {/* City */}
        <div ref={cityRef} className="relative">
          <label className="block text-sm font-semibold text-slate-700 mb-2">City</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={city}
              onChange={(e) => {
                setCity(e.target.value);
                setCitySuggestions(filterCities(e.target.value));
                setShowCityDropdown(true);
              }}
              onFocus={() => { if (city.length >= 2) setShowCityDropdown(true); }}
              onKeyDown={handleKeyDown}
              placeholder="e.g. Seattle, WA"
              className="w-full pl-10 pr-8 py-3 text-sm bg-white border border-slate-200 rounded-xl focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/10"
            />
            {city && (
              <button onClick={() => { setCity(""); setCitySuggestions([]); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          {showCityDropdown && citySuggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-lg border border-slate-200 z-50 max-h-48 overflow-y-auto">
              {citySuggestions.map((s, i) => (
                <button
                  key={`city-${i}`}
                  onClick={() => { setCity(s); setShowCityDropdown(false); }}
                  className="w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50 flex items-center gap-2"
                >
                  <MapPin className="w-3 h-3 text-slate-400" />
                  <span className="text-slate-900">{s}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Search button */}
      <button
        onClick={handleSearch}
        disabled={!jobTitle.trim()}
        className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 font-semibold text-white hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Search salaries
        <ArrowRight className="h-4 w-4" />
      </button>

      <p className="mt-3 text-center text-xs text-slate-400">
        Enter a job title to see salary data. Add a city for location-specific results.
      </p>
    </div>
  );
}
