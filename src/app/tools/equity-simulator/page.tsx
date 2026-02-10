"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { EquityChart } from "@/components/tools/equity-chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { TrendingUp, Share2, Check } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { usePostHog } from "posthog-js/react";

function SimulatorContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const posthog = usePostHog();

    // Initialize from URL or defaults
    const [grantValue, setGrantValue] = useState(() => {
        const p = searchParams.get("grant");
        return p ? parseInt(p) : 100000;
    });
    const [growthRate, setGrowthRate] = useState(() => {
        const p = searchParams.get("growth");
        return p ? parseInt(p) : 15;
    });
    const [years] = useState(4);
    const [copied, setCopied] = useState(false);

    // Sync to URL with debounce
    useEffect(() => {
        const timeout = setTimeout(() => {
            const params = new URLSearchParams();
            params.set("grant", grantValue.toString());
            params.set("growth", growthRate.toString());
            router.replace(`?${params.toString()}`, { scroll: false });
        }, 500);
        return () => clearTimeout(timeout);
    }, [grantValue, growthRate, router]);

    // Calculate data points
    const chartData = useMemo(() => {
        const data = [];

        for (let month = 0; month <= years * 12; month++) {
            // Future Value = Present Value * (1 + rate)^periods
            // We assume linear vesting over 4 years (1/48 per month)
            // Standard 1 year cliff

            const growthFactor = Math.pow(1 + (growthRate / 100), month / 12);
            const totalValueAtMonth = grantValue * growthFactor;

            let vestedPortion = 0;
            if (month >= 12) {
                vestedPortion = Math.min(month / 48, 1);
            }

            data.push({
                month,
                value: Math.round(totalValueAtMonth),
                vested: Math.round(totalValueAtMonth * vestedPortion),
            });
        }
        return data;
    }, [grantValue, growthRate, years]);

    const finalValue = chartData[chartData.length - 1].value;
    const growthMultiplier = (finalValue / grantValue).toFixed(1);

    const handleShare = () => {
        const url = window.location.href;
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        posthog?.capture('equity_simulator_shared', {
            grantValue,
            growthRate,
            finalValue
        });
    };

    return (
        <div className="grid lg:grid-cols-3 gap-8">
            {/* Controls */}
            <Card className="lg:col-span-1 h-fit">
                <CardHeader>
                    <CardTitle>Configuration</CardTitle>
                    <CardDescription>Adjust the sliders to simulate different scenarios.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                    <div className="space-y-4">
                        <div className="flex justify-between">
                            <Label>Initial Grant Value</Label>
                            <span className="font-mono font-medium text-slate-700">
                                ${grantValue.toLocaleString()}
                            </span>
                        </div>
                        <Slider
                            value={[grantValue]}
                            min={10000}
                            max={1000000}
                            step={5000}
                            onValueChange={(v) => setGrantValue(v[0])}
                            className="py-2"
                        />
                        <p className="text-xs text-muted-foreground">The total value of your stock grant today.</p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between">
                            <Label>Annual Growth Rate</Label>
                            <span className={`font-mono font-medium ${growthRate >= 20 ? 'text-emerald-600' : 'text-slate-700'}`}>
                                {growthRate}%
                            </span>
                        </div>
                        <Slider
                            value={[growthRate]}
                            min={-20}
                            max={100}
                            step={5}
                            onValueChange={(v) => setGrowthRate(v[0])}
                            className="py-2"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Conservative (5%)</span>
                            <span>Hypergrowth (50%+)</span>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100">
                        <div className="bg-slate-50 p-4 rounded-lg space-y-2">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-600">Proj. 4-Year Value</span>
                                <span className="font-bold text-emerald-600 text-lg">${finalValue.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-600">Multiplier</span>
                                <span className="font-medium text-slate-900">{growthMultiplier}x</span>
                            </div>
                        </div>
                    </div>

                    <Button variant="outline" className="w-full" onClick={handleShare}>
                        {copied ? <Check className="w-4 h-4 mr-2" /> : <Share2 className="w-4 h-4 mr-2" />}
                        {copied ? "Link Copied!" : "Share Scenario"}
                    </Button>
                </CardContent>
            </Card>

            {/* Chart */}
            <div className="lg:col-span-2 space-y-6">
                <Card className="border-emerald-100 shadow-md">
                    <CardHeader>
                        <CardTitle>Projected Value Over Time</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <EquityChart data={chartData} />
                    </CardContent>
                </Card>

                <div className="grid sm:grid-cols-2 gap-4">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Year 1 Cliff (Vested)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                ${(chartData[12].vested).toLocaleString()}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Unvested Potential (Year 4)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-emerald-600">
                                ${finalValue.toLocaleString()}
                            </div>
                            <p className="text-xs text-muted-foreground">If you stay 4 years</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

export default function EquitySimulatorPage() {
    return (
        <main className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6">
            <div className="max-w-6xl mx-auto space-y-8">
                <div className="text-center space-y-4 mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 text-indigo-800 text-sm font-medium">
                        <TrendingUp className="w-4 h-4" />
                        Startup Equity Calculator
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
                        Equity Growth Simulator
                    </h1>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                        Visualize what your stock options or RSUs could be worth if the company grows.
                    </p>
                </div>

                <Suspense fallback={<div className="text-center">Loading simulator...</div>}>
                    <SimulatorContent />
                </Suspense>
            </div>
        </main>
    );
}
