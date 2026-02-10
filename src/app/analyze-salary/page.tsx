import { Metadata } from "next";
import { OfferAnalyzer } from "@/components/offer-analyzer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmailCapture } from "@/components/email-capture";
import { TrendingUp, Users, Shield, ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Check Your Market Value - AvgPay",
  description: "Discover what you're worth in today's market. Get accurate salary data based on your role, experience, and location.",
  openGraph: {
    title: "Check Your Market Value - AvgPay",
    description: "Discover what you're worth in today's market. Get accurate salary data.",
    type: "website",
  },
};

export default function AnalyzeSalaryPage() {
  return (
    <main className="min-h-screen bg-slate-50 pt-24 pb-12">
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 mb-12">
        <div className="text-center space-y-6 mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 text-sm font-medium">
            <TrendingUp className="w-4 h-4" />
            Know Your Worth
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight">
            What's Your <span className="text-emerald-600">Market Value</span>?
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Get an instant salary estimate based on your role, experience, and location. 
            No offer required—just data-driven insights.
          </p>
        </div>

        {/* Social Proof */}
        <div className="flex items-center justify-center gap-6 text-slate-600 mb-8">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-500" />
            <span className="text-sm">10K+ professionals checked</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-500" />
            <span className="text-sm">BLS + H-1B verified data</span>
          </div>
        </div>
      </section>

      {/* Analyzer Section */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Analyzer */}
          <div className="lg:col-span-2">
            <OfferAnalyzer mode="salary" />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Lead Capture Card */}
            <Card className="bg-white border-slate-200">
              <CardContent className="p-6">
                <h3 className="font-bold text-slate-900 mb-2">Get Salary Alerts</h3>
                <p className="text-sm text-slate-600 mb-4">
                  Be the first to know when new salary data is available for your role.
                </p>
                <EmailCapture type="salary-alerts" buttonText="Subscribe Free" />
              </CardContent>
            </Card>

            {/* Have an Offer? Card */}
            <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200">
              <CardContent className="p-6">
                <h3 className="font-bold text-slate-900 mb-2">Already Have an Offer?</h3>
                <p className="text-sm text-slate-600 mb-4">
                  Compare your specific offer against market data and get a fairness grade.
                </p>
                <Link href="/analyze-offer">
                  <Button variant="outline" className="w-full border-emerald-300 hover:bg-emerald-100">
                    Analyze Your Offer
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Trust Badges */}
            <Card className="bg-white border-slate-200">
              <CardContent className="p-6">
                <h3 className="font-bold text-slate-900 mb-4">Why Trust AvgPay?</h3>
                <ul className="space-y-3">
                  {[
                    "Official BLS & H-1B data",
                    "47,000+ salaries analyzed",
                    "Updated weekly",
                    "100% free & anonymous",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-slate-600">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}
