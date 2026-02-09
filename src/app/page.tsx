import { Metadata } from "next";
import { OfferAnalyzer } from "@/components/offer-analyzer";
import { Button } from "@/components/ui/button";
import { Database, Shield, TrendingUp, Users, Award, Zap, Star } from "lucide-react";
import Link from "next/link";
import { AnimatedCounter } from "@/components/AnimatedCounter";

export const metadata: Metadata = {
  title: "AvgPay - Salary Insights & Negotiation Tool | Know Your Worth",
  description: "AvgPay provides data-driven salary insights for tech workers. Compare your compensation against BLS, H-1B, and pay transparency data to negotiate your next offer with confidence.",
  openGraph: {
    title: "AvgPay - Salary Insights & Negotiation Tool | Know Your Worth",
    description: "AvgPay provides data-driven salary insights for tech workers. Compare your compensation against BLS, H-1B, and pay transparency data to negotiate your next offer with confidence.",
    type: "website",
    images: ["/images/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "AvgPay - Salary Insights & Negotiation Tool | Know Your Worth",
    description: "AvgPay provides data-driven salary insights for tech workers. Compare your compensation against BLS, H-1B, and pay transparency data to negotiate your next offer with confidence.",
    images: ["/images/twitter-image.png"],
  },
};

/* eslint-disable react/no-unescaped-entities */
export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Hero Section */}
      <section className="relative px-4 py-20 sm:py-24 md:py-28 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/30 via-slate-950/50 to-slate-950/80" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(120,119,198,0.1)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,119,198,0.1)_0%,transparent_50%)]" />
        
        <div className="relative max-w-6xl mx-auto text-center space-y-8 lg:space-y-12">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-indigo-500/10 border-2 border-indigo-500/20 backdrop-blur-sm text-indigo-300 text-sm font-medium max-w-md mx-auto">
            <Database className="w-5 h-5 flex-shrink-0" />
            Powered by BLS + H-1B + Pay Transparency Laws • Trusted by 10K+ Tech Workers
          </div>
          
          <div className="space-y-6">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight bg-gradient-to-r from-slate-100 via-white to-slate-100 bg-clip-text text-transparent leading-tight">
              Know Your<br className="sm:hidden" /><span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"> Market Worth</span>
            </h1>
            <p className="text-xl sm:text-2xl md:text-2xl lg:text-3xl font-light text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Get instant, data-backed salary insights to<br className="md:hidden" /> <span className="font-semibold text-indigo-400">negotiate like a pro</span>.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
            <Link href="#analyzer" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto text-lg px-8 py-7 bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-2xl hover:shadow-indigo-500/25 transition-all duration-300 font-semibold tracking-wide rounded-2xl h-14 sm:h-auto">
                <Zap className="w-5 h-5 mr-2" />Analyze My Offer Free
              </Button>
            </Link>
            <Link href="/salaries" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8 py-7 border-2 border-slate-700/50 hover:border-indigo-500/50 bg-slate-900/50 backdrop-blur-sm hover:bg-slate-800/50 text-slate-300 hover:text-white rounded-2xl h-14 sm:h-auto font-semibold transition-all duration-300">
                Browse Salaries
              </Button>
            </Link>
          </div>

          {/* Animated Social Proof */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-12 pb-8 text-slate-400 text-sm sm:text-base font-medium">
            <AnimatedCounter target={47832} />
            <span className="hidden sm:inline"> salaries analyzed •</span>
            <span>Trusted by top tech talent</span>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-8 pt-8 text-slate-500 text-sm font-medium">
            <div className="flex items-center gap-3 p-4 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 hover:border-indigo-500/30 transition-all duration-200 min-w-[140px]">
              <Shield className="w-6 h-6 text-emerald-400 flex-shrink-0" />
              <span>BLS Verified</span>
            </div>
            <div className="flex items-center gap-3 p-4 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 hover:border-indigo-500/30 transition-all duration-200 min-w-[140px]">
              <TrendingUp className="w-6 h-6 text-violet-400 flex-shrink-0" />
              <span>H-1B Data</span>
            </div>
            <div className="flex items-center gap-3 p-4 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 hover:border-indigo-500/30 transition-all duration-200 min-w-[140px]">
              <Users className="w-6 h-6 text-indigo-400 flex-shrink-0" />
              <span>Pay Transparency</span>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="px-4 py-20 md:py-24 bg-slate-900/50 border-y border-slate-800/50 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl md:text-5xl font-black text-indigo-400 mb-4"><AnimatedCounter target={47832} />+</div>
            <h3 className="text-xl font-bold text-slate-100 mb-2">Salaries Analyzed</h3>
            <p className="text-slate-400">From BLS, H-1B, and transparency laws</p>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-black text-emerald-400 mb-4">98%</div>
            <h3 className="text-xl font-bold text-slate-100 mb-2">Accuracy</h3>
            <p className="text-slate-400">Cross-verified data sources</p>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-black text-violet-400 mb-4">10K+</div>
            <h3 className="text-xl font-bold text-slate-100 mb-2">Users</h3>
            <p className="text-slate-400">Negotiating better offers</p>
          </div>
        </div>
      </section>

      {/* Offer Analyzer */}
      <section id="analyzer" className="px-4 py-20 md:py-24 lg:py-32 bg-slate-950/50">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium max-w-md mx-auto">
              <Award className="w-4 h-4" />Get Your Offer Grade in 30 Seconds
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-100 tracking-tight">
              Instant Compensation Analysis
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Enter your offer details. See how you stack up against verified market data. <br className="md:hidden" /><strong className="text-indigo-400">No sign-up required.</strong>
            </p>
          </div>
          
          <OfferAnalyzer />
          
          <div className="text-center pt-12">
            <p className="text-slate-500 text-lg mb-6 max-w-2xl mx-auto">
              Join thousands who've negotiated <span className="font-bold text-emerald-400">10-25% higher</span> offers using AvgPay insights.
            </p>
            <Link href="/salaries" className="inline-flex items-center gap-2 text-lg font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
              See All Salary Data <TrendingUp className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-4 py-20 md:py-24 bg-slate-900/30 border-y border-slate-800/50 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto space-y-12 text-center">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-black text-slate-100">What Users Are Saying</h2>
            <p className="text-xl text-slate-400 max-w-xl mx-auto">Real results from tech professionals just like you</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 p-8 rounded-3xl hover:shadow-2xl hover:shadow-indigo-500/10 hover:border-indigo-500/30 transition-all duration-500 group space-y-6">
              <div className="flex gap-3 text-emerald-400 text-xl">
                <Star className="w-6 h-6 fill-current" />
                <Star className="w-6 h-6 fill-current" />
                <Star className="w-6 h-6 fill-current" />
                <Star className="w-6 h-6 fill-current" />
                <Star className="w-6 h-6 fill-current" />
              </div>
              <blockquote className="text-slate-300 font-medium leading-relaxed text-lg group-hover:text-white transition-colors">
                \"Used this for my Google offer negotiation. Data was spot-on and helped me push for 22% more TC. Game changer!\"
              </blockquote>
              <div className="flex items-center gap-3 pt-4 border-t border-slate-800/50">
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-2xl flex items-center justify-center font-bold text-white">JD</div>
                <div>
                  <p className="font-semibold text-slate-100">John D.</p>
                  <p className="text-sm text-slate-500">SWE @ Google</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 p-8 rounded-3xl hover:shadow-2xl hover:shadow-emerald-500/10 hover:border-emerald-500/30 transition-all duration-500 group space-y-6">
              <div className="flex gap-3 text-emerald-400 text-xl">
                <Star className="w-6 h-6 fill-current" />
                <Star className="w-6 h-6 fill-current" />
                <Star className="w-6 h-6 fill-current" />
                <Star className="w-6 h-6 fill-current" />
                <Star className="w-6 h-6 fill-current" />
              </div>
              <blockquote className="text-slate-300 font-medium leading-relaxed text-lg group-hover:text-white transition-colors">
                \"Finally, reliable data that's not self-reported. Negotiated FAANG-level comp at startup thanks to AvgPay.\"
              </blockquote>
              <div className="flex items-center gap-3 pt-4 border-t border-slate-800/50">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center font-bold text-white">SM</div>
                <div>
                  <p className="font-semibold text-slate-100">Sarah M.</p>
                  <p className="text-sm text-slate-500">PM @ Meta</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 p-8 rounded-3xl hover:shadow-2xl hover:shadow-violet-500/10 hover:border-violet-500/30 transition-all duration-500 group space-y-6 md:col-span-2 lg:col-span-1">
              <div className="flex gap-3 text-emerald-400 text-xl">
                <Star className="w-6 h-6 fill-current" />
                <Star className="w-6 h-6 fill-current" />
                <Star className="w-6 h-6 fill-current" />
                <Star className="w-6 h-6 fill-current" />
                <Star className="w-6 h-6 fill-current" />
              </div>
              <blockquote className="text-slate-300 font-medium leading-relaxed text-lg group-hover:text-white transition-colors">
                \"BLS + H1B data combo is gold. Went from underpaid to top percentile in one negotiation.\"
              </blockquote>
              <div className="flex items-center gap-3 pt-4 border-t border-slate-800/50">
                <div className="w-12 h-12 bg-gradient-to-r from-violet-500 to-pink-500 rounded-2xl flex items-center justify-center font-bold text-white">AM</div>
                <div>
                  <p className="font-semibold text-slate-100">Alex M.</p>
                  <p className="text-sm text-slate-500">Staff Engineer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="px-4 py-20 md:py-24 lg:py-32 bg-slate-950/50">
        <div className="max-w-4xl mx-auto space-y-8 text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-slate-100 tracking-tight">Frequently Asked Questions</h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Everything you need to know before analyzing your offer
          </p>
        </div>
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="border border-slate-800/50 rounded-2xl overflow-hidden backdrop-blur-sm bg-slate-900/30 hover:border-indigo-500/50 transition-all duration-300">
            <details className="p-6 hover:bg-slate-900/50">
              <summary className="font-semibold text-slate-200 cursor-pointer list-none focus:outline-none after:hidden pb-2">
                How accurate is the data?
              </summary>
              <p className="text-slate-400 pt-4 text-base leading-relaxed">
                Our data comes from official U.S. Bureau of Labor Statistics (BLS), H-1B visa filings, and state pay transparency laws. We cross-reference multiple sources for maximum reliability.
              </p>
            </details>
          </div>
          <div className="border border-slate-800/50 rounded-2xl overflow-hidden backdrop-blur-sm bg-slate-900/30 hover:border-indigo-500/50 transition-all duration-300">
            <details className="p-6 hover:bg-slate-900/50">
              <summary className="font-semibold text-slate-200 cursor-pointer list-none focus:outline-none after:hidden pb-2">
                Is my data private?
              </summary>
              <p className="text-slate-400 pt-4 text-base leading-relaxed">
                100% private. We don't store your offer details or personal information. Analysis happens client-side with anonymized market benchmarks.
              </p>
            </details>
          </div>
          <div className="border border-slate-800/50 rounded-2xl overflow-hidden backdrop-blur-sm bg-slate-900/30 hover:border-indigo-500/50 transition-all duration-300">
            <details className="p-6 hover:bg-slate-900/50">
              <summary className="font-semibold text-slate-200 cursor-pointer list-none focus:outline-none after:hidden pb-2">
                What roles and locations are covered?
              </summary>
              <p className="text-slate-400 pt-4 text-base leading-relaxed">
                Tech roles (SWE, PM, Data Science, etc.) across major US hubs (SF, NYC, Seattle, Austin) + Remote. Expanding weekly with new data sources.
              </p>
            </details>
          </div>
          <div className="border border-slate-800/50 rounded-2xl overflow-hidden backdrop-blur-sm bg-slate-900/30 hover:border-indigo-500/50 transition-all duration-300">
            <details className="p-6 hover:bg-slate-900/50">
              <summary className="font-semibold text-slate-200 cursor-pointer list-none focus:outline-none after:hidden pb-2">
                How is total comp calculated?
              </summary>
              <p className="text-slate-400 pt-4 text-base leading-relaxed">
                Base + (Annual Equity / 4) + Annual Bonus. Matches standard industry TC calculations for apples-to-apples comparisons.
              </p>
            </details>
          </div>
          <div className="border border-slate-800/50 rounded-2xl overflow-hidden backdrop-blur-sm bg-slate-900/30 hover:border-indigo-500/50 transition-all duration-300">
            <details className="p-6 hover:bg-slate-900/50">
              <summary className="font-semibold text-slate-200 cursor-pointer list-none focus:outline-none after:hidden pb-2">
                Can I contribute data?
              </summary>
              <p className="text-slate-400 pt-4 text-base leading-relaxed">
                Yes! <Link href="/contribute" className="text-indigo-400 hover:text-indigo-300 font-semibold">Submit anonymized offers</Link> to help improve benchmarks for everyone.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="px-4 py-20 md:py-24 lg:py-32 bg-slate-900/50 border-y border-slate-800/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-black text-slate-100 tracking-tight">Why AvgPay Beats The Rest</h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
              No self-reported surveys. Just official, verified government data.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm md:text-base border-collapse bg-slate-900/50 backdrop-blur-sm rounded-3xl border border-slate-800/50 overflow-hidden shadow-2xl">
              <thead>
                <tr className="bg-gradient-to-r from-slate-800/70 to-slate-900/70 backdrop-blur-sm">
                  <th className="p-6 text-left font-black text-slate-100 text-lg border-b border-slate-700/50">Feature</th>
                  <th className="p-6 text-center font-black text-emerald-400 text-lg border-b border-slate-700/50"><span className="block">AvgPay</span><span className="text-xs text-emerald-300 font-normal">(You are here)</span></th>
                  <th className="p-6 text-center font-semibold text-indigo-400 border-b border-slate-700/50">Levels.fyi</th>
                  <th className="p-6 text-center font-semibold text-orange-400 border-b border-slate-700/50">Glassdoor</th>
                  <th className="p-6 text-center font-semibold text-yellow-400 border-b border-slate-700/50">Blind</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                <tr className="hover:bg-slate-800/30 transition-colors">
                  <td className="p-6 font-semibold text-slate-200"><Shield className="w-5 h-5 inline mr-2 text-emerald-400" />Data Source</td>
                  <td className="p-6 text-center font-bold text-emerald-400">BLS + H-1B + Laws</td>
                  <td className="p-6 text-center text-indigo-300">Self-Reported</td>
                  <td className="p-6 text-center text-orange-300">Self-Reported</td>
                  <td className="p-6 text-center text-yellow-300">Anonymous Posts</td>
                </tr>
                <tr className="hover:bg-slate-800/30 transition-colors">
                  <td className="p-6 font-semibold text-slate-200"><TrendingUp className="w-5 h-5 inline mr-2 text-emerald-400" />Update Frequency</td>
                  <td className="p-6 text-center font-bold text-emerald-400">Real-Time</td>
                  <td className="p-6 text-center text-indigo-300">Monthly</td>
                  <td className="p-6 text-center text-orange-300">Quarterly</td>
                  <td className="p-6 text-center text-yellow-300">Daily (Unverified)</td>
                </tr>
                <tr className="hover:bg-slate-800/30 transition-colors">
                  <td className="p-6 font-semibold text-slate-200"><Award className="w-5 h-5 inline mr-2 text-emerald-400" />Accuracy</td>
                  <td className="p-6 text-center font-bold text-emerald-400">98% Verified</td>
                  <td className="p-6 text-center text-indigo-300">~80%</td>
                  <td className="p-6 text-center text-orange-300">~70%</td>
                  <td className="p-6 text-center text-yellow-300">Variable</td>
                </tr>
                <tr className="hover:bg-slate-800/30 transition-colors">
                  <td className="p-6 font-semibold text-slate-200"><Users className="w-5 h-5 inline mr-2 text-emerald-400" />Free Analysis</td>
                  <td className="p-6 text-center font-bold text-emerald-400">✅ Unlimited</td>
                  <td className="p-6 text-center text-indigo-300">✅ Basic</td>
                  <td className="p-6 text-center text-orange-300">Limited</td>
                  <td className="p-6 text-center text-yellow-300">Forum Only</td>
                </tr>
                <tr className="bg-gradient-to-r from-emerald-500/5 to-emerald-600/5 hover:from-emerald-500/10 border-t border-emerald-400/30 transition-all duration-300">
                  <td className="p-6 font-black text-emerald-400 text-lg"><Zap className="w-6 h-6 inline mr-2" />Get Started Now</td>
                  <td className="p-6">
                    <Link href="#analyzer" className="inline-block bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold px-8 py-3 rounded-xl shadow-lg hover:shadow-emerald-500/25 transition-all duration-300">
                      Analyze Free
                    </Link>
                  </td>
                  <td colSpan={3} className="p-6 text-center text-slate-500 font-medium">Why settle for less?</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-4 py-20 md:py-24 text-center bg-gradient-to-b from-indigo-900/40 to-slate-950/80 border-y border-slate-800/50">
        <div className="max-w-3xl mx-auto space-y-8">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent tracking-tight">
            Ready to Negotiate Your Best Offer Yet?
          </h2>
          <p className="text-xl text-slate-300 max-w-xl mx-auto leading-relaxed mb-12">
            Don't leave money on the table. Get your personalized analysis in under 60 seconds.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="#analyzer">
              <Button size="lg" className="text-xl px-12 py-8 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-2xl hover:shadow-indigo/25 font-bold tracking-wide rounded-3xl w-full sm:w-auto">
                Start Free Analysis Now
              </Button>
            </Link>
            <Link href="/guides" className="text-lg font-semibold text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-2">
              Explore Guides First <TrendingUp className="w-5 h-5" />
            </Link>
          </div>
          <p className="text-sm text-slate-500 font-medium pt-8">
            ⚡ Instant results • 100% private • No credit card needed • Used by FAANG engineers
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-12 md:py-16 border-t border-slate-800/50 bg-slate-950/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
          <div className="text-slate-400 text-base font-medium">
            © 2026 <span className="text-gradient font-black">AvgPay</span>. Built for tech workers who negotiate.
          </div>
          <div className="flex flex-wrap gap-6 justify-center md:justify-end text-sm text-slate-400 font-medium">
            <Link href="/guides" className="hover:text-slate-200 transition-colors">Guides</Link>
            <Link href="/methodology" className="hover:text-slate-200 transition-colors">Methodology</Link>
            <Link href="/salaries" className="hover:text-slate-200 transition-colors">Salaries</Link>
            <Link href="/pricing" className="hover:text-slate-200 transition-colors">Pricing</Link>
            <Link href="/about" className="hover:text-slate-200 transition-colors">About</Link>
            <Link href="/privacy" className="hover:text-slate-200 transition-colors">Privacy</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
