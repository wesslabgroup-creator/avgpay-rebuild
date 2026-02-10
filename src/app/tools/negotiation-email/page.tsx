import { Metadata } from "next";
import { EmailGenerator } from "@/components/tools/email-generator";
import { Sparkles } from "lucide-react";

export const metadata: Metadata = {
    title: "Negotiation Email Generator | AvgPay",
    description: "Generate a professional, data-backed counter-offer email to increase your salary in seconds.",
};

export default function NegotiationEmailPage() {
    return (
        <main className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6">
            <div className="max-w-5xl mx-auto space-y-8">
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-800 text-sm font-medium">
                        <Sparkles className="w-4 h-4" />
                        Free Negotiation Tool
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
                        Negotiation Email Generator
                    </h1>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                        Don&apos;t know what to say? Let AI write your counter-offer email based on
                        <span className="font-semibold text-emerald-600"> real market data</span> and proven strategies.
                    </p>
                </div>

                <EmailGenerator />

                <div className="max-w-3xl mx-auto pt-12 prose text-slate-600">
                    <h2 className="text-slate-900">Why negotiate?</h2>
                    <p>
                        85% of job offers have room for negotiation, yet only 40% of candidates ask for more.
                        A single email can increase your base salary by $5k-$20k, which compounds to over
                        $100k+ in lifetime earnings.
                    </p>
                    <h3 className="text-slate-900">Tips for success:</h3>
                    <ul>
                        <li><strong>Be polite but firm.</strong> Express excitement about the role first.</li>
                        <li><strong>Use data.</strong> &quot;Market research shows...&quot; is stronger than &quot;I want...&quot;.</li>
                        <li><strong>Mention leverage.</strong> If you have another offer, mention it professionally.</li>
                    </ul>
                </div>
            </div>
        </main>
    );
}
