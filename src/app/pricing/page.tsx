import { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X, Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "Pricing | AvgPay",
  description: "Invest in your career. Get the data you need to negotiate a 20% raise.",
};

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-white">

      <div className="px-6 py-20">
        <div className="max-w-5xl mx-auto space-y-16">
          <div className="text-center space-y-6 max-w-2xl mx-auto">
            <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight">
              Negotiate Like a Pro
            </h1>
            <p className="text-xl text-slate-600">
              Most candidates leave <span className="font-semibold text-emerald-600">$20k - $50k</span> on the table because they don&apos;t know the real market rate.
              Small investment, massive ROI.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Free Tier */}
            <Card className="border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-slate-900">Basic</CardTitle>
                <CardDescription className="text-slate-500">For casual browsing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-4xl font-bold text-slate-900">$0</div>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3 text-slate-600">
                    <Check className="w-5 h-5 text-green-500 shrink-0" />
                    <span>Browse public salary data</span>
                  </li>
                  <li className="flex items-start gap-3 text-slate-600">
                    <Check className="w-5 h-5 text-green-500 shrink-0" />
                    <span>Basic &quot;Grade My Offer&quot; check</span>
                  </li>
                  <li className="flex items-start gap-3 text-slate-400">
                    <X className="w-5 h-5 shrink-0" />
                    <span>Detailed equity & bonus breakdown</span>
                  </li>
                  <li className="flex items-start gap-3 text-slate-400">
                    <X className="w-5 h-5 shrink-0" />
                    <span>Negotiation email templates</span>
                  </li>
                  <li className="flex items-start gap-3 text-slate-400">
                    <X className="w-5 h-5 shrink-0" />
                    <span>Verified &quot;Real Offer&quot; database</span>
                  </li>
                </ul>
                <Button variant="outline" className="w-full">Continue Free</Button>
              </CardContent>
            </Card>

            {/* Interview Pass */}
            <Card className="border-emerald-200 bg-emerald-50/50 shadow-md relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">
                Popular
              </div>
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-emerald-900">Interview Pass</CardTitle>
                <CardDescription className="text-emerald-600/80">7-day full access</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-emerald-900">$19</span>
                  <span className="text-emerald-600 font-medium">/ week</span>
                </div>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3 text-emerald-800">
                    <Check className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span><strong>Full Salary & Equity Data</strong></span>
                  </li>
                  <li className="flex items-start gap-3 text-emerald-800">
                    <Check className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>Verified &quot;Real Offer&quot; database</span>
                  </li>
                  <li className="flex items-start gap-3 text-emerald-800">
                    <Check className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span><strong>Negotiation Scripts</strong> (Copy/Paste)</span>
                  </li>
                  <li className="flex items-start gap-3 text-emerald-800">
                    <Check className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>Unlimited Offer Analysis</span>
                  </li>
                </ul>
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold">
                  Get 7-Day Access
                </Button>
                <p className="text-xs text-center text-emerald-500">One-time payment. No auto-renew.</p>
              </CardContent>
            </Card>

            {/* Career Lifetime */}
            <Card className="border-slate-200 bg-white shadow-lg hover:shadow-xl transition-all scale-105 z-10">
              <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-amber-500"></div>
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-5 h-5 text-amber-500 fill-amber-500" />
                  <span className="text-sm font-bold text-amber-600 uppercase tracking-wide">Best Value</span>
                </div>
                <CardTitle className="text-2xl font-bold text-slate-900">Career Lifetime</CardTitle>
                <CardDescription className="text-slate-500">Negotiate every job forever</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-slate-900">$49</span>
                  <span className="text-slate-500 font-medium">one-time</span>
                </div>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3 text-slate-700">
                    <Check className="w-5 h-5 text-green-500 shrink-0" />
                    <span><strong>Everything in Interview Pass</strong></span>
                  </li>
                  <li className="flex items-start gap-3 text-slate-700">
                    <Check className="w-5 h-5 text-green-500 shrink-0" />
                    <span><strong>Lifetime Access</strong> (All future updates)</span>
                  </li>
                  <li className="flex items-start gap-3 text-slate-700">
                    <Check className="w-5 h-5 text-green-500 shrink-0" />
                    <span>Compare Competing Offers Tool</span>
                  </li>
                  <li className="flex items-start gap-3 text-slate-700">
                    <Check className="w-5 h-5 text-green-500 shrink-0" />
                    <span>Early access to new features</span>
                  </li>
                </ul>
                <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-6 text-lg shadow-lg">
                  Buy Lifetime Access
                </Button>
                <p className="text-xs text-center text-slate-400">Pay once, own it forever.</p>
              </CardContent>
            </Card>
          </div>

          <div className="bg-slate-50 rounded-2xl p-8 md:p-12 text-center border border-slate-100">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Why charge for this?</h3>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              We charge a small fee so we don&apos;t have to sell your data to recruiters.
              Most salary sites are actually lead-gen for recruiting agencies.
              <strong> We work for you, not them.</strong>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
