"use client";

import Link from "next/link";
import { useState } from "react";
// Assuming lucide-react is installed, if not I'll use SVGs

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 border-b border-border bg-surface/80 backdrop-blur-md">
        <Link
          href="/"
          className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent hover:scale-105 transition-all"
        >
          AvgPay
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center space-x-6">
          <Link
            href="/salaries"
            className="text-text-secondary hover:text-text-primary font-medium px-3 py-2 rounded-md transition-colors hover:bg-surface-subtle"
          >
            Salaries
          </Link>
          <Link
            href="/companies"
            className="text-text-secondary hover:text-text-primary font-medium px-3 py-2 rounded-md transition-colors hover:bg-surface-subtle"
          >
            Companies
          </Link>
          <Link
            href="/guides"
            className="text-text-secondary hover:text-text-primary font-medium px-3 py-2 rounded-md transition-colors hover:bg-surface-subtle"
          >
            Guides
          </Link>
          <div className="flex items-center space-x-1">
            <Link
              href="/tools/inflation-calculator"
              className="text-text-secondary hover:text-text-primary font-medium px-3 py-2 rounded-md transition-colors hover:bg-surface-subtle"
            >
              Inflation
            </Link>
            <Link
              href="/tools/salary-comparison"
              className="text-text-secondary hover:text-text-primary font-medium px-3 py-2 rounded-md transition-colors hover:bg-surface-subtle"
            >
              Compare
            </Link>
          </div>
          <Link
            href="/tools/negotiation-email"
            className="text-text-secondary hover:text-text-primary font-medium px-3 py-2 rounded-md transition-colors hover:bg-surface-subtle"
          >
            Negotiate
          </Link>
          <Link
            href="/tools/equity-simulator"
            className="text-text-secondary hover:text-text-primary font-medium px-3 py-2 rounded-md transition-colors hover:bg-surface-subtle"
          >
            Equity
          </Link>
          <Link
            href="/submit"
            className="text-primary hover:text-primary-hover font-medium px-3 py-2 rounded-md transition-colors hover:bg-primary-subtle"
          >
            Contribute
          </Link>
          <Link
            href="/analyze-salary"
            className="text-text-secondary hover:text-text-primary font-medium px-3 py-2 rounded-md transition-colors hover:bg-surface-subtle"
          >
            Check Your Value
          </Link>
          <Link
            href="/analyze-offer"
            className="px-5 py-2.5 rounded-lg bg-primary text-text-inverse font-medium hover:bg-primary-hover transition-all shadow-md hover:shadow-lg"
          >
            Analyze Offer
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={toggleMenu}
          className="md:hidden p-2 text-text-secondary hover:text-text-primary focus:outline-none"
          aria-label="Toggle menu"
        >
          {isOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          )}
        </button>
      </nav>

      {/* Mobile menu overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-40 md:hidden bg-surface pt-20 px-6 pb-6 overflow-y-auto animate-in fade-in slide-in-from-top-5 duration-200">
          <div className="flex flex-col space-y-4">
            <Link
              href="/salaries"
              onClick={toggleMenu}
              className="block w-full px-4 py-4 text-xl font-semibold text-text-primary border-b border-surface-muted hover:bg-surface-subtle rounded-lg transition-colors"
            >
              Salaries
            </Link>
            <Link
              href="/companies"
              onClick={toggleMenu}
              className="block w-full px-4 py-4 text-xl font-semibold text-text-primary border-b border-surface-muted hover:bg-surface-subtle rounded-lg transition-colors"
            >
              Companies
            </Link>
            <Link
              href="/guides"
              onClick={toggleMenu}
              className="block w-full px-4 py-4 text-xl font-semibold text-text-primary border-b border-surface-muted hover:bg-surface-subtle rounded-lg transition-colors"
            >
              Guides
            </Link>
            <div className="grid grid-cols-2 gap-2 pb-2 border-b border-surface-muted">
              <Link
                href="/tools/inflation-calculator"
                onClick={toggleMenu}
                className="block px-4 py-3 text-lg font-medium text-text-secondary bg-surface-subtle hover:bg-surface-muted rounded-lg transition-colors"
              >
                Inflation Calc
              </Link>
              <Link
                href="/tools/salary-comparison"
                onClick={toggleMenu}
                className="block px-4 py-3 text-lg font-medium text-text-secondary bg-surface-subtle hover:bg-surface-muted rounded-lg transition-colors"
              >
                Salary Comp
              </Link>
            </div>
            <Link
              href="/tools/negotiation-email"
              onClick={toggleMenu}
              className="block w-full px-4 py-4 text-xl font-semibold text-text-primary border-b border-surface-muted hover:bg-surface-subtle rounded-lg transition-colors"
            >
              Negotiate
            </Link>
            <Link
              href="/tools/equity-simulator"
              onClick={toggleMenu}
              className="block w-full px-4 py-4 text-xl font-semibold text-text-primary border-b border-surface-muted hover:bg-surface-subtle rounded-lg transition-colors"
            >
              Equity
            </Link>
            <Link
              href="/submit"
              onClick={toggleMenu}
              className="block w-full px-4 py-4 text-xl font-semibold text-primary border-b border-surface-muted hover:bg-primary-subtle rounded-lg transition-colors"
            >
              Contribute Data
            </Link>
            <div className="pt-4 space-y-3">
              <Link
                href="/analyze-salary"
                onClick={toggleMenu}
                className="block w-full text-center px-6 py-4 text-lg font-bold bg-surface-muted text-text-primary rounded-xl hover:bg-surface-muted transition-colors"
              >
                Check Your Value
              </Link>
              <Link
                href="/analyze-offer"
                onClick={toggleMenu}
                className="block w-full text-center px-6 py-4 text-lg font-bold bg-primary text-text-inverse rounded-xl shadow-lg hover:bg-primary-hover transition-colors"
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
