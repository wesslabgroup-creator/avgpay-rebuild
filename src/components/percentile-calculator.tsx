"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TrendingUp, TrendingDown, Minus, Award, LucideIcon } from "lucide-react";

interface EvaluationResult {
  percentile: number;
  rating: string;
  color: string;
  icon: LucideIcon;
  belowYou: number;
  aboveYou: number;
  median: number;
  message: string;
}

interface RoleStats {
  min: number;
  max: number;
  median: number;
}

export function PercentileCalculator() {
  const [salary, setSalary] = useState("");
  const [role, setRole] = useState("");
  const [location, setLocation] = useState("");
  const [result, setResult] = useState<EvaluationResult | null>(null);

  const calculatePercentile = async () => {
    if (!salary || !role || !location) return;

    // Simulated calculation - in production, this would call an API
    const salaryNum = parseInt(salary.replace(/,/g, ""));

    // Mock data ranges for different roles
    const roleData: Record<string, RoleStats> = {
      "Software Engineer": { min: 80000, max: 400000, median: 150000 },
      "Product Manager": { min: 100000, max: 350000, median: 140000 },
      "Data Scientist": { min: 90000, max: 380000, median: 135000 },
      "Designer": { min: 70000, max: 200000, median: 95000 },
      "Marketing Manager": { min: 75000, max: 180000, median: 100000 },
    };

    const data = roleData[role] || { min: 60000, max: 200000, median: 90000 };

    // Calculate percentile (simplified)
    const range = data.max - data.min;
    const position = (salaryNum - data.min) / range;
    const percentile = Math.max(0, Math.min(100, position * 100));

    let rating, color, icon, message;

    if (percentile >= 90) {
      rating = "Exceptional";
      color = "text-emerald-600";
      icon = Award;
      message = "You're in the top 10%! Your compensation is well above market rate.";
    } else if (percentile >= 75) {
      rating = "Above Market";
      color = "text-emerald-500";
      icon = TrendingUp;
      message = "You're earning above the market average. Nice work!";
    } else if (percentile >= 50) {
      rating = "Market Rate";
      color = "text-slate-700";
      icon = Minus;
      message = "You're earning around the median for your role and location.";
    } else if (percentile >= 25) {
      rating = "Below Market";
      color = "text-orange-600";
      icon = TrendingDown;
      message = "You're earning below the market median. Consider negotiating.";
    } else {
      rating = "Significantly Below";
      color = "text-red-600";
      icon = TrendingDown;
      message = "You're likely underpaid. Time to have a conversation with your manager.";
    }

    setResult({
      percentile: Math.round(percentile),
      rating,
      color,
      icon,
      belowYou: Math.round(percentile),
      aboveYou: Math.round(100 - percentile),
      median: data.median,
      message,
    });
  };

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(num);
  };

  return (
    <Card className="bg-white border-slate-200">
      <CardHeader>
        <CardTitle className="text-2xl text-slate-900">Calculate Your Percentile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Input Form */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="salary" className="text-slate-700">Your Total Compensation</Label>
            <Input
              id="salary"
              type="text"
              placeholder="$150,000"
              value={salary}
              onChange={(e) => {
                const val = e.target.value.replace(/[^0-9]/g, "");
                setSalary(val ? parseInt(val).toLocaleString() : "");
              }}
              className="mt-1.5"
            />
          </div>

          <div>
            <Label htmlFor="role" className="text-slate-700">Your Role</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger className="mt-1.5">
                <SelectValue placeholder="Select your role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Software Engineer">Software Engineer</SelectItem>
                <SelectItem value="Product Manager">Product Manager</SelectItem>
                <SelectItem value="Data Scientist">Data Scientist</SelectItem>
                <SelectItem value="Designer">Designer</SelectItem>
                <SelectItem value="Marketing Manager">Marketing Manager</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="location" className="text-slate-700">Location</Label>
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger className="mt-1.5">
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="San Francisco, CA">San Francisco, CA</SelectItem>
                <SelectItem value="New York, NY">New York, NY</SelectItem>
                <SelectItem value="Seattle, WA">Seattle, WA</SelectItem>
                <SelectItem value="Austin, TX">Austin, TX</SelectItem>
                <SelectItem value="Boston, MA">Boston, MA</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={calculatePercentile}
            disabled={!salary || !role || !location}
            className="w-full bg-emerald-600 hover:bg-emerald-700"
          >
            Calculate My Percentile
          </Button>
        </div>

        {/* Results */}
        {result && (
          <div className="mt-8 pt-8 border-t border-slate-200 space-y-6">
            <div className="text-center">
              <div className="mb-4">
                <result.icon className={`w-16 h-16 mx-auto ${result.color}`} />
              </div>
              <div className="text-6xl font-black text-slate-900 mb-2">
                {result.percentile}<span className="text-3xl">th</span>
              </div>
              <div className={`text-xl font-semibold ${result.color} mb-3`}>
                {result.rating}
              </div>
              <p className="text-slate-600 max-w-md mx-auto">
                {result.message}
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4 pt-6">
              <div className="text-center p-4 bg-slate-50 rounded-lg">
                <div className="text-2xl font-bold text-slate-900">{result.belowYou}%</div>
                <div className="text-xs text-slate-600 mt-1">Earn Less</div>
              </div>
              <div className="text-center p-4 bg-emerald-50 rounded-lg">
                <div className="text-2xl font-bold text-emerald-700">
                  {formatCurrency(result.median)}
                </div>
                <div className="text-xs text-slate-600 mt-1">Median Salary</div>
              </div>
              <div className="text-center p-4 bg-slate-50 rounded-lg">
                <div className="text-2xl font-bold text-slate-900">{result.aboveYou}%</div>
                <div className="text-xs text-slate-600 mt-1">Earn More</div>
              </div>
            </div>

            {/* Percentile Bar */}
            <div className="space-y-2">
              <div className="text-sm font-medium text-slate-700">Your Position</div>
              <div className="relative h-8 bg-gradient-to-r from-red-500 via-yellow-500 via-emerald-400 to-emerald-600 rounded-full overflow-hidden">
                <div
                  className="absolute top-0 h-full w-1 bg-slate-900"
                  style={{ left: `${result.percentile}%` }}
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-8 border-transparent border-t-slate-900" />
                </div>
              </div>
              <div className="flex justify-between text-xs text-slate-500">
                <span>0th</span>
                <span>50th</span>
                <span>100th</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
