import { Metadata } from "next";
import { CompensationBreakdown } from "@/components/compensation-breakdown";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, DollarSign, Users, Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "Compensation Breakdown Calculator | AvgPay",
  description: "Break down total compensation into base salary, bonus, equity, and benefits. Compare different compensation packages side-by-side.",
  openGraph: {
    title: "Compensation Breakdown Calculator",
    description: "Understand your total compensation package with our breakdown tool.",
    type: "website",
  },
};

export default function CompensationBreakdownPage() {
  return (
    <main className="min-h-screen bg-slate-50 pt-24 pb-12">
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 mb-12">
        <div className="text-center space-y-6 mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 text-sm font-medium">
            <DollarSign className="w-4 h-4" />
            Understand Your Worth
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight">
            Compensation <span className="text-emerald-600">Breakdown</span> Tool
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Break down total compensation into base, bonus, equity, and benefits.
            Compare offers apples-to-apples.
          </p>
        </div>

        {/* Social Proof */}
        <div className="flex items-center justify-center gap-6 text-slate-600 mb-8">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-500" />
            <span className="text-sm">Used by 10K+ professionals</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-500" />
            <span className="text-sm">Real market benchmarks</span>
          </div>
        </div>
      </section>

      {/* Tool Section */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Tool */}
          <div className="lg:col-span-2">
            <CompensationBreakdown />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Why Use This */}
            <Card className="bg-white border-slate-200">
              <CardContent className="p-6">
                <h3 className="font-bold text-slate-900 mb-4">Why Break Down Compensation?</h3>
                <ul className="space-y-3">
                  {[
                    "Compare offers accurately",
                    "Understand equity value",
                    "Calculate true take-home",
                    "Negotiate confidently",
                    "Plan your finances",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-slate-600">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Components Explained */}
            <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200">
              <CardContent className="p-6">
                <h3 className="font-bold text-slate-900 mb-3">Components Explained</h3>
                <div className="space-y-3 text-sm text-slate-700">
                  <div>
                    <strong className="text-emerald-700">Base Salary</strong> - Your guaranteed annual pay
                  </div>
                  <div>
                    <strong className="text-emerald-600">Bonus</strong> - Performance-based cash
                  </div>
                  <div>
                    <strong className="text-slate-700">Equity</strong> - Stock options or RSUs
                  </div>
                  <div>
                    <strong className="text-orange-600">Sign-on</strong> - One-time joining bonus
                  </div>
                  <div>
                    <strong className="text-blue-600">Benefits</strong> - Health, 401k, perks
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pro Tips */}
            <Card className="bg-white border-slate-200">
              <CardContent className="p-6">
                <h3 className="font-bold text-slate-900 mb-2">Pro Tips</h3>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li>• Equity vests over 4 years typically</li>
                  <li>• Bonuses aren&apos;t guaranteed</li>
                  <li>• Compare total comp, not just base</li>
                  <li>• Factor in cost of living differences</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}
