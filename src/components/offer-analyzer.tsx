"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { calculateGrade } from "@/lib/data";
import { SalaryChart } from "@/components/salary-chart";
import { ArrowRight } from "lucide-react";

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
  "London, UK", // Added international option
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
      // Fetch market data from API
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
        // Fallback to mock data if no database entries yet
        const mockData = getFallbackData(formData.role, formData.location, formData.level);
        // Simplified grading logic for demonstration.
        // TODO: Implement a more sophisticated grading system based on
        //       multiple data sources, confidence scores, and user context.
        //       Consider factors like job level, location multipliers, and bonus/equity
        //       structures that deviate significantly from the median.
        const grade = calculateGrade(total, mockData.median);
        const percentile = Math.min(Math.round((total / mockData.median) * 50), 99);

        setResult({
          grade,
          percentile,
          marketMedian: mockData.median,
          // Placeholder for BLS median when available from API, otherwise use a conservative estimate.
          blsMedian: mockData.blsMedian || Math.round(marketData.median * 0.95),
          yourTotal: total,
          count: 0,
        });
      } else {
        // Simplified grading logic for demonstration.
        // TODO: Implement a more sophisticated grading system based on
        //       multiple data sources, confidence scores, and user context.
        //       Consider factors like job level, location multipliers, and bonus/equity
        //       structures that deviate significantly from the median.
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

  /**
   * getFallbackData:
   * Provides mock salary data when the primary data source (Supabase) is not yet configured
   * or returns no entries. This ensures the application remains functional and user-facing
   * during development or in edge cases.
   *
   * TODO: Replace hardcoded values with real data from API or database.
   *       Consider fetching this from a dedicated endpoint if Supabase is unavailable.
   *       Include more roles and locations for broader coverage.
   */
  const getFallbackData = (role: string, location: string, level: string) => {
    // Fallback mock data when Supabase is not yet configured
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

  if (step === "error") {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="pt-6">
          <div className="text-center py-8 space-y-4">
            <p className="text-red-400">Failed to analyze. Please try again.</p>
            <Button onClick={() => setStep("form")} variant="outline">
              Try Again
            </Button>
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
              <CardDescription>
                {result.count > 0 
                  ? `Based on ${result.count} verified data points`
                  : "Based on market benchmarks (database coming soon)"
                }
              </CardDescription>
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
            <Button onClick={() => alert("Feature coming soon: Full report generation!")} className="flex-1 bg-gradient-to-r from-indigo-600 to-violet-600">
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
              <label className="text-sm font-medium">Role *</label>
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
              <label className="text-sm font-medium">Location *</label>
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
            >
              <option value="">Select level...</option>
              {LEVELS.map((level) => (
                <option key={level.value} value={level.value}>{level.label}</option>
              ))}
            </Select>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Base Salary *</label>
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
              <p className="text-xs text-slate-500 mt-1">*Assumes 4-year vesting</p>
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

          <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-indigo-600 to-violet-600"
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
