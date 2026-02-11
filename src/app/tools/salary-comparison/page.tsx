import { Metadata } from "next";
import { SalaryComparison } from "@/components/salary-comparison";
import { ArrowRight, Scale, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { ArticleSchema } from "@/components/schema-markup";

export const metadata: Metadata = {
    title: "Salary Comparison Tool | Compare Tech Jobs Side-by-Side | AvgPay",
    description: "Compare salaries for different tech roles, companies, and locations. See which career path pays more with our free compensation comparison tool.",
    keywords: "salary comparison, compare job offers, tech salary comparison, software engineer salary comparison, cost of living adjustment",
    openGraph: {
        title: "Salary Comparison Tool | Compare Tech Jobs Side-by-Side",
        description: "Compare salaries for different tech roles, companies, and locations.",
        type: "website",
    }
};

export default function SalaryComparisonPage() {
    return (
        <main className="min-h-screen bg-slate-50">
            <ArticleSchema
                headline="Tech Salary Comparison Tool"
                datePublished="2026-02-10"
                authorName="AvgPay Team"
                description="Compare salaries for different tech roles, companies, and locations side-by-side."
            />

            {/* Hero Section */}
            <div className="bg-white border-b border-slate-200">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-20 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-6">
                        <Scale className="w-4 h-4" />
                        <span>Compare & Conquer</span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight mb-6">
                        Which Job Offers <br className="hidden sm:block" />
                        <span className="text-blue-600">More Value?</span>
                    </h1>
                    <p className="text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
                        Don&apos;t just guess. Compare two career paths side-by-side to see the real difference in total compensation.
                    </p>
                </div>
            </div>

            {/* Tool Section */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 -mt-8">
                <SalaryComparison />
            </div>

            {/* Content Section */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 space-y-12">
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                        <h3 className="text-2xl font-bold text-slate-900 mb-4">Why Compare?</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <CheckCircle2 className="w-6 h-6 text-emerald-500 flex-shrink-0" />
                                <span className="text-slate-700"><strong>Location Matters:</strong> A $150k salary in Austin might go further than $200k in SF.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle2 className="w-6 h-6 text-emerald-500 flex-shrink-0" />
                                <span className="text-slate-700"><strong>Level Up:</strong> See exactly how much a promotion to Senior or Staff is worth at different companies.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle2 className="w-6 h-6 text-emerald-500 flex-shrink-0" />
                                <span className="text-slate-700"><strong>Company Tiers:</strong> Compare Big Tech vs. Startups to weigh equity vs. base salary stability.</span>
                            </li>
                        </ul>
                    </div>
                    <div className="bg-slate-900 p-8 rounded-2xl text-white flex flex-col justify-center text-center">
                        <h3 className="text-2xl font-bold mb-4">Need a Deeper Dive?</h3>
                        <p className="text-slate-300 mb-8">
                            Get a personalized analysis of a specific offer letter, including equity vesting and bonus details.
                        </p>
                        <Link href="/analyze-offer" className="inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-bold px-6 py-3 rounded-xl transition-all">
                            Analyze Specific Offer <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}
