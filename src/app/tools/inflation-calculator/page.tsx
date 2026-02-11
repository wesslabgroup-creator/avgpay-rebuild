import { Metadata } from "next";
import { InflationCalculator } from "@/components/inflation-calculator";
import { ArrowRight, Calculator, DollarSign, TrendingUp } from "lucide-react";
import Link from "next/link";
import { ArticleSchema } from "@/components/schema-markup";

export const metadata: Metadata = {
    title: "Salary Inflation Calculator 2026 | Real Wage Growth Tool",
    description: "Calculate your real salary adjusted for inflation. See if your raises are keeping up with CP and check your actual purchasing power.",
    keywords: "inflation calculator, salary inflation adjustment, real wage calculator, cpi salary calculator, purchasing power calculator",
    openGraph: {
        title: "Salary Inflation Calculator | Are You Earning Less Than You Think?",
        description: "Check your real salary growth adjusted for inflation (CPI).",
        type: "website",
    }
};

export default function InflationCalculatorPage() {
    return (
        <main className="min-h-screen bg-slate-50">
            <ArticleSchema
                headline="Salary Inflation Calculator"
                datePublished="2026-02-10"
                authorName="AvgPay Team"
                description="A tool to calculate real wage growth adjusted for US CPI inflation."
            />

            {/* Hero Section */}
            <div className="bg-white border-b border-slate-200">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm font-medium mb-6">
                            <Calculator className="w-4 h-4" />
                            <span>Free Financial Tool</span>
                        </div>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight mb-6">
                            Is Inflation Eating <br className="hidden sm:block" />
                            <span className="text-emerald-600">Your Raise?</span>
                        </h1>
                        <p className="text-xl text-slate-600 leading-relaxed max-w-2xl">
                            A $100,000 salary in 2020 is worth significantly less today.
                            Use this calculator to see your <strong>real wage growth</strong> adjusted for U.S. CPI inflation.
                        </p>
                    </div>
                </div>
            </div>

            {/* Calculator Section */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 -mt-8">
                <InflationCalculator />
            </div>

            {/* Content Section */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 space-y-12">

                <div className="grid md:grid-cols-3 gap-8 text-center">
                    <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
                        <TrendingUp className="w-10 h-10 text-emerald-500 mx-auto mb-4" />
                        <h3 className="font-bold text-slate-900">CPI Data Source</h3>
                        <p className="text-sm text-slate-600 mt-2">Uses official BLS Consumer Price Index (CPI-U) data.</p>
                    </div>
                    <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
                        <DollarSign className="w-10 h-10 text-emerald-500 mx-auto mb-4" />
                        <h3 className="font-bold text-slate-900">Real Wage Growth</h3>
                        <p className="text-sm text-slate-600 mt-2">Calculates if your purchasing power has actually increased.</p>
                    </div>
                    <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
                        <Calculator className="w-10 h-10 text-emerald-500 mx-auto mb-4" />
                        <h3 className="font-bold text-slate-900">Negotiation Ready</h3>
                        <p className="text-sm text-slate-600 mt-2">Get the exact number you need to ask for to break even.</p>
                    </div>
                </div>

                <div className="prose prose-slate max-w-none">
                    <h2>Why This Matters</h2>
                    <p>
                        Many professionals get a 3-5% annual raise and feel like they&apos;re moving forward.
                        However, if inflation is running at 6%, <strong>you successfully negotiated a pay cut</strong>.
                    </p>
                    <p>
                        Understanding &quot;Real Wages&quot; (wages adjusted for inflation) is critical for long-term wealth building
                        and career strategy. If your company isn&apos;t matching inflation, you are effectively being paid less
                        for the same work every single year.
                    </p>
                </div>

                <div className="bg-slate-900 rounded-3xl p-8 sm:p-12 text-center text-white relative overflow-hidden">
                    <div className="relative z-10 space-y-6">
                        <h2 className="text-3xl font-bold">Check Your Market Value</h2>
                        <p className="text-slate-300 max-w-xl mx-auto text-lg">
                            Don&apos;t just keep up with inflation. Beat it. See what top tech companies are paying for your role right now.
                        </p>
                        <Link href="/analyze-offer" className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-bold px-8 py-4 rounded-xl transition-all transform hover:scale-105">
                            Analyze My Salary <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>

                    {/* Decorative background elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -ml-32 -mb-32"></div>
                </div>

            </div>
        </main>
    );
}
