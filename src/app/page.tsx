import { Metadata } from "next";
import { OfferAnalyzer } from "@/components/offer-analyzer";
import { Button } from "@/components/ui/button";
import { Database, Shield, TrendingUp } from "lucide-react";
import Link from "next/link";
import { Navigation } from "@/components/navigation";

export const metadata: Metadata = {
  title: "AvgPay - Know Your Worth in 60 Seconds",
  description: "Data-driven salary insights for tech workers. Compare your compensation against BLS, H-1B, and market data.",
  openGraph: {
    title: "AvgPay - Know Your Worth in 60 Seconds",
    description: "Data-driven salary insights for tech workers",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AvgPay - Know Your Worth in 60 Seconds",
    description: "Data-driven salary insights for tech workers",
  },
};

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative px-6 py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/20 via-slate-950 to-slate-950" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(2,6,23,0.8)_100%)]" />
        
        <div className="relative max-w-5xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm">
            <Database className="w-4 h-4" />
            Powered by BLS + H-1B data
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-100">
            Know Your Worth in{" "}
            <span className="text-gradient">60 Seconds</span>
          </h1>
          
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Stop guessing. Get data-driven salary insights backed by government data 
            and real market intelligence. Know exactly where you stand before your next negotiation.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/#analyzer">
              <Button size="lg" className="bg-gradient-to-r from-indigo-600 to-violet-600 text-lg px-8">
                Analyze Your Offer
              </Button>
            </Link>
            <Link href="/guides">
              <Button size="lg" variant="outline" className="text-lg px-8">
                Browse Salary Data
              </Button>
            </Link>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-8 pt-8 text-slate-500">
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              <span>BLS Certified Data</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              <span>Privacy First</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              <span>Real Market Intelligence</span>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section - PAS Framework */}
      <section className="px-6 py-16 bg-slate-900/30 border-y border-slate-800">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-slate-100">The Salary Negotiation is Broken</h2>
            <p className="text-slate-400 text-lg">
              You&apos;re leaving money on the table. Here&apos;s why:
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-lg bg-red-500/10 flex items-center justify-center text-red-400 text-xl font-bold">1</div>
              <h3 className="font-semibold text-lg text-slate-100">Problem: No Data</h3>
              <p className="text-slate-400">
                Glassdoor and Levels.fyi show wildly different numbers. Which do you trust when negotiating?
              </p>
            </div>
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-400 text-xl font-bold">2</div>
              <h3 className="font-semibold text-lg text-slate-100">Agitation: Outdated Info</h3>
              <p className="text-slate-400">
                Most salary sites use self-reported data from years ago. The market moved—you didn&apos;t.
              </p>
            </div>
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 text-xl font-bold">3</div>
              <h3 className="font-semibold text-lg text-slate-100">Solution: Verified Data</h3>
              <p className="text-slate-400">
                AvgPay combines BLS, H-1B filings, and pay transparency laws for accurate, current benchmarks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Offer Analyzer Section */}
      <section id="analyzer" className="px-6 py-24">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-slate-100">Get Your Grade</h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Enter your offer details. We&apos;ll compare against verified market data and give you a grade—plus actionable next steps.
            </p>
          </div>
          
          <OfferAnalyzer />
        </div>
      </section>

      {/* Data Sources */}
      <section className="px-6 py-16 bg-slate-900/30 border-y border-slate-800">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-2xl font-bold text-slate-100">Data You Can Trust</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="p-6 rounded-lg bg-slate-800/50 border border-slate-700">
              <Database className="w-8 h-8 text-indigo-400 mx-auto mb-4" />
              <h3 className="font-semibold mb-2 text-slate-100">BLS Data</h3>
              <p className="text-sm text-slate-400">Official Bureau of Labor Statistics occupational employment data</p>
            </div>
            <div className="p-6 rounded-lg bg-slate-800/50 border border-slate-700">
              <Shield className="w-8 h-8 text-emerald-400 mx-auto mb-4" />
              <h3 className="font-semibold mb-2 text-slate-100">H-1B Filings</h3>
              <p className="text-sm text-slate-400">Publicly disclosed salary data from visa applications</p>
            </div>
            <div className="p-6 rounded-lg bg-slate-800/50 border border-slate-700">
              <TrendingUp className="w-8 h-8 text-violet-400 mx-auto mb-4" />
              <h3 className="font-semibold mb-2 text-slate-100">Pay Transparency</h3>
              <p className="text-sm text-slate-400">Live data from pay transparency law postings</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 border-t border-slate-800">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-slate-500 text-sm">
            © 2026 AvgPay. Data-driven salary insights.
          </div>
          <div className="flex gap-6 text-sm">
            <Link href="/methodology" className="text-slate-400 hover:text-slate-200">Methodology</Link>
            <Link href="/about" className="text-slate-400 hover:text-slate-200">Privacy</Link>
            <Link href="/contribute" className="text-slate-400 hover:text-slate-200">Contribute</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
