import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { TrendingUp, MapPin, Building2, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    getMarketData,
    ROLES,
    LOCATIONS,
} from '@/lib/data';
import { slugify, findFromSlug } from '@/lib/utils';
import { ArticleSchema } from '@/components/schema-markup';

// Force static generation for these pages
export const dynamic = 'force-static';
export const revalidate = 86400; // Revalidate daily

interface PageParams {
    params: {
        role: string;
        location: string;
    };
}

export async function generateStaticParams() {
    const params: { role: string; location: string }[] = [];

    // Generate combinations for all roles and locations
    for (const role of ROLES) {
        for (const location of LOCATIONS) {
            params.push({
                role: slugify(role),
                location: slugify(location),
            });
        }
    }

    return params;
}

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
    const role = findFromSlug(params.role, ROLES);
    const location = findFromSlug(params.location, LOCATIONS);

    if (!role || !location) return { title: 'Not Found' };

    return {
        title: `${role} Salary in ${location} | AvgPay Market Data`,
        description: `Real-time salary data for ${role} positions in ${location}. See median total compensation, base salary ranges, and equity benchmarks.`,
        keywords: `${role} salary ${location}, ${role} compensation, tech salaries ${location}, ${role} pay range`,
    };
}

export default async function RoleLocationPage({ params }: PageParams) {
    const role = findFromSlug(params.role, ROLES);
    const location = findFromSlug(params.location, LOCATIONS);

    if (!role || !location) {
        notFound();
    }

    // Fetch data for "Mid (L3-L4)" as a benchmark default, or average across levels (simplified here)
    // To show a comprehensive view, we might want to show range across levels
    // For this MVP page, let's fetch data for a representative company (e.g. Google) to show "Top Tier"
    // and maybe an average of a few checks.

    // Better approach: Use getMarketData but we need a company. 
    // Since this page is generic to Role+Location, we should ideally aggregate.
    // But getMarketData requires a company.
    // Let's pick "Google" as the benchmark for "Top Tier" reference, 
    // OR we can iterate companies to find a range.

    // Let's get ranges for "Senior (L5-L6)" at a few top companies to show "Market Leaders"
    const topCompanies = ['Google', 'Meta', 'Amazon'];
    const dataPoints = await Promise.all(
        topCompanies.map(async (company) => {
            const data = await getMarketData(company, role, location, 'Senior (L5-L6)');
            return { company, data };
        })
    );

    // Calculate an "Market Average" from these top tiers (simplified)
    const validData = dataPoints.filter(d => d.data.median > 0);
    const avgMedian = validData.length > 0
        ? Math.round(validData.reduce((acc, curr) => acc + curr.data.median, 0) / validData.length)
        : 0;

    const formatMoney = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <main className="min-h-screen bg-white">
            <ArticleSchema
                headline={`${role} Salary in ${location}`}
                datePublished={new Date().toISOString().split('T')[0]}
                authorName="AvgPay Team"
                description={`Comprehensive salary report for ${role} roles in ${location}.`}
            />

            {/* Breadcrumb */}
            <div className="bg-slate-50 border-b border-slate-200">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center text-sm text-slate-500">
                        <Link href="/" className="hover:text-slate-900">Home</Link>
                        <span className="mx-2">/</span>
                        <Link href="/salaries" className="hover:text-slate-900">Salaries</Link>
                        <span className="mx-2">/</span>
                        <span className="text-slate-900 font-medium">{role} in {location}</span>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                <div className="grid lg:grid-cols-3 gap-12">

                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-12">

                        {/* Header */}
                        <div>
                            <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">
                                {role} Salary in <span className="text-emerald-600 block sm:inline">{location}</span>
                            </h1>
                            <p className="text-xl text-slate-600 leading-relaxed">
                                Market benchmarks for {role} professionals in the {location} area.
                                Data reflects total compensation including base salary, stock grants, and bonuses.
                            </p>
                        </div>

                        {/* Quick Stats Grid */}
                        <div className="grid sm:grid-cols-2 gap-4">
                            <Card className="bg-emerald-50 border-emerald-100">
                                <CardContent className="p-6">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="p-2 bg-emerald-100 rounded-lg">
                                            <TrendingUp className="w-5 h-5 text-emerald-600" />
                                        </div>
                                        <span className="font-semibold text-emerald-900">Market Median (Top Tier)</span>
                                    </div>
                                    <div className="text-3xl font-black text-slate-900">
                                        {formatMoney(avgMedian)}
                                    </div>
                                    <p className="text-sm text-emerald-700 mt-1">Total Yearly Compensation</p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-6">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="p-2 bg-blue-50 rounded-lg">
                                            <MapPin className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <span className="font-semibold text-slate-700">Location Adjustment</span>
                                    </div>
                                    <div className="text-3xl font-bold text-slate-900">
                                        100%
                                    </div>
                                    <p className="text-sm text-slate-500 mt-1">Cost of Living Factor (Base)</p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Company Breakdown */}
                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                                <Building2 className="w-6 h-6 text-slate-400" />
                                Top Companies for {role}s
                            </h2>
                            <div className="space-y-4">
                                {validData.map((d) => (
                                    <div key={d.company} className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl hover:border-emerald-200 hover:shadow-sm transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500">
                                                {d.company[0]}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-slate-900">{d.company}</h3>
                                                <p className="text-xs text-slate-500">Senior Level Estimate</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-slate-900">{formatMoney(d.data.median)}</div>
                                            <div className="text-xs text-emerald-600 font-medium">Top Tier</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* CTA */}
                        <div className="bg-slate-900 rounded-2xl p-8 text-white text-center">
                            <h2 className="text-2xl font-bold mb-4">Are you paid fairly?</h2>
                            <p className="text-slate-300 mb-8 max-w-lg mx-auto">
                                Stop guessing. Upload your offer letter or enter your details to get a personalized compensation analysis for {role} roles.
                            </p>
                            <Link href="/analyze-offer">
                                <Button size="lg" className="bg-emerald-500 hover:bg-emerald-400 text-white border-0">
                                    Analyze My Pay <ArrowRight className="ml-2 w-4 h-4" />
                                </Button>
                            </Link>
                        </div>

                    </div>

                    {/* Sidebar */}
                    <div className="space-y-8">
                        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 sticky top-24">
                            <h3 className="font-bold text-slate-900 mb-4">Related Locations</h3>
                            <ul className="space-y-2">
                                {LOCATIONS.filter(l => l !== location).slice(0, 5).map(l => (
                                    <li key={l}>
                                        <Link
                                            href={`/salaries/${slugify(role)}/${slugify(l)}`}
                                            className="text-slate-600 hover:text-emerald-600 hover:underline block py-1"
                                        >
                                            {role} in {l}
                                        </Link>
                                    </li>
                                ))}
                            </ul>

                            <h3 className="font-bold text-slate-900 mt-8 mb-4">Other Roles in {location}</h3>
                            <ul className="space-y-2">
                                {ROLES.filter(r => r !== role).map(r => (
                                    <li key={r}>
                                        <Link
                                            href={`/salaries/${slugify(r)}/${slugify(location)}`}
                                            className="text-slate-600 hover:text-emerald-600 hover:underline block py-1"
                                        >
                                            {r} in {location}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                </div>
            </div>
        </main>
    );
}
