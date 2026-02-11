"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SearchableSelect } from "@/components/searchable-select";
import { calculateGrade } from "@/lib/data";
import { CheckCircle2, TrendingUp, TrendingDown, Minus, Loader2 } from "lucide-react";
import { usePostHog } from "posthog-js/react";
import Link from "next/link";
import { getBestComparisonMatch } from "@/app/compare/data/curated-comparisons";

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
  const posthog = usePostHog();
  const [step, setStep] = useState<"form" | "analyzing" | "results" | "error">("form");
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    company: "",
    role: "",
    location: "",
    level: "",
    baseSalary: "",
    equity: "",
    bonus: "",
  });
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const [companies, setCompanies] = useState<string[]>([]);
  const [roles, setRoles] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);

  useEffect(() => {
    const fetchAnalyzerData = async () => {
      try {
        const response = await fetch('/api/analyzer-data');
        const data = await response.json();
        if (data.companies) setCompanies(data.companies);
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
        company: formData.company,
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

      posthog?.capture('offer_analyzed', {
        company: formData.company,
        role: formData.role,
        location: formData.location,
        level: formData.level,
        total_comp: total,
        grade: grade,
        market_median: marketData.median
      });
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
          company: formData.company,
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
        color: "text-success",
        bgColor: "bg-success-subtle",
        icon: <TrendingUp className="w-8 h-8 text-success" />
      };
      case "B": return {
        title: "Solid Market Rate",
        text: "This is a fair offer, with some room to push for more.",
        color: "text-primary",
        bgColor: "bg-primary-subtle",
        icon: <CheckCircle2 className="w-8 h-8 text-primary" />
      };
      case "C": return {
        title: "Below Average",
        text: "Consider negotiating – you deserve more based on market data.",
        color: "text-warning",
        bgColor: "bg-warning-subtle",
        icon: <Minus className="w-8 h-8 text-warning" />
      };
      default: return {
        title: "Lowball Offer",
        text: "This offer is significantly below market rate. Strong grounds to negotiate.",
        color: "text-error",
        bgColor: "bg-error-subtle",
        icon: <TrendingDown className="w-8 h-8 text-error" />
      };
    }
  };

  const formatCurrency = (n: number) => `$${(n / 1000).toFixed(0)}k`;

  if (step === "analyzing") {
    return (
      <Card className="w-full max-w-2xl mx-auto bg-surface border-border shadow-lg">
        <CardContent className="p-12 flex flex-col items-center justify-center">
          <Loader2 className="w-16 h-16 text-primary animate-spin mb-6" />
          <p className="text-xl font-semibold text-text-secondary">Analyzing your offer...</p>
          <p className="text-sm text-text-muted mt-2">Comparing against verified market data</p>
        </CardContent>
      </Card>
    );
  }

  if (step === "results" && result) {
    const feedback = getFeedback(result.grade);
    const matchedComparison = getBestComparisonMatch(formData.company, formData.role);
    return (
      <Card className="w-full max-w-2xl mx-auto bg-surface border-border shadow-lg overflow-hidden">
        <div className={`p-6 ${feedback.bgColor} border-b border-border`}>
          <div className="flex items-center gap-4">
            {feedback.icon}
            <div>
              <h2 className={`text-2xl font-bold ${feedback.color}`}>{feedback.title}</h2>
              <p className="text-text-secondary mt-1">{feedback.text}</p>
            </div>
          </div>
        </div>

        <CardContent className="p-8 space-y-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-surface-subtle rounded-xl">
              <p className="text-sm text-text-muted mb-1">Your Total</p>
              <p className="text-2xl font-bold text-primary-hover">{formatCurrency(result.yourTotal)}</p>
            </div>
            <div className="p-4 bg-surface-subtle rounded-xl">
              <p className="text-sm text-text-muted mb-1">Market Median</p>
              <p className="text-2xl font-bold text-text-primary">{formatCurrency(result.marketMedian)}</p>
            </div>
            <div className="p-4 bg-surface-subtle rounded-xl">
              <p className="text-sm text-text-muted mb-1">Your Grade</p>
              <p className={`text-3xl font-black ${feedback.color}`}>{result.grade}</p>
            </div>
          </div>

          <div className="text-center text-sm text-text-muted">
            <p>Based on <span className="font-semibold text-text-secondary">{result.count.toLocaleString()}</span> verified salaries</p>
          </div>

          {matchedComparison && (
            <div className="rounded-xl border border-primary-subtle bg-primary-subtle p-4">
              <p className="text-sm font-semibold text-text-primary">
                Want a direct peer benchmark for this offer?
              </p>
              <p className="text-sm text-text-secondary mt-1">
                Explore {matchedComparison.title} for negotiation angles, FAQs, and side-by-side context.
              </p>
              <Link
                href={`/compare/${matchedComparison.slug}`}
                className="inline-flex mt-3 text-sm font-semibold text-primary-hover hover:text-primary"
              >
                Open comparison page →
              </Link>
            </div>
          )}

          <Button
            onClick={() => setStep("form")}
            className="w-full bg-primary hover:bg-primary-hover"
          >
            Analyze Another
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto bg-surface border-border shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl text-text-primary">
          {mode === "offer" ? "Compare Your Offer" : "Check Your Market Value"}
        </CardTitle>
        <CardDescription className="text-text-muted">
          {mode === "offer"
            ? "Enter your compensation details to see how you stack up"
            : "Enter your details to discover your market worth"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SearchableSelect
              label="Company"
              value={formData.company}
              onChange={(value) => setFormData({ ...formData, company: value })}
              options={companies}
              placeholder="Search companies..."
            />
            <SearchableSelect
              label="Job Title"
              value={formData.role}
              onChange={(value) => setFormData({ ...formData, role: value })}
              options={roles}
              placeholder="Search job titles..."
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SearchableSelect
              label="Location"
              value={formData.location}
              onChange={(value) => setFormData({ ...formData, location: value })}
              options={locations}
              placeholder="Search locations..."
              required
            />
            <SearchableSelect
              label="Experience Level"
              value={formData.level}
              onChange={(value) => setFormData({ ...formData, level: value })}
              options={LEVELS.map(l => l.label)}
              placeholder="Select experience level..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-secondary">
                Base Salary <span className="text-error">*</span>
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
              <label className="block text-sm font-medium text-text-secondary">Equity (4-year)</label>
              <Input
                type="number"
                placeholder="e.g., 200000"
                value={formData.equity}
                onChange={(e) => setFormData({ ...formData, equity: e.target.value })}
                min="0"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-secondary">Annual Bonus</label>
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
            disabled={isLoading || !formData.role || !formData.location || !formData.baseSalary || !formData.company}
            className="w-full py-6 text-lg font-semibold bg-primary hover:bg-primary-hover disabled:bg-surface-muted"
          >
            {isLoading ? "Analyzing..." : mode === "offer" ? "Analyze My Offer" : "Check My Value"}
          </Button>

          <p className="text-xs text-text-muted text-center">
            Your data helps improve our benchmarks. Analysis is instant and private.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
