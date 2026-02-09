import { Metadata } from "next";
import { OfferAnalyzer } from "@/components/offer-analyzer";

export const metadata: Metadata = {
  title: "Analyze Your Offer - AvgPay",
  description: "Get instant, data-backed salary insights to negotiate your next offer with confidence.",
};

export default function AnalyzeOfferPage() {
  return (
    <main className="min-h-screen bg-slate-50 pt-24 pb-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center space-y-6 mb-12">
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
            Analyze Your Offer
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Enter your offer details below to see how you stack up against verified market data.
          </p>
        </div>
        
        <OfferAnalyzer />
      </div>
    </main>
  );
}
