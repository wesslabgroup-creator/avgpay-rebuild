"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export function CompensationBreakdown() {
  const [baseSalary, setBaseSalary] = useState("");
  const [bonus, setBonus] = useState("");
  const [equity, setEquity] = useState("");
  const [signOn, setSignOn] = useState("");
  const [benefits, setBenefits] = useState("15000"); // Default estimate

  const parseNumber = (str: string) => {
    return parseInt(str.replace(/[^0-9]/g, "") || "0");
  };

  const formatCurrency = (str: string) => {
    const num = parseNumber(str);
    return num.toLocaleString();
  };

  const totalComp = parseNumber(baseSalary) + parseNumber(bonus) + parseNumber(equity) + parseNumber(benefits);
  const firstYearComp = totalComp + parseNumber(signOn);

  const calculatePercentage = (value: string) => {
    const num = parseNumber(value);
    return totalComp > 0 ? ((num / totalComp) * 100).toFixed(1) : "0";
  };

  return (
    <Card className="bg-white border-slate-200">
      <CardHeader>
        <CardTitle className="text-2xl text-slate-900">Break Down Your Compensation</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Input Form */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="base" className="text-slate-700">Base Salary (Annual)</Label>
            <Input
              id="base"
              type="text"
              placeholder="$150,000"
              value={baseSalary}
              onChange={(e) => setBaseSalary(formatCurrency(e.target.value))}
              className="mt-1.5"
            />
          </div>

          <div>
            <Label htmlFor="bonus" className="text-slate-700">Annual Bonus (Target)</Label>
            <Input
              id="bonus"
              type="text"
              placeholder="$30,000"
              value={bonus}
              onChange={(e) => setBonus(formatCurrency(e.target.value))}
              className="mt-1.5"
            />
          </div>

          <div>
            <Label htmlFor="equity" className="text-slate-700">Equity/RSUs (Annual Value)</Label>
            <Input
              id="equity"
              type="text"
              placeholder="$50,000"
              value={equity}
              onChange={(e) => setEquity(formatCurrency(e.target.value))}
              className="mt-1.5"
            />
            <p className="text-xs text-slate-500 mt-1">
              Divide total grant by vesting years (usually 4)
            </p>
          </div>

          <div>
            <Label htmlFor="signOn" className="text-slate-700">Sign-On Bonus (One-Time)</Label>
            <Input
              id="signOn"
              type="text"
              placeholder="$25,000"
              value={signOn}
              onChange={(e) => setSignOn(formatCurrency(e.target.value))}
              className="mt-1.5"
            />
          </div>

          <div>
            <Label htmlFor="benefits" className="text-slate-700">Benefits Value (Annual)</Label>
            <Input
              id="benefits"
              type="text"
              placeholder="$15,000"
              value={benefits}
              onChange={(e) => setBenefits(formatCurrency(e.target.value))}
              className="mt-1.5"
            />
            <p className="text-xs text-slate-500 mt-1">
              Health insurance, 401k match, perks (average: $15k)
            </p>
          </div>
        </div>

        {/* Results */}
        {totalComp > 0 && (
          <div className="mt-8 pt-8 border-t border-slate-200 space-y-6">
            {/* Total Comp Summary */}
            <div className="bg-emerald-50 rounded-lg p-6 border border-emerald-200">
              <div className="text-sm font-medium text-emerald-700 mb-1">
                Total Annual Compensation
              </div>
              <div className="text-4xl font-black text-emerald-700">
                ${totalComp.toLocaleString()}
              </div>
              {parseNumber(signOn) > 0 && (
                <div className="text-sm text-slate-600 mt-3">
                  First year total: <strong>${firstYearComp.toLocaleString()}</strong>
                </div>
              )}
            </div>

            {/* Breakdown Chart */}
            <div className="space-y-4">
              <h3 className="font-semibold text-slate-900">Compensation Breakdown</h3>

              {parseNumber(baseSalary) > 0 && (
                <div>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-slate-700">Base Salary</span>
                    <span className="font-medium text-slate-900">
                      ${parseNumber(baseSalary).toLocaleString()} ({calculatePercentage(baseSalary)}%)
                    </span>
                  </div>
                  <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-600 rounded-full"
                      style={{ width: `${calculatePercentage(baseSalary)}%` }}
                    />
                  </div>
                </div>
              )}

              {parseNumber(bonus) > 0 && (
                <div>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-slate-700">Annual Bonus</span>
                    <span className="font-medium text-slate-900">
                      ${parseNumber(bonus).toLocaleString()} ({calculatePercentage(bonus)}%)
                    </span>
                  </div>
                  <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{ width: `${calculatePercentage(bonus)}%` }}
                    />
                  </div>
                </div>
              )}

              {parseNumber(equity) > 0 && (
                <div>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-slate-700">Equity (Annual)</span>
                    <span className="font-medium text-slate-900">
                      ${parseNumber(equity).toLocaleString()} ({calculatePercentage(equity)}%)
                    </span>
                  </div>
                  <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-400 rounded-full"
                      style={{ width: `${calculatePercentage(equity)}%` }}
                    />
                  </div>
                </div>
              )}

              {parseNumber(benefits) > 0 && (
                <div>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-slate-700">Benefits</span>
                    <span className="font-medium text-slate-900">
                      ${parseNumber(benefits).toLocaleString()} ({calculatePercentage(benefits)}%)
                    </span>
                  </div>
                  <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-300 rounded-full"
                      style={{ width: `${calculatePercentage(benefits)}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            <Separator />

            {/* Cash vs Equity Breakdown */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-slate-50 rounded-lg">
                <div className="text-xs text-slate-600 mb-1">Cash Compensation</div>
                <div className="text-2xl font-bold text-slate-900">
                  ${(parseNumber(baseSalary) + parseNumber(bonus)).toLocaleString()}
                </div>
              </div>
              <div className="text-center p-4 bg-emerald-50 rounded-lg">
                <div className="text-xs text-slate-600 mb-1">Equity + Benefits</div>
                <div className="text-2xl font-bold text-emerald-700">
                  ${(parseNumber(equity) + parseNumber(benefits)).toLocaleString()}
                </div>
              </div>
            </div>

            {/* Insights */}
            <div className="bg-slate-50 rounded-lg p-4 text-sm text-slate-600">
              <strong className="text-slate-900">💡 Insight:</strong>{" "}
              {parseNumber(equity) / totalComp > 0.3
                ? "Your package is equity-heavy, which means more upside potential but also more risk."
                : parseNumber(baseSalary) / totalComp > 0.7
                ? "Your package is cash-heavy, providing stability but potentially less upside."
                : "You have a balanced mix of cash and equity compensation."}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
