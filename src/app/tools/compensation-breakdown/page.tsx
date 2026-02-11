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
    <main className="min-h-screen bg-surface-subtle pt-24 pb-12">
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 mb-12">
        <div className="text-center space-y-6 mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-subtle0/10 border border-primary/20 text-primary-hover text-sm font-medium">
            <DollarSign className="w-4 h-4" />
            Understand Your Worth
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-text-primary tracking-tight">
            Compensation <span className="text-primary">Breakdown</span> Tool
          </h1>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">
            Break down total compensation into base, bonus, equity, and benefits.
            Compare offers apples-to-apples.
          </p>
        </div>

        {/* Social Proof */}
        <div className="flex items-center justify-center gap-6 text-text-secondary mb-8">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            <span className="text-sm">Used by 10K+ professionals</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
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
            <Card className="bg-surface border-border">
              <CardContent className="p-6">
                <h3 className="font-bold text-text-primary mb-4">Why Break Down Compensation?</h3>
                <ul className="space-y-3">
                  {[
                    "Compare offers accurately",
                    "Understand equity value",
                    "Calculate true take-home",
                    "Negotiate confidently",
                    "Plan your finances",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-text-secondary">
                      <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Components Explained */}
            <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-primary-subtle">
              <CardContent className="p-6">
                <h3 className="font-bold text-text-primary mb-3">Components Explained</h3>
                <div className="space-y-3 text-sm text-text-secondary">
                  <div>
                    <strong className="text-primary-hover">Base Salary</strong> - Your guaranteed annual pay
                  </div>
                  <div>
                    <strong className="text-primary">Bonus</strong> - Performance-based cash
                  </div>
                  <div>
                    <strong className="text-text-secondary">Equity</strong> - Stock options or RSUs
                  </div>
                  <div>
                    <strong className="text-orange-600">Sign-on</strong> - One-time joining bonus
                  </div>
                  <div>
                    <strong className="text-info">Benefits</strong> - Health, 401k, perks
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pro Tips */}
            <Card className="bg-surface border-border">
              <CardContent className="p-6">
                <h3 className="font-bold text-text-primary mb-2">Pro Tips</h3>
                <ul className="space-y-2 text-sm text-text-secondary">
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
