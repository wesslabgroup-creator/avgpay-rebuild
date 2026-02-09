 "use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Navigation() {
  return (
    <nav className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent hover:scale-105 transition-all">
        AvgPay
      </Link>
      <div className="flex items-center space-x-6">
        <Link href="/salaries" className="text-slate-300 hover:text-white transition-colors">Salaries</Link>
        <Link href="/guides" className="text-slate-300 hover:text-white transition-colors">Guides</Link>
        <Link href="/companies" className="text-slate-300 hover:text-white transition-colors">Companies</Link>
        <Link href="#analyzer" className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition-colors">Analyze Offer</Link>
      </div>
    </nav>
  );
} 