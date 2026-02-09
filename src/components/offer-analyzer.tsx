"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { calculateGrade } from "@/lib/data";
import { SalaryChart } from "@/components/salary-chart";
import { ArrowRight, Lock, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";

const ROLES = [
  "Software Engineer",
  "Product Manager",
  "Data Scientist",
  "UX Designer",
  "Engineering Manager",
  "DevOps Engineer",
  "Solutions Architect",
  "Technical Program Manager",
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
];

const LOCATIONS = [
  "San Francisco, CA",
  "New York, NY",
  "Seattle, WA",
  "Austin, TX",
  "Remote",
  "Boston, MA",
  "Denver, CO",
  "Chicago, IL",
  "Los Angeles, CA",
  "London, UK",
];

const LEVELS = [
  { value: "L1-L2", label: "Junior (L1-L2)" },
  { value: "L3-L4", label: "Mid (L3-L4)" },
  { value: "L5-L6", label: "Senior (L5-L6)" },
  { value: "L7+", label: "Staff+ (L7+)" },
];

interface MarketData {
  count: number;
  median: number;
  p25: number;
  p75: number;
  p90: number;
  blsMedian: number;
}

interface AnalysisResult {
  grade: string;
  percentile: number;
  marketMedian: number;
  blsMedian: number;
  yourTotal: number;
  count: number;
}

export function OfferAnalyzer() {
  const [step, setStep] = useState<"form" | "analyzing" | "results" | "error">("form");
  const [isLoading, setIsLoading] = useState(false);
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
    setIsLoading(true);
    setStep("analyzing");

    const total = 
      parseInt(formData.baseSalary || "0") + 
      parseInt(formData.equity || "0") / 4 + 
      parseInt(formData.bonus || "0");

    try {
      const params = new URLSearchParams({
        role: formData.role,
        location: formData.location,
        level: formData.level,
      });

      const response = await fetch(`/api/salaries?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch market data');
      }

      const marketData: MarketData = await response.json();

      if (marketData.count === 0) {
        const mockData = getFallbackData(formData.role, formData.location, formData.level);
        const grade = calculateGrade(total, mockData.median);
        const percentile = Math.min(Math.round((total / mockData.median) * 50), 99);

        setResult({
          grade,
          percentile,
          marketMedian: mockData.median,
          blsMedian: mockData.blsMedian || Math.round(marketData.median * 0.95),
          yourTotal: total,
          count: 0,
        });
      } else {
        const grade = calculateGrade(total, marketData.median);
        const percentile = Math.min(Math.round((total / marketData.median) * 50), 99);

        setResult({
          grade,
          percentile,
          marketMedian: marketData.median,
          blsMedian: marketData.blsMedian || marketData.median * 0.95,
          yourTotal: total,
          count: marketData.count,
        });
      }

      setStep("results");
    } catch (err) {
      console.error('Analysis error:', err);
      setStep("error");
    } finally {
      setIsLoading(false);
    }
  };

  const getFallbackData = (role: string, location: string, level: string) => {
    const baseSalaries: Record<string, number> = {
      "Software Engineer": 160000,
      "Product Manager": 155000,
      "Data Scientist": 165000,
      "UX Designer": 140000,
      "Engineering Manager": 190000,
    };
    
    const locationMultipliers: Record<string, number> = {
      "San Francisco, CA": 1.35,
      "New York, NY": 1.25,
      "Seattle, WA": 1.28,
      "Austin, TX": 0.97,
      "Remote": 0.93,
    };
    
    const levelMultipliers: Record<string, number> = {
      "L1-L2": 0.75,
      "L3-L4": 1.0,
      "L5-L6": 1.45,
      "L7+": 2.1,
    };

    const base = baseSalaries[role] || 150000;
    const locMult = locationMultipliers[location] || 1.0;
    const lvlMult = levelMultipliers[level] || 1.0;
    const median = Math.round(base * locMult * lvlMult);

    return {
      median,
      blsMedian: Math.round(median * 0.95),
    };
  };

  const getFeedback = (grade: string) => {
    switch (grade) {
      case "A":
        return {
          title: "Excellent Offer",
          text: "You are well above market rate. Focus negotiation on equity or sign-on bonus.",
          color: "text-green-600",
          icon: <CheckCircle2 className="w-6 h-6 text-green-600" />
        };
      case "B":
        return {
          title: "Solid Market Rate",
          text: "This is a fair offer, but there's room to push. You are right at the median.",
          color: "text-emerald-600",
          icon: <CheckCircle2 className="w-6 h-6 text-emerald-600" />
        };
      case "C":
      case "D":
      case "F":
        return {
          title: "Lowball Offer",
          text: "You are significantly underpaid relative to the market. You have strong leverage to negotiate.",
          color: "text-red-600",
          icon: <AlertCircle className="w-6 h-6 text-red-600" />
        };
      default:
        return { title: "Analysis Complete", text: "", color: "text-slate-900", icon: null };
    }
  };

  if (step === "analyzing") {
    return (
      <Card className="w-full max-w-2xl mx-auto bg-white border-slate-200">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <p className="text-slate-500">Analyzing against BLS, H-1B, and market data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (step === "error") {
    return (
      <Card className="w-full max-w-2xl mx-auto bg-white border-slate-200">
        <CardContent className="pt-6">
          <div className="text-center py-8 space-y-4">
            <p className="text-red-500">Failed to analyze. Please try again.</p>
            <Button onClick={() => setStep("form")} variant="outline">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (step === "results" && result) {
    const feedback = getFeedback(result.grade);

    return (
      <div className="space-y-8">
        <Card className="w-full max-w-3xl mx-auto bg-white border-slate-200 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-slate-900">Your Compensation Analysis</CardTitle>
                <CardDescription className="text-slate-500">
                  {result.count > 0 
                    ? `Based on ${result.count} verified data points`
                    : "Based on market benchmarks (database coming soon)"
                  }
                </CardDescription>
              </div>
              <div className={`text-6xl font-bold ${feedback.color}`}>{result.grade}</div>
            </div>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Feedback Section */}
            <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg border border-slate-100">
              {feedback.icon}
              <div>
                <h4 className={`font-semibold ${feedback.color}`}>{feedback.title}</h4>
                <p className="text-slate-600">{feedback.text}</p>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-white rounded-lg border border-slate-200 shadow-sm">
                <div className="text-2xl font-bold text-indigo-600">${(result.yourTotal / 1000).toFixed(0)}k</div>
                <div className="text-sm text-slate-500">Your Total</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg border border-slate-200 shadow-sm">
                <div className="text-2xl font-bold text-slate-800">${(result.marketMedian / 1000).toFixed(0)}k</div>
                <div className="text-sm text-slate-500">Market Median</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg border border-slate-200 shadow-sm">
                <div className="text-2xl font-bold text-slate-800">{result.percentile}th</div>
                <div className="text-sm text-slate-500">Percentile</div>
              </div>
            </div>

            <SalaryChart 
              yourSalary={result.yourTotal} 
              marketMedian={result.marketMedian}
              blsMedian={result.blsMedian}
            />
          </CardContent>
        </Card>

        {/* Negotiation Upsell Card */}
        <Card className="w-full max-w-3xl mx-auto bg-indigo-50 border-indigo-100 shadow-sm overflow-hidden">
          <CardHeader>
            <CardTitle className="text-indigo-900 flex items-center gap-2">
              <Lock className="w-5 h-5 text-indigo-500" />
              Unlock Your Negotiation Script
            </CardTitle>
            <CardDescription className="text-indigo-700/80">
              Copy/paste email templates tailored to your offer grade ({result.grade}).
            </CardDescription>
          </CardHeader>
          <CardContent className="relative">
            {/* Blurred Preview */}
            <div className="space-y-2 filter blur-sm select-none opacity-50">
              <p className="text-slate-800 font-medium">Subject: Thoughts on the offer</p>
              <p className="text-slate-600">Hi [Recruiter Name],</p>
              <p className="text-slate-600">
                Thank you so much for the offer. I'm really excited about the team. 
                However, looking at market data for [Role] in [Location], 
                I noticed the base salary is...
              </p>
            </div>
            
            {/* CTA Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <Link href="/pricing">
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg">
                  Unlock Full Script ($19)
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center">
          <Button onClick={() => setStep("form")} variant="ghost" className="text-slate-500">
            Analyze Another Offer
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto bg-white border-slate-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-slate-900">Compare Your Offer</CardTitle>
        <CardDescription className="text-slate-500">Enter your compensation details to see how you stack up</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Role *</label>
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
              <label className="text-sm font-medium text-slate-700">Location *</label>
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
            <label className="text-sm font-medium text-slate-700">Experience Level</label>
            <Select
              value={formData.level}
              onChange={(e) => setFormData({ ...formData, level: e.target.value })}
            >
              <option value="">Select level...</option>
              {LEVELS.map((level) => (
                <option key={level.value} value={level.value}>{level.label}</option>
              ))}
            </Select>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Base Salary *</label>
              <Input
                type="number"
                placeholder="150000"
                value={formData.baseSalary}
                onChange={(e) => setFormData({ ...formData, baseSalary: e.target.value })}
                required
                className="bg-white border-slate-200"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Annual Equity</label>
              <Input
                type="number"
                placeholder="50000"
                value={formData.equity}
                onChange={(e) => setFormData({ ...formData, equity: e.target.value })}
                className="bg-white border-slate-200"
              />
              <p className="text-xs text-slate-500 mt-1">*Assumes 4-year vesting</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Annual Bonus</label>
              <Input
                type="number"
                placeholder="20000"
                value={formData.bonus}
                onChange={(e) => setFormData({ ...formData, bonus: e.target.value })}
                className="bg-white border-slate-200"
              />
            </div>
          </div>

          <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Analyzing...
                  </>
                ) : (
                  <>
                    Analyze My Offer <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
        </form>
      </CardContent>
    </Card>
  );
}
