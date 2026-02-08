"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { calculateGrade, getMarketData } from "@/lib/data";
import { SalaryChart } from "@/components/salary-chart";
import { ArrowRight, TrendingUp, Shield, Database } from "lucide-react";

const ROLES = [
  "Software Engineer",
  "Product Manager",
  "Data Scientist",
  "UX Designer",
  "Engineering Manager",
  "Staff Engineer",
  "Principal Engineer",
  "Senior Software Engineer",
];

const LOCATIONS = [
  "San Francisco, CA",
  "New York, NY",
  "Seattle, WA",
  "Austin, TX",
  "Boston, MA",
  "Denver, CO",
  "Remote",
];

const LEVELS = [
  "Junior (L1-L2)",
  "Mid (L3-L4)",
  "Senior (L5-L6)",
  "Staff+ (L7+)",
];

interface AnalysisResult {
  grade: string;
  percentile: number;
  marketMedian: number;
  blsMedian: number;
  yourTotal: number;
}

export function OfferAnalyzer() {
  const [step, setStep] = useState<"form" | "analyzing" | "results">("form");
  const [formData, setFormData] = useState({
    role: "",
    location: "",
    level: "",
    baseSalary: "",
    equity: "",
    bonus: "",
  });
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep("analyzing");

    // Simulate analysis delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const total = 
      parseInt(formData.baseSalary || "0") + 
      parseInt(formData.equity || "0") / 4 + 
      parseInt(formData.bonus || "0");

    const marketData = getMarketData(formData.role, formData.location, formData.level);
    const grade = calculateGrade(total, marketData.median);
    const percentile = Math.round((total / marketData.median) * 50);

    setResult({
      grade,
      percentile: Math.min(percentile, 99),
      marketMedian: marketData.median,
      blsMedian: marketData.blsMedian,
      yourTotal: total,
    });
    setStep("results");
  };

  if (step === "analyzing") {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
            <p className="text-slate-400">Analyzing against BLS, H-1B, and market data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (step === "results" && result) {
    const gradeColor = {
      A: "text-green-400",
      B: "text-emerald-400",
      C: "text-yellow-400",
      D: "text-orange-400",
      F: "text-red-400",
    }[result.grade];

    return (
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Your Compensation Analysis</CardTitle>
              <CardDescription>Based on verified market data</CardDescription>
            </div>
            <div className={`text-6xl font-bold ${gradeColor}`}>{result.grade}</div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-slate-800/50 rounded-lg">
              <div className="text-2xl font-bold text-indigo-400">${(result.yourTotal / 1000).toFixed(0)}k</div>
              <div className="text-sm text-slate-400">Your Total Comp</div>
            </div>
            <div className="text-center p-4 bg-slate-800/50 rounded-lg">
              <div className="text-2xl font-bold text-slate-200">${(result.marketMedian / 1000).toFixed(0)}k</div>
              <div className="text-sm text-slate-400">Market Median</div>
            </div>
            <div className="text-center p-4 bg-slate-800/50 rounded-lg">
              <div className="text-2xl font-bold text-slate-200">{result.percentile}th</div>
              <div className="text-sm text-slate-400">Percentile</div>
            </div>
          </div>

          <SalaryChart 
            yourSalary={result.yourTotal} 
            marketMedian={result.marketMedian}
            blsMedian={result.blsMedian}
          />

          <div className="flex gap-4">
            <Button onClick={() => setStep("form")} variant="outline" className="flex-1">
              Analyze Another Offer
            </Button>
            <Button className="flex-1 bg-gradient-to-r from-indigo-600 to-violet-600">
              Get Full Report <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Compare Your Offer</CardTitle>
        <CardDescription>Enter your compensation details to see how you stack up</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Role</label>
              <Select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                required
              >
                <option value="">Select role...</option>
                {ROLES.map((role) => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Location</label>
              <Select
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required
              >
                <option value="">Select location...</option>
                {LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Experience Level</label>
            <Select
              value={formData.level}
              onChange={(e) => setFormData({ ...formData, level: e.target.value })}
              required
            >
              <option value="">Select level...</option>
              {LEVELS.map((level) => (
                <option key={level} value={level}>{level}</option>
              ))}
            </Select>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Base Salary</label>
              <Input
                type="number"
                placeholder="150000"
                value={formData.baseSalary}
                onChange={(e) => setFormData({ ...formData, baseSalary: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Annual Equity</label>
              <Input
                type="number"
                placeholder="50000"
                value={formData.equity}
                onChange={(e) => setFormData({ ...formData, equity: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Annual Bonus</label>
              <Input
                type="number"
                placeholder="20000"
                value={formData.bonus}
                onChange={(e) => setFormData({ ...formData, bonus: e.target.value })}
              />
            </div>
          </div>

          <Button type="submit" className="w-full bg-gradient-to-r from-indigo-600 to-violet-600">
            Analyze My Offer <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
