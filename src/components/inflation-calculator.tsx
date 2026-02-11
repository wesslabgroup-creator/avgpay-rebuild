"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, TrendingDown, DollarSign, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Simplified CPI data (Consumer Price Index - All Urban Consumers)
// Base year 1982-84 = 100
// Source: BLS
const CPI_DATA: Record<number, number> = {
    2000: 172.2,
    2001: 177.1,
    2002: 179.9,
    2003: 184.0,
    2004: 188.9,
    2005: 195.3,
    2006: 201.6,
    2007: 207.3,
    2008: 215.3,
    2009: 214.5,
    2010: 218.1,
    2011: 224.9,
    2012: 229.6,
    2013: 233.0,
    2014: 236.7,
    2015: 237.0,
    2016: 240.0,
    2017: 245.1,
    2018: 251.1,
    2019: 255.7,
    2020: 258.8,
    2021: 271.0,
    2022: 292.7,
    2023: 304.7,
    2024: 314.1, // Estimate/Avg
    2025: 322.0, // Projected
    2026: 330.0, // Projected
};

const YEARS = Object.keys(CPI_DATA).map(Number).sort((a, b) => b - a);

export function InflationCalculator() {
    const [startYear, setStartYear] = useState<string>("2020");
    const [endYear, setEndYear] = useState<string>("2026");
    const [startSalary, setStartSalary] = useState<string>("100000");
    const [currentSalary, setCurrentSalary] = useState<string>("");
    const [result, setResult] = useState<{
        adjustedSalary: number;
        inflationRate: number;
        purchasingPowerChange: number | null;
    } | null>(null);

    const calculateInflation = () => {
        const startCPI = CPI_DATA[parseInt(startYear)];
        const endCPI = CPI_DATA[parseInt(endYear)];
        const salary = parseFloat(startSalary);
        const current = currentSalary ? parseFloat(currentSalary) : null;

        if (!startCPI || !endCPI || isNaN(salary)) return;

        const inflationFactor = endCPI / startCPI;
        const adjustedSalary = salary * inflationFactor;
        const inflationRate = ((endCPI - startCPI) / startCPI) * 100;

        let purchasingPowerChange = null;
        if (current !== null) {
            // Real wage growth calculation
            // If current salary is 120k, but adjusted is 130k, you lost purchasing power
            purchasingPowerChange = ((current - adjustedSalary) / adjustedSalary) * 100;
        }

        setResult({
            adjustedSalary,
            inflationRate,
            purchasingPowerChange,
        });
    };

    const formatMoney = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <div className="grid gap-8 lg:grid-cols-2">
            <Card className="h-fit">
                <CardHeader>
                    <CardTitle>Calculate Your Real Worth</CardTitle>
                    <CardDescription>
                        See how inflation has impacted your salary&apos;s purchasing power since you started.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Starting Salary</label>
                        <div className="relative">
                            <DollarSign className="absolute left-3 top-3 h-4 w-4 text-text-muted" />
                            <Input
                                type="number"
                                className="pl-9"
                                value={startSalary}
                                onChange={(e) => setStartSalary(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Start Year</label>
                            <Select value={startYear} onValueChange={setStartYear}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {YEARS.map(year => (
                                        <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">End Year</label>
                            <Select value={endYear} onValueChange={setEndYear}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {YEARS.filter(y => y >= parseInt(startYear)).map(year => (
                                        <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium flex justify-between">
                            <span>Current Salary (Optional)</span>
                            <span className="text-text-muted font-normal">To calculate real growth</span>
                        </label>
                        <div className="relative">
                            <DollarSign className="absolute left-3 top-3 h-4 w-4 text-text-muted" />
                            <Input
                                type="number"
                                className="pl-9"
                                placeholder="e.g. 120000"
                                value={currentSalary}
                                onChange={(e) => setCurrentSalary(e.target.value)}
                            />
                        </div>
                    </div>

                    <Button
                        className="w-full bg-primary hover:bg-primary-hover text-lg py-6"
                        onClick={calculateInflation}
                    >
                        Calculate Impact
                    </Button>
                </CardContent>
            </Card>

            <div className="space-y-6">
                <AnimatePresence mode="wait">
                    {result ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-6"
                        >
                            <Card className="bg-surface-subtle border-primary-subtle">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-lg text-text-secondary font-medium">To maintain your {startYear} lifestyle, you need:</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-4xl font-black text-text-primary">
                                        {formatMoney(result.adjustedSalary)}
                                    </div>
                                    <p className="text-sm text-text-muted mt-2">
                                        Cumulative Inflation: <span className="font-bold text-error">{result.inflationRate.toFixed(1)}%</span>
                                    </p>
                                </CardContent>
                            </Card>

                            {result.purchasingPowerChange !== null && (
                                <Card className={`border-l-4 ${result.purchasingPowerChange >= 0 ? 'border-l-emerald-500' : 'border-l-red-500'}`}>
                                    <CardContent className="pt-6">
                                        <div className="flex items-start gap-4">
                                            {result.purchasingPowerChange >= 0 ? (
                                                <div className="p-3 bg-primary-subtle rounded-full">
                                                    <TrendingUp className="h-6 w-6 text-primary" />
                                                </div>
                                            ) : (
                                                <div className="p-3 bg-error-subtle rounded-full">
                                                    <TrendingDown className="h-6 w-6 text-error" />
                                                </div>
                                            )}
                                            <div>
                                                <h3 className="text-xl font-bold text-text-primary">
                                                    {result.purchasingPowerChange >= 0 ? "You're Beating Inflation" : "You've Taken a Pay Cut"}
                                                </h3>
                                                <p className="text-text-secondary mt-1">
                                                    Your real purchasing power has
                                                    {result.purchasingPowerChange >= 0 ? ' increased ' : ' decreased '}
                                                    by <span className={`font-bold ${result.purchasingPowerChange >= 0 ? 'text-primary' : 'text-error'}`}>
                                                        {Math.abs(result.purchasingPowerChange).toFixed(1)}%
                                                    </span>
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            <div className="bg-info-subtle p-6 rounded-xl border border-info-subtle">
                                <h4 className="font-semibold text-blue-900 flex items-center gap-2 mb-2">
                                    <AlertCircle className="h-5 w-5" />
                                    Negotiation Tip
                                </h4>
                                <p className="text-info-foreground text-sm leading-relaxed">
                                    If your salary hasn&apos;t kept up with inflation, use this data in your next review.
                                    &quot;Based on CPI data, a salary of {formatMoney(result.adjustedSalary)} is required just to match my {startYear} compensation in real terms.&quot;
                                </p>
                            </div>

                        </motion.div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center p-8 text-center text-text-muted border-2 border-dashed border-border rounded-xl bg-surface-subtle/50">
                            <TrendingUp className="h-12 w-12 mb-4 opacity-50" />
                            <h3 className="text-lg font-medium text-text-secondary">No calculation yet</h3>
                            <p className="max-w-xs mx-auto mt-2">Enter your salary details to see the impact of inflation.</p>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
