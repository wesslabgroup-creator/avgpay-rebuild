"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, ArrowRight } from "lucide-react";
import { COMPANIES, ROLES, LOCATIONS, LEVELS, type MarketData } from "@/lib/shared-data";
import { fetchMarketData } from "@/app/actions/market";
import { getBestComparisonMatch } from "@/app/compare/data/curated-comparisons";

interface ComparisonPoint {
    role: string;
    company: string;
    location: string;
    level: string;
    data: MarketData | null;
}

const INITIAL_POINT: ComparisonPoint = {
    role: "Software Engineer",
    company: "Google",
    location: "San Francisco, CA",
    level: "Senior (L5-L6)",
    data: null,
};

export function SalaryComparison() {
    const [point1, setPoint1] = useState<ComparisonPoint>({ ...INITIAL_POINT });
    const [point2, setPoint2] = useState<ComparisonPoint>({
        ...INITIAL_POINT,
        company: "Meta",
        location: "New York, NY"
    });
    const [loading, setLoading] = useState(false);
    const [compared, setCompared] = useState(false);

    // Helper to update a field in one of the points
    const updatePoint = (
        pointNum: 1 | 2,
        field: keyof ComparisonPoint,
        value: string
    ) => {
        if (pointNum === 1) {
            setPoint1(prev => ({ ...prev, [field]: value }));
        } else {
            setPoint2(prev => ({ ...prev, [field]: value }));
        }
    };

    const handleCompare = async () => {
        setLoading(true);
        try {
            const data1 = await fetchMarketData(point1.company, point1.role, point1.location, point1.level);
            const data2 = await fetchMarketData(point2.company, point2.role, point2.location, point2.level);

            setPoint1(prev => ({ ...prev, data: data1 }));
            setPoint2(prev => ({ ...prev, data: data2 }));
            setCompared(true);
        } catch (error) {
            console.error("Comparison failed", error);
        } finally {
            setLoading(false);
        }
    };

    const formatMoney = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const scenarioAComparison = getBestComparisonMatch(point1.company, point1.role);
    const scenarioBComparison = getBestComparisonMatch(point2.company, point2.role);

    return (
        <div className="space-y-8">
            <div className="grid gap-6 md:grid-cols-2">
                {/* Input Column 1 */}
                <Card className="border-t-4 border-t-emerald-500 shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-emerald-700">
                            <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center font-bold text-sm">A</div>
                            Scenario A
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Company</label>
                            <Select value={point1.company} onValueChange={(v) => updatePoint(1, 'company', v)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select company" />
                                </SelectTrigger>
                                <SelectContent>
                                    {COMPANIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Role</label>
                            <Select value={point1.role} onValueChange={(v) => updatePoint(1, 'role', v)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                                <SelectContent>
                                    {ROLES.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Location</label>
                            <Select value={point1.location} onValueChange={(v) => updatePoint(1, 'location', v)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select location" />
                                </SelectTrigger>
                                <SelectContent>
                                    {LOCATIONS.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Level</label>
                            <Select value={point1.level} onValueChange={(v) => updatePoint(1, 'level', v)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select level" />
                                </SelectTrigger>
                                <SelectContent>
                                    {LEVELS.map(l => <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Input Column 2 */}
                <Card className="border-t-4 border-t-blue-500 shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-blue-700">
                            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center font-bold text-sm">B</div>
                            Scenario B
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Company</label>
                            <Select value={point2.company} onValueChange={(v) => updatePoint(2, 'company', v)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select company" />
                                </SelectTrigger>
                                <SelectContent>
                                    {COMPANIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Role</label>
                            <Select value={point2.role} onValueChange={(v) => updatePoint(2, 'role', v)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                                <SelectContent>
                                    {ROLES.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Location</label>
                            <Select value={point2.location} onValueChange={(v) => updatePoint(2, 'location', v)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select location" />
                                </SelectTrigger>
                                <SelectContent>
                                    {LOCATIONS.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Level</label>
                            <Select value={point2.level} onValueChange={(v) => updatePoint(2, 'level', v)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select level" />
                                </SelectTrigger>
                                <SelectContent>
                                    {LEVELS.map(l => <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="flex justify-center">
                <Button
                    size="lg"
                    onClick={handleCompare}
                    disabled={loading}
                    className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-6 text-lg shadow-xl hover:shadow-2xl transition-all"
                >
                    {loading ? "Comparing..." : "Compare Compensation"} <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
            </div>

            {/* Comparison Results */}
            {compared && point1.data && point2.data && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <Card className="overflow-hidden border-0 shadow-xl bg-white">
                        <CardHeader className="bg-slate-50 border-b border-slate-100 pb-8">
                            <CardTitle className="text-center text-3xl font-black text-slate-900">Total Compensation Showdown</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="grid grid-cols-2 divide-x divide-slate-100">
                                {/* Result A */}
                                <div className="p-8 text-center space-y-4 bg-emerald-50/30">
                                    <div className="inline-flex items-center justify-center p-3 bg-emerald-100 rounded-full mb-4">
                                        <Building2 className="h-8 w-8 text-emerald-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-slate-600">Scenario A</h3>
                                        <p className="text-4xl md:text-5xl font-black text-emerald-600 mt-2">
                                            {formatMoney(point1.data.median)}
                                        </p>
                                        <p className="text-sm text-slate-500 mt-1">Median Total Comp</p>
                                    </div>

                                    <div className="pt-6 space-y-3 text-sm">
                                        <div className="flex justify-between items-center border-b border-emerald-100 pb-2">
                                            <span className="text-slate-500">Base Salary Range</span>
                                            <span className="font-semibold text-slate-700">{formatMoney(point1.data.min)} - {formatMoney(point1.data.max)}</span>
                                        </div>
                                        <div className="flex justify-between items-center border-b border-emerald-100 pb-2">
                                            <span className="text-slate-500">Top 10% Earners</span>
                                            <span className="font-semibold text-slate-700">{formatMoney(point1.data.p90)}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Result B */}
                                <div className="p-8 text-center space-y-4 bg-blue-50/30">
                                    <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-full mb-4">
                                        <Building2 className="h-8 w-8 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-slate-600">Scenario B</h3>
                                        <p className="text-4xl md:text-5xl font-black text-blue-600 mt-2">
                                            {formatMoney(point2.data.median)}
                                        </p>
                                        <p className="text-sm text-slate-500 mt-1">Median Total Comp</p>
                                    </div>

                                    <div className="pt-6 space-y-3 text-sm">
                                        <div className="flex justify-between items-center border-b border-blue-100 pb-2">
                                            <span className="text-slate-500">Base Salary Range</span>
                                            <span className="font-semibold text-slate-700">{formatMoney(point2.data.min)} - {formatMoney(point2.data.max)}</span>
                                        </div>
                                        <div className="flex justify-between items-center border-b border-blue-100 pb-2">
                                            <span className="text-slate-500">Top 10% Earners</span>
                                            <span className="font-semibold text-slate-700">{formatMoney(point2.data.p90)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Difference Highlight */}
                            <div className="bg-slate-900 text-white p-6 text-center">
                                <p className="text-lg opacity-90">Difference</p>
                                <div className="text-3xl font-bold mt-2 flex items-center justify-center gap-2">
                                    {Math.abs(point1.data.median - point2.data.median) === 0 ? (
                                        <span>Exact Match</span>
                                    ) : (
                                        <>
                                            <span>{formatMoney(Math.abs(point1.data.median - point2.data.median))}</span>
                                            <span className={`text-sm py-1 px-3 rounded-full font-medium ${point1.data.median > point2.data.median ? 'bg-emerald-500 text-emerald-950' : 'bg-blue-500 text-blue-950'}`}>
                                                {point1.data.median > point2.data.median ? "Scenario A Wins" : "Scenario B Wins"}
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="mt-8 text-center space-y-3">
                        <p className="text-slate-600">Want to see the full breakdown for these roles?</p>
                        <div className="flex flex-wrap justify-center gap-3">
                            {scenarioAComparison && (
                                <Link href={`/compare/${scenarioAComparison.slug}`} className="text-sm font-semibold text-emerald-700 hover:text-emerald-600">
                                    Explore {scenarioAComparison.title}
                                </Link>
                            )}
                            {scenarioBComparison && scenarioBComparison.slug !== scenarioAComparison?.slug && (
                                <Link href={`/compare/${scenarioBComparison.slug}`} className="text-sm font-semibold text-blue-700 hover:text-blue-600">
                                    Explore {scenarioBComparison.title}
                                </Link>
                            )}
                        </div>
                        <Button variant="outline" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                            Run Another Comparison
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
