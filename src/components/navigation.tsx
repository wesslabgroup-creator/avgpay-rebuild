"use client";

import Link from "next/link";
import { useState } from "react";

const primaryLinks = [
  { href: "/salaries", label: "Salaries" },
  { href: "/companies", label: "Companies" },
  { href: "/compare", label: "Comparisons" },
  { href: "/guides", label: "Guides" },
  { href: "/tools", label: "Tools" },
  { href: "/methodology", label: "Methodology" },
];

const quickToolLinks = [
  { href: "/tools/salary-comparison", label: "Salary Comparison" },
  { href: "/tools/compensation-breakdown", label: "Comp Breakdown" },
  { href: "/tools/equity-simulator", label: "Equity Simulator" },
  { href: "/tools/negotiation-email", label: "Negotiation Email" },
];

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen((prev) => !prev);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 border-b border-slate-200 bg-white/90 backdrop-blur-md">
        <Link
          href="/"
          className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent hover:scale-105 transition-all"
        >
          AvgPay
        </Link>

        <div className="hidden md:flex items-center gap-2">
          {primaryLinks.map((link) => (
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
            Contribute Data
          </Link>
          <Link
            href="/analyze-offer"
            className="px-5 py-2.5 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition-all shadow-md hover:shadow-lg"
          >
            Analyze Offer
          </Link>
        </div>

        <button
          onClick={toggleMenu}
          className="md:hidden p-2 text-slate-600 hover:text-slate-900 focus:outline-none"
          aria-label="Toggle menu"
        >
          {isOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          )}
        </button>
      </nav>

      {isOpen && (
        <div className="fixed inset-0 z-40 md:hidden bg-white pt-20 px-6 pb-6 overflow-y-auto animate-in fade-in slide-in-from-top-5 duration-200">
          <div className="space-y-6">
            <div className="grid gap-2">
              {primaryLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={toggleMenu}
                  className="block w-full px-4 py-3 text-lg font-semibold text-slate-800 border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div>
              <p className="text-sm uppercase tracking-wide text-slate-500 mb-2">Popular tools</p>
              <div className="grid grid-cols-2 gap-2">
                {quickToolLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={toggleMenu}
                    className="block px-3 py-3 text-sm font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <Link
              href="/submit"
              onClick={toggleMenu}
              className="block w-full px-4 py-4 text-xl font-semibold text-emerald-700 border border-emerald-200 hover:bg-emerald-50 rounded-lg transition-colors"
            >
              Contribute Data
            </Link>

            <div className="pt-2 space-y-3">
              <Link
                href="/analyze-salary"
                onClick={toggleMenu}
                className="block w-full text-center px-6 py-4 text-lg font-bold bg-slate-100 text-slate-800 rounded-xl hover:bg-slate-200 transition-colors"
              >
                Check Your Salary
              </Link>
              <Link
                href="/analyze-offer"
                onClick={toggleMenu}
                className="block w-full text-center px-6 py-4 text-lg font-bold bg-emerald-600 text-white rounded-xl shadow-lg hover:bg-emerald-700 transition-colors"
              >
                Analyze Your Offer
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
