"use client";

import Link from "next/link";
import { useState } from "react";

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 md:p-6 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
        <Link 
          href="/" 
          className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent hover:scale-105 transition-all"
        >
          AvgPay
        </Link>
        {/* Desktop nav */}
        <div className="hidden md:flex items-center space-x-6">
          <Link 
            href="/salaries" 
            className="text-slate-300 hover:text-white px-4 py-3 rounded-md transition-all hover:bg-slate-800/50 min-h-[44px] flex items-center"
          >
            Salaries
          </Link>
          <Link 
            href="/guides" 
            className="text-slate-300 hover:text-white px-4 py-3 rounded-md transition-all hover:bg-slate-800/50 min-h-[44px] flex items-center"
          >
            Guides
          </Link>
          <Link 
            href="/companies" 
            className="text-slate-300 hover:text-white px-4 py-3 rounded-md transition-all hover:bg-slate-800/50 min-h-[44px] flex items-center"
          >
            Companies
          </Link>
          <Link 
            href="#analyzer" 
            className="px-6 py-3 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-all min-h-[44px] flex items-center shadow-lg hover:shadow-xl"
          >
            Analyze Offer
          </Link>
        </div>
        {/* Mobile menu button */}
        <button
          onClick={toggleMenu}
          className="md:hidden w-12 h-12 flex flex-col justify-center items-center gap-1 p-2 rounded-lg hover:bg-slate-800/50 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500"
          aria-label="Toggle menu"
        >
          <span className={`block w-6 h-0.5 bg-white rounded transition-all duration-300 ease-in-out origin-center ${
            isOpen 
              ? 'rotate-45 translate-y-2' 
              : 'translate-y-0'
          }`} />
          <span className={`block w-6 h-0.5 bg-white rounded transition-all duration-300 ease-in-out ${
            isOpen 
              ? 'opacity-0 -translate-x-3' 
              : 'opacity-100'
          }`} />
          <span className={`block w-6 h-0.5 bg-white rounded transition-all duration-300 ease-in-out origin-center ${
            isOpen 
              ? '-rotate-45 -translate-y-2' 
              : 'translate-y-0'
          }`} />
        </button>
      </nav>
      {/* Mobile menu */}
      <div 
        className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ease-in-out bg-slate-950/95 backdrop-blur-2xl ${
          isOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
        }`}
      >
        <div className="flex flex-col h-full pt-20 p-8 space-y-8">
          {/* Close button */}
          <button
            onClick={toggleMenu}
            className="self-end w-14 h-14 flex flex-col justify-center items-center gap-1.5 p-2 rounded-xl hover:bg-slate-800/50 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-8"
            aria-label="Close menu"
          >
            <span className="block w-7 h-0.5 bg-white rounded rotate-45 translate-y-[0.19rem] origin-center transition-all duration-300" />
            <span className="block w-7 h-0.5 bg-white rounded opacity-0 -translate-x-[0.75rem] transition-all duration-300" />
            <span className="block w-7 h-0.5 bg-white rounded -rotate-45 -translate-y-[0.19rem] origin-center transition-all duration-300" />
          </button>
          <Link 
            href="/salaries" 
            onClick={toggleMenu}
            className="block w-full px-8 py-6 text-2xl md:text-3xl font-semibold text-slate-200 hover:text-white hover:bg-slate-800/50 rounded-2xl transition-all min-h-[56px] flex items-center justify-center shadow-lg hover:shadow-2xl active:scale-[0.98]"
          >
            Salaries
          </Link>
          <Link 
            href="/guides" 
            onClick={toggleMenu}
            className="block w-full px-8 py-6 text-2xl md:text-3xl font-semibold text-slate-200 hover:text-white hover:bg-slate-800/50 rounded-2xl transition-all min-h-[56px] flex items-center justify-center shadow-lg hover:shadow-2xl active:scale-[0.98]"
          >
            Guides
          </Link>
          <Link 
            href="/companies" 
            onClick={toggleMenu}
            className="block w-full px-8 py-6 text-2xl md:text-3xl font-semibold text-slate-200 hover:text-white hover:bg-slate-800/50 rounded-2xl transition-all min-h-[56px] flex items-center justify-center shadow-lg hover:shadow-2xl active:scale-[0.98]"
          >
            Companies
          </Link>
          <div className="flex-grow" />
          <Link 
            href="#analyzer" 
            onClick={toggleMenu}
            className="block w-full px-10 py-8 text-3xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 rounded-3xl shadow-2xl hover:shadow-3xl transition-all active:scale-[0.98] min-h-[64px] flex items-center justify-center"
          >
            Analyze Your Offer
          </Link>
        </div>
      </div>
    </>
  );
}
