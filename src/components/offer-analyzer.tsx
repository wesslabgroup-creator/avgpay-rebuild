"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { calculateGrade } from "@/lib/data"; // This should be moved to a client-side lib
import { SalaryChart } from "@/components/salary-chart";
import { ArrowRight, Lock, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";

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
  
  // State for dynamic dropdowns
  const [roles, setRoles] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);

  // Fetch dynamic data for dropdowns
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
      
      // Using a simple client-side calculateGrade function for now
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

      setStep("results");
    } catch (err) {
      console.error('Analysis error:', err);
      // Fallback for demo purposes if API fails
      const fallbackMedian = 150000;
      const grade = calculateGrade(total, fallbackMedian);
      const percentile = Math.min(Math.round((total / fallbackMedian) * 50), 99);
      setResult({ grade, percentile, marketMedian: fallbackMedian, blsMedian: fallbackMedian * 0.9, yourTotal: total, count: 0 });
      setStep("results");
    } finally {
      setIsLoading(false);
    }
  };

  const getFeedback = (grade: string) => {
    switch (grade) {
      case "A": return { title: "Excellent Offer", text: "You are well above market rate.", color: "text-green-600", icon: <CheckCircle2 className="w-6 h-6 text-green-600" /> };
      case "B": return { title: "Solid Market Rate", text: "This is a fair offer, with some room to push.", color: "text-emerald-600", icon: <CheckCircle2 className="w-6 h-6 text-emerald-600" /> };
      default: return { title: "Lowball Offer", text: "You are underpaid relative to the market.", color: "text-red-600", icon: <AlertCircle className="w-6 h-6 text-red-600" /> };
    }
  };

  if (step === "analyzing") { /* ... existing analyzing UI ... */ }
  if (step === "error") { /* ... existing error UI ... */ }
  if (step === "results" && result) { /* ... existing results UI ... */ }

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
                {roles.map((role) => (
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
                {locations.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </Select>
            </div>
          </div>
          {/* ... rest of the form ... */}
        </form>
      </CardContent>
    </Card>
  );
}
