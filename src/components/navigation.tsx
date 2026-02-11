"use client";

import Link from "next/link";
import { useState } from "react";

const PRIMARY_LINKS = [
  { href: "/salaries", label: "Salaries" },
  { href: "/companies", label: "Companies" },
  { href: "/compare", label: "Compare" },
  { href: "/tools", label: "Tools" },
  { href: "/guides", label: "Guides" },
  { href: "/pricing", label: "Pricing" },
];

const SECONDARY_LINKS = [
  { href: "/tools/negotiation-email", label: "Negotiation Email Tool" },
  { href: "/tools/compensation-breakdown", label: "Comp Breakdown Calculator" },
  { href: "/guides/negotiation", label: "Negotiation Guide" },
  { href: "/guides/equity", label: "Equity Guide" },
];

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <nav className="fixed left-0 right-0 top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <Link
            href="/"
            className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent hover:scale-105 transition-all"
          >
            AvgPay
          </Link>

          <div className="hidden md:flex items-center gap-2">
            {PRIMARY_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-slate-600 hover:text-slate-900 font-medium px-3 py-2 rounded-md transition-colors hover:bg-slate-50"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/submit"
              className="text-emerald-700 hover:text-emerald-800 font-medium px-3 py-2 rounded-md transition-colors hover:bg-emerald-50"
            >
              Submit Data
            </Link>
            <Link
              href="/analyze-offer"
              className="ml-1 px-5 py-2.5 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition-all shadow-md hover:shadow-lg"
            >
              Analyze Offer
            </Link>
          </div>

          <button
            onClick={() => setIsOpen((v) => !v)}
            className="md:hidden p-2 text-slate-600 hover:text-slate-900"
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
            )}
          </button>
        </div>
      </nav>

      {isOpen && (
        <div className="fixed inset-0 z-40 md:hidden bg-white pt-20 px-6 pb-6 overflow-y-auto">
          <div className="space-y-6">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Explore</p>
              {PRIMARY_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block rounded-lg border border-slate-200 px-4 py-3 text-lg font-semibold text-slate-800 hover:bg-slate-50"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Popular resources</p>
              <div className="grid grid-cols-1 gap-2">
                {SECONDARY_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="rounded-lg bg-slate-50 px-4 py-3 text-slate-700 font-medium"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <Link
                href="/analyze-salary"
                onClick={() => setIsOpen(false)}
                className="block w-full text-center px-6 py-4 text-lg font-bold bg-slate-100 text-slate-800 rounded-xl hover:bg-slate-200 transition-colors"
              >
                Check Market Value
              </Link>
              <Link
                href="/analyze-offer"
                onClick={() => setIsOpen(false)}
                className="block w-full text-center px-6 py-4 text-lg font-bold bg-emerald-600 text-white rounded-xl shadow-lg hover:bg-emerald-700 transition-colors"
              >
                Analyze Your Offer
              </Link>
              <Link
                href="/submit"
                onClick={() => setIsOpen(false)}
                className="block w-full text-center px-6 py-4 text-lg font-bold border border-emerald-300 text-emerald-700 rounded-xl hover:bg-emerald-50 transition-colors"
              >
                Submit Salary Data
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
