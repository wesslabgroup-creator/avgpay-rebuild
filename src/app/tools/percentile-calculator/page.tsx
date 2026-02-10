import { Metadata } from "next";
import { PercentileCalculator } from "@/components/percentile-calculator";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, TrendingUp, Users, Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "Salary Percentile Calculator - Am I Underpaid? | AvgPay",
  description: "Find out where you stand. Compare your salary against thousands of data points and see if you're underpaid, fairly paid, or above market.",
  openGraph: {
    title: "Salary Percentile Calculator - Am I Underpaid?",
    description: "Compare your salary against market data and see where you rank.",
    type: "website",
  },
};

export default function PercentileCalculatorPage() {
  return (
    <main className="min-h-screen bg-slate-50 pt-24 pb-12">
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 mb-12">
        <div className="text-center space-y-6 mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 text-sm font-medium">
            <TrendingUp className="w-4 h-4" />
            Am I Underpaid?
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight">
            Salary <span className="text-emerald-600">Percentile</span> Calculator
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Enter your salary and see exactly where you rank. Find out if you&apos;re in the top 10%,
            50%, or falling behind in your field.
          </p>
        </div>

        {/* Social Proof */}
        <div className="flex items-center justify-center gap-6 text-slate-600 mb-8">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-500" />
            <span className="text-sm">47,000+ salaries analyzed</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-500" />
            <span className="text-sm">BLS + H-1B verified data</span>
          </div>
        </div>
      </section>

      {/* Calculator Section */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Calculator */}
          <div className="lg:col-span-2">
            <PercentileCalculator />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Why Use This */}
            <Card className="bg-white border-slate-200">
              <CardContent className="p-6">
                <h3 className="font-bold text-slate-900 mb-4">Why Check Your Percentile?</h3>
                <ul className="space-y-3">
                  {[
                    "Know if you're underpaid",
                    "Prepare for salary negotiations",
                    "Set realistic career goals",
                    "Benchmark against your peers",
                    "Identify when to ask for a raise",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-slate-600">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* How to Interpret */}
            <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200">
              <CardContent className="p-6">
                <h3 className="font-bold text-slate-900 mb-3">How to Interpret</h3>
                <div className="space-y-3 text-sm text-slate-700">
                  <div>
                    <strong className="text-emerald-700">90th+</strong> - You&apos;re highly paid
                  </div>
                  <div>
                    <strong className="text-emerald-600">75th-90th</strong> - Above market
                  </div>
                  <div>
                    <strong className="text-slate-700">50th-75th</strong> - Fair market rate
                  </div>
                  <div>
                    <strong className="text-orange-600">25th-50th</strong> - Below market
                  </div>
                  <div>
                    <strong className="text-red-600">Below 25th</strong> - Likely underpaid
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Data Source */}
            <Card className="bg-white border-slate-200">
              <CardContent className="p-6">
                <h3 className="font-bold text-slate-900 mb-2">Data Sources</h3>
                <p className="text-sm text-slate-600">
                  Our percentile calculations are based on verified data from BLS (Bureau of Labor Statistics),
                  H-1B visa filings, and user-submitted salaries validated through our AI system.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}
