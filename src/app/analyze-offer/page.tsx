import { Metadata } from "next";
import { OfferAnalyzer } from "@/components/offer-analyzer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmailCapture } from "@/components/email-capture";
import { Zap, Users, Shield, ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Analyze Your Offer - AvgPay",
  description: "Get instant, data-backed salary insights to negotiate your next offer with confidence.",
  openGraph: {
    title: "Analyze Your Offer - AvgPay",
    description: "Compare your offer against verified market data.",
    type: "website",
  },
};

export default function AnalyzeOfferPage() {
  return (
    <main className="min-h-screen bg-slate-50 pt-24 pb-12">
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 mb-12">
        <div className="text-center space-y-6 mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 text-sm font-medium">
            <Zap className="w-4 h-4" />
            Negotiate With Confidence
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight">
            Is Your <span className="text-emerald-600">Offer Fair</span>?
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            Upload your offer letter or manually enter details to see how it stacks up against
            real market data. We&apos;ll help you find leverage.
          </p>
        </div>

        {/* Social Proof */}
        <div className="flex items-center justify-center gap-6 text-slate-600 mb-8">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-500" />
            <span className="text-sm">10K+ offers analyzed</span>
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
            <OfferAnalyzer mode="offer" />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Lead Capture Card */}
            <Card className="bg-white border-slate-200">
              <CardContent className="p-6">
                <h3 className="font-bold text-slate-900 mb-2">Get Negotiation Tips</h3>
                <p className="text-sm text-slate-600 mb-4">
                  Receive personalized negotiation strategies based on your offer grade.
                </p>
                <EmailCapture type="negotiation-tips" buttonText="Get Tips Free" />
              </CardContent>
            </Card>

            {/* No Offer Yet? Card */}
            <Card className="bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200">
              <CardContent className="p-6">
                <h3 className="font-bold text-slate-900 mb-2">Don&apos;t Have an Offer Yet?</h3>
                <p className="text-sm text-slate-600 mb-4">
                  Check your market value before you start interviewing.
                </p>
                <Link href="/analyze-salary">
                  <Button variant="outline" className="w-full border-slate-300 hover:bg-slate-200">
                    Check Your Value
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
                    "Grade-based insights",
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
