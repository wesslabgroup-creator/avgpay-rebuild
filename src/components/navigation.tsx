"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react"; // Assuming lucide-react is installed, if not I'll use SVGs

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <Link 
          href="/" 
          className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent hover:scale-105 transition-all"
        >
          AvgPay
        </Link>
        
        {/* Desktop nav */}
        <div className="hidden md:flex items-center space-x-6">
          <Link 
            href="/salaries" 
            className="text-slate-600 hover:text-slate-900 font-medium px-3 py-2 rounded-md transition-colors hover:bg-slate-50"
          >
            Salaries
          </Link>
          <Link 
            href="/companies" 
            className="text-slate-600 hover:text-slate-900 font-medium px-3 py-2 rounded-md transition-colors hover:bg-slate-50"
          >
            Companies
          </Link>
          <Link 
            href="/guides" 
            className="text-slate-600 hover:text-slate-900 font-medium px-3 py-2 rounded-md transition-colors hover:bg-slate-50"
          >
            Guides
          </Link>
          <Link 
            href="/submit" 
            className="text-emerald-600 hover:text-emerald-700 font-medium px-3 py-2 rounded-md transition-colors hover:bg-emerald-50"
          >
            Contribute
          </Link>
          <Link 
            href="/analyze-offer" 
            className="px-5 py-2.5 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition-all shadow-md hover:shadow-lg"
          >
            Analyze Offer
          </Link>
        </div>

        {/* Mobile menu button */}
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

      {/* Mobile menu overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-40 md:hidden bg-white pt-20 px-6 pb-6 overflow-y-auto animate-in fade-in slide-in-from-top-5 duration-200">
          <div className="flex flex-col space-y-4">
            <Link 
              href="/salaries" 
              onClick={toggleMenu}
              className="block w-full px-4 py-4 text-xl font-semibold text-slate-800 border-b border-slate-100 hover:bg-slate-50 rounded-lg transition-colors"
            >
              Salaries
            </Link>
            <Link 
              href="/companies" 
              onClick={toggleMenu}
              className="block w-full px-4 py-4 text-xl font-semibold text-slate-800 border-b border-slate-100 hover:bg-slate-50 rounded-lg transition-colors"
            >
              Companies
            </Link>
            <Link 
              href="/guides" 
              onClick={toggleMenu}
              className="block w-full px-4 py-4 text-xl font-semibold text-slate-800 border-b border-slate-100 hover:bg-slate-50 rounded-lg transition-colors"
            >
              Guides
            </Link>
            <Link 
              href="/submit" 
              onClick={toggleMenu}
              className="block w-full px-4 py-4 text-xl font-semibold text-emerald-600 border-b border-slate-100 hover:bg-emerald-50 rounded-lg transition-colors"
            >
              Contribute Data
            </Link>
            <div className="pt-4">
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
