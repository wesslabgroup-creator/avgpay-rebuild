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
        <main className="min-h-screen bg-surface-subtle">
            <ArticleSchema
                headline="Tech Salary Comparison Tool"
                datePublished="2026-02-10"
                authorName="AvgPay Team"
                description="Compare salaries for different tech roles, companies, and locations side-by-side."
            />

            {/* Hero Section */}
            <div className="bg-surface border-b border-border">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-20 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-info-subtle text-info text-sm font-medium mb-6">
                        <Scale className="w-4 h-4" />
                        <span>Compare & Conquer</span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-text-primary tracking-tight leading-tight mb-6">
                        Which Job Offers <br className="hidden sm:block" />
                        <span className="text-info">More Value?</span>
                    </h1>
                    <p className="text-xl text-text-secondary leading-relaxed max-w-2xl mx-auto">
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
                    <div className="bg-surface p-8 rounded-2xl shadow-sm border border-border">
                        <h3 className="text-2xl font-bold text-text-primary mb-4">Why Compare?</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0" />
                                <span className="text-text-secondary"><strong>Location Matters:</strong> A $150k salary in Austin might go further than $200k in SF.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0" />
                                <span className="text-text-secondary"><strong>Level Up:</strong> See exactly how much a promotion to Senior or Staff is worth at different companies.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0" />
                                <span className="text-text-secondary"><strong>Company Tiers:</strong> Compare Big Tech vs. Startups to weigh equity vs. base salary stability.</span>
                            </li>
                        </ul>
                    </div>
                    <div className="bg-secondary p-8 rounded-2xl text-text-inverse flex flex-col justify-center text-center">
                        <h3 className="text-2xl font-bold mb-4">Need a Deeper Dive?</h3>
                        <p className="text-text-muted mb-8">
                            Get a personalized analysis of a specific offer letter, including equity vesting and bonus details.
                        </p>
                        <Link href="/analyze-offer" className="inline-flex items-center justify-center gap-2 bg-primary-subtle0 hover:bg-primary text-text-inverse font-bold px-6 py-3 rounded-xl transition-all">
                            Analyze Specific Offer <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}
