"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SearchableSelect } from "@/components/searchable-select";
import { calculateGrade } from "@/lib/data";
import { CheckCircle2, AlertCircle, TrendingUp, TrendingDown, Minus, Loader2 } from "lucide-react";

const LEVELS = [
  { value: "Junior (L1-L2)", label: "Junior (L1-L2)" },
  { value: "Mid (L3-L4)", label: "Mid (L3-L4)" },
  { value: "Senior (L5-L6)", label: "Senior (L5-L6)" },
  { value: "Staff+ (L7+)", label: "Staff+ (L7+)" },
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

interface OfferAnalyzerProps {
  mode?: "offer" | "salary";
}

export function OfferAnalyzer({ mode = "offer" }: OfferAnalyzerProps) {
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
  
  const [roles, setRoles] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);

  useEffect(() => {
    const fetchAnalyzerData = async () => {
      try {
        const response = await fetch('/api/analyzer-data');
        const data = await response.json();
        if (data.roles) setRoles(data.roles);
        if (data.locations) setLocations(data.locations);
      } catch (error) {
        console.error("Failed to fetch analyzer data:", error);
      }
    };
    fetchAnalyzerData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStep("analyzing");

    const base = parseInt(formData.baseSalary || "0");
    const equity = parseInt(formData.equity || "0");
    const bonus = parseInt(formData.bonus || "0");
    const total = base + (equity / 4) + bonus;

    try {
      // Fetch market data
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
      
      const grade = calculateGrade(total, marketData.median); 
      const percentile = Math.min(Math.round((total / marketData.median) * 50), 99);

      const analysisResult = {
        grade,
        percentile,
        marketMedian: marketData.median,
        blsMedian: marketData.blsMedian || marketData.median * 0.95,
        yourTotal: total,
        count: marketData.count,
      };

      setResult(analysisResult);

      // Capture analysis to database
      await fetch('/api/capture-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: formData.role,
          location: formData.location,
          level: formData.level,
          baseSalary: base,
          equity: equity,
          bonus: bonus,
          totalComp: total,
          marketMedian: marketData.median,
          grade: grade,
          percentile: percentile,
          mode: mode,
          userAgent: navigator.userAgent,
        }),
      });

      setStep("results");
    } catch (err) {
      console.error('Analysis error:', err);
      const fallbackMedian = 150000;
      const grade = calculateGrade(total, fallbackMedian);
      const percentile = Math.min(Math.round((total / fallbackMedian) * 50), 99);
      setResult({ 
        grade, 
        percentile, 
        marketMedian: fallbackMedian, 
        blsMedian: fallbackMedian * 0.9, 
        yourTotal: total, 
        count: 0 
      });
      setStep("results");
    } finally {
      setIsLoading(false);
    }
  };

  const getFeedback = (grade: string) => {
    switch (grade) {
      case "A": return { 
        title: "Excellent Offer!", 
        text: "You are well above market rate. Strong position to negotiate from.", 
        color: "text-green-600", 
        bgColor: "bg-green-50",
        icon: <TrendingUp className="w-8 h-8 text-green-600" /> 
      };
      case "B": return { 
        title: "Solid Market Rate", 
        text: "This is a fair offer, with some room to push for more.", 
        color: "text-emerald-600", 
        bgColor: "bg-emerald-50",
        icon: <CheckCircle2 className="w-8 h-8 text-emerald-600" /> 
      };
      case "C": return { 
        title: "Below Average", 
        text: "Consider negotiating – you deserve more based on market data.", 
        color: "text-yellow-600", 
        bgColor: "bg-yellow-50",
        icon: <Minus className="w-8 h-8 text-yellow-600" /> 
      };
      default: return { 
        title: "Lowball Offer", 
        text: "This offer is significantly below market rate. Strong grounds to negotiate.", 
        color: "text-red-600", 
        bgColor: "bg-red-50",
        icon: <TrendingDown className="w-8 h-8 text-red-600" /> 
      };
    }
  };

  const formatCurrency = (n: number) => `$${(n / 1000).toFixed(0)}k`;

  if (step === "analyzing") {
    return (
      <Card className="w-full max-w-2xl mx-auto bg-white border-slate-200 shadow-lg">
        <CardContent className="p-12 flex flex-col items-center justify-center">
          <Loader2 className="w-16 h-16 text-emerald-500 animate-spin mb-6" />
          <p className="text-xl font-semibold text-slate-700">Analyzing your offer...</p>
          <p className="text-sm text-slate-500 mt-2">Comparing against verified market data</p>
        </CardContent>
      </Card>
    );
  }

  if (step === "results" && result) {
    const feedback = getFeedback(result.grade);
    return (
      <Card className="w-full max-w-2xl mx-auto bg-white border-slate-200 shadow-lg overflow-hidden">
        <div className={`p-6 ${feedback.bgColor} border-b border-slate-200`}>
          <div className="flex items-center gap-4">
            {feedback.icon}
            <div>
              <h2 className={`text-2xl font-bold ${feedback.color}`}>{feedback.title}</h2>
              <p className="text-slate-600 mt-1">{feedback.text}</p>
            </div>
          </div>
        </div>

        <CardContent className="p-8 space-y-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-slate-50 rounded-xl">
              <p className="text-sm text-slate-500 mb-1">Your Total</p>
              <p className="text-2xl font-bold text-emerald-700">{formatCurrency(result.yourTotal)}</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl">
              <p className="text-sm text-slate-500 mb-1">Market Median</p>
              <p className="text-2xl font-bold text-slate-800">{formatCurrency(result.marketMedian)}</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl">
              <p className="text-sm text-slate-500 mb-1">Your Grade</p>
              <p className={`text-3xl font-black ${feedback.color}`}>{result.grade}</p>
            </div>
          </div>

          <div className="text-center text-sm text-slate-500">
            <p>Based on <span className="font-semibold text-slate-700">{result.count.toLocaleString()}</span> verified salaries</p>
          </div>

          <Button 
            onClick={() => setStep("form")} 
            className="w-full bg-emerald-600 hover:bg-emerald-700"
          >
            Analyze Another
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto bg-white border-slate-200 shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl text-slate-900">
          {mode === "offer" ? "Compare Your Offer" : "Check Your Market Value"}
        </CardTitle>
        <CardDescription className="text-slate-500">
          {mode === "offer" 
            ? "Enter your compensation details to see how you stack up" 
            : "Enter your details to discover your market worth"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SearchableSelect
              label="Job Title"
              value={formData.role}
              onChange={(value) => setFormData({ ...formData, role: value })}
              options={roles}
              placeholder="Search job titles..."
              required
            />
            <SearchableSelect
              label="Location"
              value={formData.location}
              onChange={(value) => setFormData({ ...formData, location: value })}
              options={locations}
              placeholder="Search locations..."
              required
            />
          </div>

          <SearchableSelect
            label="Experience Level"
            value={formData.level}
            onChange={(value) => setFormData({ ...formData, level: value })}
            options={LEVELS.map(l => l.label)}
            placeholder="Select experience level..."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">
                Base Salary <span className="text-red-500">*</span>
              </label>
              <Input
                type="number"
                placeholder="e.g., 150000"
                value={formData.baseSalary}
                onChange={(e) => setFormData({ ...formData, baseSalary: e.target.value })}
                required
                min="0"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Equity (4-year)</label>
              <Input
                type="number"
                placeholder="e.g., 200000"
                value={formData.equity}
                onChange={(e) => setFormData({ ...formData, equity: e.target.value })}
                min="0"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Annual Bonus</label>
              <Input
                type="number"
                placeholder="e.g., 20000"
                value={formData.bonus}
                onChange={(e) => setFormData({ ...formData, bonus: e.target.value })}
                min="0"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading || !formData.role || !formData.location || !formData.baseSalary}
            className="w-full py-6 text-lg font-semibold bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300"
          >
            {isLoading ? "Analyzing..." : mode === "offer" ? "Analyze My Offer" : "Check My Value"}
          </Button>

          <p className="text-xs text-slate-400 text-center">
            Your data helps improve our benchmarks. Analysis is instant and private.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
