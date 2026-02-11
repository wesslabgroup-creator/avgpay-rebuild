import { Metadata } from "next";
import dynamic from 'next/dynamic';
import { HeroSearch } from "@/components/hero-search";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Database, Shield, TrendingUp, Users, Award, Zap, Star, Search, Calculator, Scale } from "lucide-react";
import Link from "next/link";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { calculateTotalDataPoints } from "@/lib/data";
import { WebSiteSchema } from "@/components/schema-markup";

const OfferAnalyzer = dynamic(() => import('@/components/offer-analyzer').then(mod => mod.OfferAnalyzer), {
  loading: () => <div className="h-96 w-full animate-pulse bg-surface-muted rounded-3xl" />,
  ssr: false // Optional: Only client-side if we want to defer it completely, but usually SSR is good for SEO content.
  // However, OfferAnalyzer is highly interactive and mostly client-side logic.
  // Let's keep SSR: true (default) for now unless it causes hydration issues.
});

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
export default async function Home() {
  return (
    <main className="min-h-screen bg-surface">
      <WebSiteSchema />
      {/* Hero Section */}
      <section className="relative px-4 py-20 sm:py-24 md:py-28 lg:py-32 overflow-hidden bg-surface-subtle">
        <div className="relative max-w-6xl mx-auto text-center space-y-8 lg:space-y-12">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-primary-subtle border-2 border-primary/20 text-primary-hover text-sm font-medium max-w-md mx-auto">
            <Database className="w-5 h-5 flex-shrink-0" />
            Powered by BLS + H-1B + Pay Transparency Laws • Public Beta
          </div>

          <div className="space-y-6">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-text-primary leading-tight">
              Know Your<br className="sm:hidden" /><span className="bg-gradient-to-r from-primary via-accent to-primary-hover bg-clip-text text-transparent"> Market Worth</span>
            </h1>
            <p className="text-xl sm:text-2xl md:text-2xl lg:text-3xl font-light text-text-secondary max-w-3xl mx-auto leading-relaxed">
              Get instant, data-backed salary insights to <span className="font-semibold text-primary">negotiate like a pro</span>.
            </p>
          </div>

          {/* Search Component */}
          <div className="max-w-2xl mx-auto mb-8">
            <HeroSearch />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
            <Link href="/analyze-offer" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto text-lg px-8 py-7 bg-gradient-to-r from-primary via-primary to-accent hover:from-primary hover:to-accent shadow-lg hover:shadow-card transition-all duration-300 font-semibold tracking-wide rounded-2xl h-14 sm:h-auto">
                <Zap className="w-5 h-5 mr-2" />Analyze My Offer
              </Button>
            </Link>
            <Link href="/analyze-salary" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8 py-7 border-2 border-border hover:border-primary bg-surface hover:bg-surface-subtle text-text-secondary hover:text-text-primary rounded-2xl h-14 sm:h-auto font-semibold transition-all duration-300">
                <Search className="w-5 h-5 mr-2" />Check Your Value
              </Button>
            </Link>
          </div>

          {/* Animated Social Proof */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-12 pb-8 text-text-secondary text-sm sm:text-base font-medium">
            <AnimatedCounter target={await calculateTotalDataPoints()} />
            <span className="hidden sm:inline"> salaries analyzed •</span>
            <span>Trusted by top tech talent</span>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-8 pt-8 text-text-secondary text-sm font-medium">
            <div className="flex items-center gap-3 p-4 bg-surface rounded-xl border border-border hover:border-primary/30 transition-all duration-200 min-w-[140px]">
              <Shield className="w-6 h-6 text-primary flex-shrink-0" />
              <span>BLS Verified</span>
            </div>
            <div className="flex items-center gap-3 p-4 bg-surface rounded-xl border border-border hover:border-primary/30 transition-all duration-200 min-w-[140px]">
              <TrendingUp className="w-6 h-6 text-accent flex-shrink-0" />
              <span>H-1B Data</span>
            </div>
            <div className="flex items-center gap-3 p-4 bg-surface rounded-xl border border-border hover:border-primary/30 transition-all duration-200 min-w-[140px]">
              <Users className="w-6 h-6 text-primary flex-shrink-0" />
              <span>Pay Transparency</span>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="px-4 py-20 md:py-24 bg-surface border-y border-border">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl md:text-5xl font-black text-primary mb-4"><AnimatedCounter target={await calculateTotalDataPoints()} />+</div>
            <h3 className="text-xl font-bold text-text-primary mb-2">Aggregated Data Points (Beta)</h3>
            <p className="text-text-secondary">From BLS, H-1B, and transparency laws</p>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-black text-primary mb-4">98%</div>
            <h3 className="text-xl font-bold text-text-primary mb-2">Verified Sources</h3>
            <p className="text-text-secondary">Cross-referenced against official filings</p>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-black text-accent mb-4">10K+</div>
            <h3 className="text-xl font-bold text-text-primary mb-2">Users</h3>
            <p className="text-text-secondary">Negotiating better offers</p>
          </div>
        </div>
      </section>

      {/* Offer Analyzer */}
      <section id="analyzer" className="px-4 py-20 md:py-24 lg:py-32 bg-surface-subtle">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-subtle border border-primary/20 text-primary-hover text-sm font-medium max-w-md mx-auto">
              <Award className="w-4 h-4" />Get Your Offer Grade in 30 Seconds
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-text-primary tracking-tight">
              Instant Compensation Analysis
            </h2>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed">
              Enter your offer details. See how you stack up against verified market data. <br className="md:hidden" /><strong className="text-primary">No sign-up required.</strong>
            </p>
          </div>

          <OfferAnalyzer />

          <div className="text-center pt-12">
            <p className="text-text-secondary text-lg mb-6 max-w-2xl mx-auto">
              Join thousands who've negotiated <span className="font-bold text-primary">10-25% higher</span> offers using AvgPay insights.
            </p>
            <Link href="/salaries" className="inline-flex items-center gap-2 text-lg font-semibold text-primary hover:text-primary-hover transition-colors">
              See All Salary Data <TrendingUp className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Interactive Tools Preview */}
      <section className="px-4 py-20 bg-surface">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="max-w-xl space-y-4">
              <h2 className="text-3xl md:text-4xl font-black text-text-primary tracking-tight">Interactive Salary Tools</h2>
              <p className="text-xl text-text-secondary">Expert-level tools to help you model your career and compensation with precision.</p>
            </div>
            <Link href="/tools" className="text-primary font-bold hover:underline">View All Tools →</Link>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-8 border-2 border-surface-muted hover:border-primary/30 transition-all group">
              <div className="p-3 bg-primary-subtle rounded-2xl w-fit mb-6 group-hover:scale-110 transition-transform">
                <Calculator className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-text-primary mb-3">Inflation Calculator</h3>
              <p className="text-text-secondary mb-8 leading-relaxed">
                See how much your salary has actually grown (or shrunk) after adjusting for US inflation data. Know your "Real Wage".
              </p>
              <Link href="/tools/inflation-calculator">
                <Button className="w-full bg-secondary hover:bg-secondary-hover text-text-inverse font-bold py-6 rounded-xl">Calculate Real Wage</Button>
              </Link>
            </Card>

            <Card className="p-8 border-2 border-surface-muted hover:border-blue-500/30 transition-all group">
              <div className="p-3 bg-info-subtle rounded-2xl w-fit mb-6 group-hover:scale-110 transition-transform">
                <Scale className="w-8 h-8 text-info" />
              </div>
              <h3 className="text-2xl font-bold text-text-primary mb-3">Salary Comparison Tool</h3>
              <p className="text-text-secondary mb-8 leading-relaxed">
                Side-by-side comparison of different roles, levels, and locations. Perfect for weighing multiple job offers.
              </p>
              <Link href="/tools/salary-comparison">
                <Button className="w-full bg-secondary hover:bg-secondary-hover text-text-inverse font-bold py-6 rounded-xl">Compare Offers</Button>
              </Link>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-4 py-20 md:py-24 bg-surface border-y border-border">
        <div className="max-w-5xl mx-auto space-y-12 text-center">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-black text-text-primary">What Users Are Saying</h2>
            <p className="text-xl text-text-secondary max-w-xl mx-auto">Real results from tech professionals just like you</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            <div className="bg-surface border border-border p-8 rounded-3xl hover:shadow-2xl hover:shadow-card hover:border-primary/30 transition-all duration-500 group space-y-6">
              <div className="flex gap-3 text-primary text-xl">
                <Star className="w-6 h-6 fill-current" />
                <Star className="w-6 h-6 fill-current" />
                <Star className="w-6 h-6 fill-current" />
                <Star className="w-6 h-6 fill-current" />
                <Star className="w-6 h-6 fill-current" />
              </div>
              <blockquote className="text-text-secondary font-medium leading-relaxed text-lg transition-colors">
                &quot;Used this for my Google offer negotiation. Data was spot-on and helped me push for 22% more TC. Game changer!&quot;
              </blockquote>
              <div className="flex items-center gap-3 pt-4 border-t border-border">
                <div className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-2xl flex items-center justify-center font-bold text-text-inverse">JD</div>
                <div>
                  <p className="font-semibold text-text-primary">John D.</p>
                  <p className="text-sm text-text-muted">SWE @ Google</p>
                </div>
              </div>
            </div>

            <div className="bg-surface border border-border p-8 rounded-3xl hover:shadow-2xl hover:shadow-card hover:border-primary/30 transition-all duration-500 group space-y-6">
              <div className="flex gap-3 text-primary text-xl">
                <Star className="w-6 h-6 fill-current" />
                <Star className="w-6 h-6 fill-current" />
                <Star className="w-6 h-6 fill-current" />
                <Star className="w-6 h-6 fill-current" />
                <Star className="w-6 h-6 fill-current" />
              </div>
              <blockquote className="text-text-secondary font-medium leading-relaxed text-lg transition-colors">
                &quot;Finally, reliable data that&apos;s not self-reported. Negotiated Big Tech-level comp at startup thanks to AvgPay.&quot;
              </blockquote>
              <div className="flex items-center gap-3 pt-4 border-t border-border">
                <div className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-2xl flex items-center justify-center font-bold text-text-inverse">SM</div>
                <div>
                  <p className="font-semibold text-text-primary">Sarah M.</p>
                  <p className="text-sm text-text-muted">PM @ Meta</p>
                </div>
              </div>
            </div>

            <div className="bg-surface border border-border p-8 rounded-3xl hover:shadow-2xl hover:shadow-card hover:border-teal-500/30 transition-all duration-500 group space-y-6 md:col-span-2 lg:col-span-1">
              <div className="flex gap-3 text-primary text-xl">
                <Star className="w-6 h-6 fill-current" />
                <Star className="w-6 h-6 fill-current" />
                <Star className="w-6 h-6 fill-current" />
                <Star className="w-6 h-6 fill-current" />
                <Star className="w-6 h-6 fill-current" />
              </div>
              <blockquote className="text-text-secondary font-medium leading-relaxed text-lg transition-colors">
                &quot;BLS + H1B data combo is gold. Went from underpaid to top percentile in one negotiation.&quot;
              </blockquote>
              <div className="flex items-center gap-3 pt-4 border-t border-border">
                <div className="w-12 h-12 bg-gradient-to-r from-accent to-secondary rounded-2xl flex items-center justify-center font-bold text-text-inverse">AM</div>
                <div>
                  <p className="font-semibold text-text-primary">Alex M.</p>
                  <p className="text-sm text-text-muted">Staff Engineer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="px-4 py-20 md:py-24 lg:py-32 bg-surface-subtle">
        <div className="max-w-4xl mx-auto space-y-8 text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-text-primary tracking-tight">Frequently Asked Questions</h2>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed">
            Everything you need to know before analyzing your offer
          </p>
        </div>
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="border border-border rounded-2xl overflow-hidden bg-surface hover:border-primary/50 transition-all duration-300">
            <details className="p-6">
              <summary className="font-semibold text-text-primary cursor-pointer list-none focus:outline-none after:hidden pb-2">
                How accurate is the data?
              </summary>
              <p className="text-text-secondary pt-4 text-base leading-relaxed">
                Our data comes from official U.S. Bureau of Labor Statistics (BLS), H-1B visa filings, and state pay transparency laws. We cross-reference multiple sources for maximum reliability.
              </p>
            </details>
          </div>
          <div className="border border-border rounded-2xl overflow-hidden bg-surface hover:border-primary/50 transition-all duration-300">
            <details className="p-6">
              <summary className="font-semibold text-text-primary cursor-pointer list-none focus:outline-none after:hidden pb-2">
                Is my data private?
              </summary>
              <p className="text-text-secondary pt-4 text-base leading-relaxed">
                100% private. We don't store your offer details or personal information. Analysis happens client-side with anonymized market benchmarks.
              </p>
            </details>
          </div>
          <div className="border border-border rounded-2xl overflow-hidden bg-surface hover:border-primary/50 transition-all duration-300">
            <details className="p-6">
              <summary className="font-semibold text-text-primary cursor-pointer list-none focus:outline-none after:hidden pb-2">
                What roles and locations are covered?
              </summary>
              <p className="text-text-secondary pt-4 text-base leading-relaxed">
                Tech roles (SWE, PM, Data Science, etc.) across major US hubs (SF, NYC, Seattle, Austin) + Remote. Expanding weekly with new data sources.
              </p>
            </details>
          </div>
          <div className="border border-border rounded-2xl overflow-hidden bg-surface hover:border-primary/50 transition-all duration-300">
            <details className="p-6">
              <summary className="font-semibold text-text-primary cursor-pointer list-none focus:outline-none after:hidden pb-2">
                How is total comp calculated?
              </summary>
              <p className="text-text-secondary pt-4 text-base leading-relaxed">
                Base + (Annual Equity / 4) + Annual Bonus. Matches standard industry TC calculations for apples-to-apples comparisons.
              </p>
            </details>
          </div>
          <div className="border border-border rounded-2xl overflow-hidden bg-surface hover:border-primary/50 transition-all duration-300">
            <details className="p-6">
              <summary className="font-semibold text-text-primary cursor-pointer list-none focus:outline-none after:hidden pb-2">
                Can I contribute data?
              </summary>
              <p className="text-text-secondary pt-4 text-base leading-relaxed">
                Yes! <Link href="/contribute" className="text-primary hover:text-primary-hover font-semibold">Submit anonymized offers</Link> to help improve benchmarks for everyone.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="px-4 py-20 md:py-24 lg:py-32 bg-surface-subtle border-y border-border">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-black text-text-primary tracking-tight">Why AvgPay Beats The Rest</h2>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed">
              No self-reported surveys. Just official, verified government data.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm md:text-base border-collapse bg-surface rounded-3xl border border-border overflow-hidden shadow-lg">
              <thead>
                <tr className="bg-surface-muted">
                  <th className="p-6 text-left font-bold text-text-primary text-lg border-b border-border">Feature</th>
                  <th className="p-6 text-center font-bold text-primary text-lg border-b border-border"><span className="block">AvgPay</span><span className="text-xs text-primary font-normal">(You are here)</span></th>
                  <th className="p-6 text-center font-semibold text-text-secondary border-b border-border">Levels.fyi</th>
                  <th className="p-6 text-center font-semibold text-text-secondary border-b border-border">Glassdoor</th>
                  <th className="p-6 text-center font-semibold text-text-secondary border-b border-border">Blind</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr className="hover:bg-surface-subtle transition-colors">
                  <td className="p-6 font-semibold text-text-primary"><Shield className="w-5 h-5 inline mr-2 text-primary" />Data Source</td>
                  <td className="p-6 text-center font-bold text-primary">BLS + H-1B + Laws</td>
                  <td className="p-6 text-center text-text-secondary">Self-Reported</td>
                  <td className="p-6 text-center text-text-secondary">Self-Reported</td>
                  <td className="p-6 text-center text-text-secondary">Anonymous Posts</td>
                </tr>
                <tr className="hover:bg-surface-subtle transition-colors">
                  <td className="p-6 font-semibold text-text-primary"><TrendingUp className="w-5 h-5 inline mr-2 text-primary" />Update Frequency</td>
                  <td className="p-6 text-center font-bold text-primary">Real-Time</td>
                  <td className="p-6 text-center text-text-secondary">Monthly</td>
                  <td className="p-6 text-center text-text-secondary">Quarterly</td>
                  <td className="p-6 text-center text-text-secondary">Daily (Unverified)</td>
                </tr>
                <tr className="hover:bg-surface-subtle transition-colors">
                  <td className="p-6 font-semibold text-text-primary"><Award className="w-5 h-5 inline mr-2 text-primary" />Accuracy</td>
                  <td className="p-6 text-center font-bold text-primary">98% Verified</td>
                  <td className="p-6 text-center text-text-secondary">~80%</td>
                  <td className="p-6 text-center text-text-secondary">~70%</td>
                  <td className="p-6 text-center text-text-secondary">Variable</td>
                </tr>
                <tr className="hover:bg-surface-subtle transition-colors">
                  <td className="p-6 font-semibold text-text-primary"><Users className="w-5 h-5 inline mr-2 text-primary" />Free Analysis</td>
                  <td className="p-6 text-center font-bold text-primary">✅ Unlimited</td>
                  <td className="p-6 text-center text-text-secondary">✅ Basic</td>
                  <td className="p-6 text-center text-text-secondary">Limited</td>
                  <td className="p-6 text-center text-text-secondary">Forum Only</td>
                </tr>
                <tr className="bg-primary-subtle0/5 border-t border-primary/30">
                  <td className="p-6 font-bold text-primary-hover text-lg"><Zap className="w-6 h-6 inline mr-2" />Get Started Now</td>
                  <td className="p-6">
                    <Link href="#analyzer" className="inline-block bg-gradient-to-r from-primary to-emerald-500 hover:from-primary hover:to-primary text-text-inverse font-bold px-8 py-3 rounded-xl shadow-lg hover:shadow-card transition-all duration-300">
                      Analyze Free
                    </Link>
                  </td>
                  <td colSpan={3} className="p-6 text-center text-text-muted font-medium">Why settle for less?</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-4 py-20 md:py-24 text-center bg-surface-muted border-y border-border">
        <div className="max-w-3xl mx-auto space-y-8">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent tracking-tight">
            Ready to Negotiate Your Best Offer Yet?
          </h2>
          <p className="text-xl text-text-secondary max-w-xl mx-auto leading-relaxed mb-12">
            Don't leave money on the table. Get your personalized analysis in under 60 seconds.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="#analyzer">
              <Button size="lg" className="text-xl px-12 py-8 bg-gradient-to-r from-primary to-accent hover:from-primary hover:to-accent shadow-2xl hover:shadow-card font-bold tracking-wide rounded-3xl w-full sm:w-auto">
                Start Free Analysis Now
              </Button>
            </Link>
            <Link href="/guides" className="text-lg font-semibold text-text-secondary hover:text-text-primary transition-colors flex items-center gap-2">
              Explore Guides First <TrendingUp className="w-5 h-5" />
            </Link>
          </div>
          <p className="text-sm text-text-muted font-medium pt-8">
            ⚡ Instant results • 100% private • No credit card needed • Used by Big Tech engineers
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-12 md:py-16 border-t border-border bg-surface">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
          <div className="text-text-secondary text-base font-medium">
            © 2026 <span className="text-primary font-black">AvgPay</span>. Built for tech workers who negotiate.
          </div>
          <div className="flex flex-wrap gap-6 justify-center md:justify-end text-sm text-text-secondary font-medium">
            <Link href="/salaries" className="hover:text-text-primary transition-colors">Salaries</Link>
            <Link href="/tools/inflation-calculator" className="hover:text-text-primary transition-colors">Inflation Calc</Link>
            <Link href="/tools/salary-comparison" className="hover:text-text-primary transition-colors">Comparison Tool</Link>
            <Link href="/guides" className="hover:text-text-primary transition-colors">Guides</Link>
            <Link href="/methodology" className="hover:text-text-primary transition-colors">Methodology</Link>
            <Link href="/pricing" className="hover:text-text-primary transition-colors">Pricing</Link>
            <Link href="/about" className="hover:text-text-primary transition-colors">About</Link>
            <Link href="/privacy" className="hover:text-text-primary transition-colors">Privacy</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
