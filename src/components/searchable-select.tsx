"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";

interface SearchableSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  required?: boolean;
}

export function SearchableSelect({
  label,
  value,
  onChange,
  options,
  placeholder = "Search...",
  required = false,
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [filteredOptions, setFilteredOptions] = useState<string[]>(options);
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter options as user types
  useEffect(() => {
    if (!query) {
      setFilteredOptions(options);
      return;
    }
    const lowerQuery = query.toLowerCase();
    setFilteredOptions(
      options.filter((opt) => opt.toLowerCase().includes(lowerQuery))
    );
  }, [query, options]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option: string) => {
    onChange(option);
    setQuery("");
    setIsOpen(false);
  };

  const clearSelection = () => {
    onChange("");
    setQuery("");
  };

  return (
    <div ref={containerRef} className="space-y-2">
      <label className="block text-sm font-medium text-slate-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        {value ? (
          <div className="flex items-center justify-between w-full px-4 py-3 bg-white border border-slate-200 rounded-xl">
            <span className="text-slate-900">{value}</span>
            <button
              onClick={clearSelection}
              className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center justify-between w-full px-4 py-3 bg-white border border-slate-200 rounded-xl hover:border-emerald-500 transition-colors text-left"
          >
            <span className="text-slate-400">{placeholder}</span>
            <Search className="w-4 h-4 text-slate-400" />
          </button>
        )}

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden">
            <div className="p-2 border-b border-slate-100">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type to search..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                autoFocus
              />
            </div>
            <div className="max-h-60 overflow-y-auto">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleSelect(option)}
                    className="w-full text-left px-4 py-2.5 hover:bg-slate-50 transition-colors text-slate-700"
                  >
                    {option}
                  </button>
                ))
              ) : (
                <div className="px-4 py-3 text-slate-400 text-sm">
                  No matches found
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
