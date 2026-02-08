import Link from "next/link";
import { Database } from "lucide-react";

export function Navigation() {
  return (
    <nav className="px-6 py-4 border-b border-slate-800 bg-slate-950/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold">
          <Database className="w-6 h-6 text-indigo-400" />
          <span className="text-gradient">AvgPay</span>
        </Link>
        <div className="flex items-center gap-6 text-sm">
          <Link href="/guides" className="text-slate-400 hover:text-slate-200 transition-colors">Guides</Link>
          <Link href="/methodology" className="text-slate-400 hover:text-slate-200 transition-colors">Methodology</Link>
          <Link href="/pricing" className="text-slate-400 hover:text-slate-200 transition-colors">Pricing</Link>
          <Link href="/about" className="text-slate-400 hover:text-slate-200 transition-colors">About</Link>
          <Link href="/contribute" className="text-slate-400 hover:text-slate-200 transition-colors">Contribute</Link>
        </div>
      </div>
    </nav>
  );
}
