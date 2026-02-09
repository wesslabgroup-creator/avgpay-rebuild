import { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

export const metadata: Metadata = {
  title: "Pricing | AvgPay",
  description: "Free salary insights or upgrade to PRO for full analysis and negotiation tools.",
};

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-slate-950">
      
      <div className="px-6 py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-slate-100">Simple Pricing</h1>
            <p className="text-xl text-slate-400">
              Free for everyone. Upgrade for power users.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Free Tier */}
            <Card className="border-slate-700 bg-slate-900">
              <CardHeader>
                <CardTitle className="text-2xl text-slate-100">Free</CardTitle>
                <p className="text-slate-400">For job seekers exploring options</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-4xl font-bold text-slate-100">$0</div>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2 text-slate-300">
                    <Check className="w-5 h-5 text-green-400" />
                    <span>View all salary pages</span>
                  </li>
                  <li className="flex items-center gap-2 text-slate-300">
                    <Check className="w-5 h-5 text-green-400" />
                    <span>1 basic Offer Analyzer use</span>
                  </li>
                  <li className="flex items-center gap-2 text-slate-300">
                    <Check className="w-5 h-5 text-green-400" />
                    <span>Contribute salary data</span>
                  </li>
                  <li className="flex items-center gap-2 text-slate-500">
                    <X className="w-5 h-5" />
                    <span>Multi-offer comparison</span>
                  </li>
                  <li className="flex items-center gap-2 text-slate-500">
                    <X className="w-5 h-5" />
                    <span>Negotiation scripts</span>
                  </li>
                  <li className="flex items-center gap-2 text-slate-500">
                    <X className="w-5 h-5" />
                    <span>4-year equity projection</span>
                  </li>
                </ul>
                <Button variant="outline" className="w-full">Get Started</Button>
              </CardContent>
            </Card>

            {/* Monthly Tier */}
            <Card className="border-slate-700 bg-slate-900">
              <CardHeader>
                <CardTitle className="text-2xl text-slate-100">Monthly</CardTitle>
                <p className="text-slate-400">Flexible access</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-slate-100">$29</span>
                  <span className="text-slate-400">/month</span>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2 text-slate-300">
                    <Check className="w-5 h-5 text-green-400" />
                    <span>Everything in Free</span>
                  </li>
                  <li className="flex items-center gap-2 text-slate-300">
                    <Check className="w-5 h-5 text-green-400" />
                    <span>Full Offer Analyzer</span>
                  </li>
                  <li className="flex items-center gap-2 text-slate-300">
                    <Check className="w-5 h-5 text-green-400" />
                    <span>Multi-offer comparison</span>
                  </li>
                  <li className="flex items-center gap-2 text-slate-300">
                    <Check className="w-5 h-5 text-green-400" />
                    <span>Company-specific negotiation scripts</span>
                  </li>
                  <li className="flex items-center gap-2 text-slate-300">
                    <Check className="w-5 h-5 text-green-400" />
                    <span>4-year equity projection</span>
                  </li>
                  <li className="flex items-center gap-2 text-slate-300">
                    <Check className="w-5 h-5 text-green-400" />
                    <span>Save offers (12 months)</span>
                  </li>
                  <li className="flex items-center gap-2 text-slate-300">
                    <Check className="w-5 h-5 text-green-400" />
                    <span>Market change alerts</span>
                  </li>
                </ul>
                <Button variant="outline" className="w-full">Subscribe Monthly</Button>
              </CardContent>
            </Card>

            {/* Lifetime Tier */}
            <Card className="border-indigo-500 relative overflow-hidden bg-slate-900">
              <div className="absolute top-0 right-0 bg-indigo-500 text-white text-xs px-3 py-1 rounded-bl-lg">
                Best Value
              </div>
              <CardHeader>
                <CardTitle className="text-2xl text-slate-100">Lifetime</CardTitle>
                <p className="text-slate-400">Pay once, negotiate forever</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-slate-100">$49</span>
                  <span className="text-slate-400">one-time</span>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2 text-slate-300">
                    <Check className="w-5 h-5 text-green-400" />
                    <span>Everything in Free</span>
                  </li>
                  <li className="flex items-center gap-2 text-slate-300">
                    <Check className="w-5 h-5 text-green-400" />
                    <span>Full Offer Analyzer</span>
                  </li>
                  <li className="flex items-center gap-2 text-slate-300">
                    <Check className="w-5 h-5 text-green-400" />
                    <span>Multi-offer comparison</span>
                  </li>
                  <li className="flex items-center gap-2 text-slate-300">
                    <Check className="w-5 h-5 text-green-400" />
                    <span>Company-specific negotiation scripts</span>
                  </li>
                  <li className="flex items-center gap-2 text-slate-300">
                    <Check className="w-5 h-5 text-green-400" />
                    <span>4-year equity projection</span>
                  </li>
                  <li className="flex items-center gap-2 text-slate-300">
                    <Check className="w-5 h-5 text-green-400" />
                    <span>Save offers (12 months)</span>
                  </li>
                  <li className="flex items-center gap-2 text-slate-300">
                    <Check className="w-5 h-5 text-green-400" />
                    <span>Market change alerts</span>
                  </li>
                </ul>
                <Button className="w-full bg-gradient-to-r from-indigo-600 to-violet-600">
                  Upgrade to PRO
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="text-center text-slate-500 text-sm">
            30-day money-back guarantee. No questions asked.
          </div>
        </div>
      </div>
    </main>
  );
}
