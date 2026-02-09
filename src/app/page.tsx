import { Metadata } from "next";
import { OfferAnalyzer } from "@/components/offer-analyzer";
import { Button } from "@/components/ui/button";
import { Database, Shield, TrendingUp } from "lucide-react";
import Link from "next/link";
import { Navigation } from "@/components/navigation";

export const metadata: Metadata = {
  title: "AvgPay - Salary Insights & Negotiation Tool | Know Your Worth",
  description: "AvgPay provides data-driven salary insights for tech workers. Compare your compensation against BLS, H-1B, and pay transparency data to negotiate your next offer with confidence.",
  openGraph: {
    title: "AvgPay - Salary Insights & Negotiation Tool | Know Your Worth",
    description: "AvgPay provides data-driven salary insights for tech workers. Compare your compensation against BLS, H-1B, and pay transparency data to negotiate your next offer with confidence.",
    type: "website",
    images: ["/images/og-image.png"], // Add your OG image path
  },
  twitter: {
    card: "summary_large_image",
    title: "AvgPay - Salary Insights & Negotiation Tool | Know Your Worth",
    description: "AvgPay provides data-driven salary insights for tech workers. Compare your compensation against BLS, H-1B, and pay transparency data to negotiate your next offer with confidence.",
    images: ["/images/twitter-image.png"], // Add your Twitter image path
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
            Accurate Salary Data: BLS + H-1B + Transparency Laws
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight text-slate-100">
            Negotiate Your <span className="text-gradient">Tech Salary</span> with Confidence
          </h1>
          
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Leverage verified data to understand your market value. Compare your offer against BLS, H-1B, and pay transparency insights. Get analysis in seconds.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/#analyzer">
              <Button size="lg" className="bg-gradient-to-r from-indigo-600 to-violet-600 text-lg px-6 sm:px-8">
                Analyze Your Offer Now
              </Button>
            </Link>
            <Link href="/guides">
              <Button size="lg" variant="outline" className="text-lg px-6 sm:px-8">
                Explore Salary Ranges
              </Button>
            </Link>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-6 pt-8 text-slate-500 text-sm">
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              <span>BLS Certified Data</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              <span>Privacy Focused</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              <span>Real Market Intelligence</span>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section - PAS Framework */}
      <section className="px-6 py-12 bg-slate-900/30 border-y border-slate-800">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-3">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-100">Struggling with Salary Negotiations?</h2>
            <p className="text-slate-400 text-lg">
              Generic data leaves you guessing. Here&apos;s why it matters:
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center text-red-400 text-xl font-bold">1</div>
              <h3 className="font-semibold text-lg text-slate-100">Outdated Data</h3>
              <p className="text-slate-400 text-sm md:text-base">
                Most sites use old self-reported numbers. The market moves fast—your data should too.
              </p>
            </div>
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-400 text-xl font-bold">2</div>
              <h3 className="font-semibold text-lg text-slate-100">Inconsistent Sources</h3>
              <p className="text-slate-400 text-sm md:text-base">
                 Levels.fyi vs. Glassdoor vs. Blind? Which reflects reality? Get clarity with verified data.
              </p>
            </div>
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 text-xl font-bold">3</div>
              <h3 className="font-semibold text-lg text-slate-100">Your Competitive Edge</h3>
              <p className="text-slate-400 text-sm md:text-base">
                AvgPay uses official BLS, H-1B, and pay transparency data for accurate, actionable insights.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Offer Analyzer Section */}
      <section id="analyzer" className="px-6 py-16 lg:py-24">
        <div className="max-w-6xl mx-auto space-y-8 lg:space-y-12">
          <div className="text-center space-y-3 lg:space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-100">Get Your Verified Offer Grade</h2>
            <p className="text-slate-400 text-lg max-w-xl mx-auto">
              Input your offer details. We&apos;ll compare it against the most reliable market data available and provide your grade—plus actionable next steps.
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
              <p className="text-sm text-slate-400">Official U.S. Bureau of Labor Statistics occupational employment and wage data.</p>
            </div>
            <div className="p-6 rounded-lg bg-slate-800/50 border border-slate-700">
              <Shield className="w-8 h-8 text-emerald-400 mx-auto mb-4" />
              <h3 className="font-semibold mb-2 text-slate-100">H-1B Filings</h3>
              <p className="text-sm text-slate-400">Publicly disclosed salary data from employer H-1B visa applications.</p>
            </div>
            <div className="p-6 rounded-lg bg-slate-800/50 border border-slate-700">
              <TrendingUp className="w-8 h-8 text-violet-400 mx-auto mb-4" />
              <h3 className="font-semibold mb-2 text-slate-100">Pay Transparency Laws</h3>
              <p className="text-sm text-slate-400">Real-time data feeds from states and cities requiring salary disclosure.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 border-t border-slate-800">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-slate-500 text-sm">
            © 2026 AvgPay. All rights reserved. Data-driven salary insights for informed negotiation.
          </div>
          <div className="flex flex-wrap gap-6 text-sm justify-center md:justify-end">
            <Link href="/guides" className="text-slate-400 hover:text-slate-200">Salary Guides</Link>
            <Link href="/methodology" className="text-slate-400 hover:text-slate-200">Methodology</Link>
            <Link href="/about" className="text-slate-400 hover:text-slate-200">About</Link>
            <Link href="/privacy" className="text-slate-400 hover:text-slate-200">Privacy Policy</Link>
            <Link href="/terms" className="text-slate-400 hover:text-slate-200">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
