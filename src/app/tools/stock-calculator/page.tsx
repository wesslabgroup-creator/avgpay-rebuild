"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { TrendingUp, Calculator, DollarSign, AlertTriangle } from "lucide-react";

type EquityType = "rsu" | "options";

export default function StockCalculatorPage() {
  const [equityType, setEquityType] = useState<EquityType>("rsu");

  // RSU inputs
  const [rsuGrant, setRsuGrant] = useState<number>(0);
  const [currentStockPrice, setCurrentStockPrice] = useState<number>(0);

  // Stock Option inputs
  const [numOptions, setNumOptions] = useState<number>(0);
  const [strikePrice, setStrikePrice] = useState<number>(0);
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [futurePrice, setFuturePrice] = useState<number>(0);

  // Tax assumptions
  const [taxRate, setTaxRate] = useState<number>(40);

  // RSU Calculations
  const calculateRSUValue = () => {
    const currentValue = rsuGrant * currentStockPrice;
    const taxOwed = currentValue * (taxRate / 100);
    const netValue = currentValue - taxOwed;
    return { currentValue, taxOwed, netValue };
  };

  // Stock Option Calculations
  const calculateOptionValue = () => {
    const currentGain = Math.max(0, (currentPrice - strikePrice) * numOptions);
    const futureGain = Math.max(0, (futurePrice - strikePrice) * numOptions);
    const currentTax = currentGain * (taxRate / 100);
    const futureTax = futureGain * (taxRate / 100);
    const currentNet = currentGain - currentTax;
    const futureNet = futureGain - futureTax;
    const costToExercise = strikePrice * numOptions;

    return {
      currentGain,
      futureGain,
      currentTax,
      futureTax,
      currentNet,
      futureNet,
      costToExercise,
      isInTheMoney: currentPrice > strikePrice,
    };
  };

  const rsuResults = calculateRSUValue();
  const optionResults = calculateOptionValue();

  const formatCurrency = (n: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(n);
  };

  return (
    <main className="min-h-screen bg-surface-subtle pt-24 pb-12">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-info-subtle border border-info-subtle text-info text-sm font-medium">
            <Calculator className="w-4 h-4" />
            Equity Value Calculator
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-text-primary tracking-tight">
            Stock Options vs RSUs Calculator
          </h1>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">
            Understand the real value of your equity compensation
          </p>
        </div>

        {/* Equity Type Selector */}
        <div className="flex justify-center gap-4 mb-8">
          <Button
            onClick={() => setEquityType("rsu")}
            variant={equityType === "rsu" ? "default" : "outline"}
            size="lg"
            className={equityType === "rsu" ? "bg-primary hover:bg-primary-hover" : ""}
          >
            RSUs (Restricted Stock Units)
          </Button>
          <Button
            onClick={() => setEquityType("options")}
            variant={equityType === "options" ? "default" : "outline"}
            size="lg"
            className={equityType === "options" ? "bg-primary hover:bg-primary-hover" : ""}
          >
            Stock Options
          </Button>
        </div>

        {/* Calculator Content */}
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Inputs */}
          <div className="lg:col-span-2">
            <Card className="bg-surface border-border">
              <CardHeader>
                <CardTitle>
                  {equityType === "rsu" ? "RSU Details" : "Stock Option Details"}
                </CardTitle>
                <CardDescription>
                  Enter your equity compensation details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {equityType === "rsu" ? (
                  <>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-text-secondary">
                        Number of RSUs Granted
                      </label>
                      <Input
                        type="number"
                        placeholder="e.g., 1000"
                        value={rsuGrant || ""}
                        onChange={(e) => setRsuGrant(parseInt(e.target.value) || 0)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-text-secondary">
                        Current Stock Price ($)
                      </label>
                      <Input
                        type="number"
                        placeholder="e.g., 150"
                        value={currentStockPrice || ""}
                        onChange={(e) => setCurrentStockPrice(parseFloat(e.target.value) || 0)}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-text-secondary">
                        Number of Options
                      </label>
                      <Input
                        type="number"
                        placeholder="e.g., 10000"
                        value={numOptions || ""}
                        onChange={(e) => setNumOptions(parseInt(e.target.value) || 0)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-text-secondary">
                        Strike Price ($)
                      </label>
                      <Input
                        type="number"
                        placeholder="e.g., 10"
                        value={strikePrice || ""}
                        onChange={(e) => setStrikePrice(parseFloat(e.target.value) || 0)}
                      />
                      <p className="text-xs text-text-muted">The price you pay to exercise</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-text-secondary">
                        Current Stock Price ($)
                      </label>
                      <Input
                        type="number"
                        placeholder="e.g., 25"
                        value={currentPrice || ""}
                        onChange={(e) => setCurrentPrice(parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-text-secondary">
                        Expected Future Price ($)
                      </label>
                      <Input
                        type="number"
                        placeholder="e.g., 50"
                        value={futurePrice || ""}
                        onChange={(e) => setFuturePrice(parseFloat(e.target.value) || 0)}
                      />
                      <p className="text-xs text-text-muted">Your price target (exit or IPO)</p>
                    </div>
                  </>
                )}

                <div className="pt-4 border-t border-border">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text-secondary">
                      Estimated Tax Rate (%)
                    </label>
                    <Input
                      type="number"
                      placeholder="e.g., 40"
                      value={taxRate || ""}
                      onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                      min="0"
                      max="100"
                    />
                    <p className="text-xs text-text-muted">
                      Typical: 30-50% (federal + state + AMT)
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          <div className="lg:col-span-3 space-y-6">
            {equityType === "rsu" ? (
              <>
                <Card className="bg-primary-subtle border-primary-subtle">
                  <CardHeader>
                    <CardTitle className="text-emerald-900">RSU Value Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center pb-3 border-b border-primary-subtle">
                      <span className="text-text-secondary">Current Stock Value</span>
                      <span className="text-2xl font-bold text-primary-hover">
                        {formatCurrency(rsuResults.currentValue)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-text-secondary">Estimated Taxes Owed</span>
                      <span className="text-lg font-semibold text-error">
                        -{formatCurrency(rsuResults.taxOwed)}
                      </span>
                    </div>
                    <div className="pt-3 border-t border-primary-subtle flex justify-between items-center">
                      <span className="text-text-primary font-semibold">Net After-Tax Value</span>
                      <span className="text-3xl font-black text-primary">
                        {formatCurrency(rsuResults.netValue)}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-surface border-border">
                  <CardHeader>
                    <CardTitle className="text-text-primary flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-primary" />
                      About RSUs
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 text-sm text-text-secondary">
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">✓</span>
                        <span>
                          <strong>What they are:</strong> RSUs are company stock granted to you that vest over
                          time (typically 4 years with a 1-year cliff).
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">✓</span>
                        <span>
                          <strong>Taxation:</strong> RSUs are taxed as ordinary income when they vest, based on
                          the fair market value at vesting.
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">✓</span>
                        <span>
                          <strong>No upfront cost:</strong> Unlike options, you don&apos;t pay anything to receive
                          vested RSUs.
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">✓</span>
                        <span>
                          <strong>Common at:</strong> Public companies (Google, Meta, Amazon, etc.)
                        </span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </>
            ) : (
              <>
                <Card className={`${optionResults.isInTheMoney ? "bg-primary-subtle border-primary-subtle" : "bg-amber-50 border-amber-200"}`}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className={optionResults.isInTheMoney ? "text-emerald-900" : "text-amber-900"}>
                        Option Value Analysis
                      </CardTitle>
                      {!optionResults.isInTheMoney && (
                        <div className="flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
                          <AlertTriangle className="w-3 h-3" />
                          Out of the Money
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="text-sm text-text-secondary mb-2">Current Value (If Exercised Today)</div>
                      <div className="flex justify-between items-center pb-3 border-b border-border">
                        <span className="text-text-secondary">Gross Gain</span>
                        <span className="text-xl font-bold text-primary-hover">
                          {formatCurrency(optionResults.currentGain)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center pt-3">
                        <span className="text-text-secondary">Cost to Exercise</span>
                        <span className="text-sm font-semibold text-text-secondary">
                          {formatCurrency(optionResults.costToExercise)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-text-secondary">Estimated Taxes</span>
                        <span className="text-sm font-semibold text-error">
                          -{formatCurrency(optionResults.currentTax)}
                        </span>
                      </div>
                      <div className="pt-3 border-t border-border flex justify-between items-center mt-3">
                        <span className="text-text-primary font-semibold">Net After-Tax</span>
                        <span className="text-2xl font-black text-primary">
                          {formatCurrency(optionResults.currentNet)}
                        </span>
                      </div>
                    </div>

                    {futurePrice > 0 && (
                      <div className="pt-4 mt-4 border-t-2 border-border">
                        <div className="text-sm text-text-secondary mb-2">Future Value (At Target Price)</div>
                        <div className="flex justify-between items-center pb-3 border-b border-border">
                          <span className="text-text-secondary">Potential Gain</span>
                          <span className="text-xl font-bold text-info">
                            {formatCurrency(optionResults.futureGain)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center pt-3">
                          <span className="text-text-secondary">Estimated Taxes</span>
                          <span className="text-sm font-semibold text-error">
                            -{formatCurrency(optionResults.futureTax)}
                          </span>
                        </div>
                        <div className="pt-3 border-t border-border flex justify-between items-center mt-3">
                          <span className="text-text-primary font-semibold">Net After-Tax</span>
                          <span className="text-2xl font-black text-info">
                            {formatCurrency(optionResults.futureNet)}
                          </span>
                        </div>
                        <div className="mt-3 p-3 bg-info-subtle rounded-lg">
                          <div className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-info" />
                            <span className="text-sm font-semibold text-blue-900">
                              Potential Upside: {formatCurrency(optionResults.futureNet - optionResults.currentNet)}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="bg-surface border-border">
                  <CardHeader>
                    <CardTitle className="text-text-primary flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-info" />
                      About Stock Options
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 text-sm text-text-secondary">
                      <li className="flex items-start gap-2">
                        <span className="text-info mt-1">✓</span>
                        <span>
                          <strong>What they are:</strong> The right (but not obligation) to buy company stock
                          at a fixed &quot;strike price&quot; in the future.
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-info mt-1">✓</span>
                        <span>
                          <strong>Upfront cost:</strong> You must pay the strike price to &quot;exercise&quot; your
                          options and buy the stock.
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-info mt-1">✓</span>
                        <span>
                          <strong>Taxation:</strong> ISOs have preferential tax treatment (AMT applies). NSOs
                          are taxed as ordinary income on exercise.
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-info mt-1">✓</span>
                        <span>
                          <strong>Common at:</strong> Startups and pre-IPO companies
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-amber-600 mt-1">⚠</span>
                        <span>
                          <strong>Risk:</strong> Options can expire worthless if company value doesn&apos;t increase
                          above strike price.
                        </span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>

        {/* Comparison Section */}
        <Card className="mt-12 bg-secondary text-text-inverse border-secondary">
          <CardHeader>
            <CardTitle>RSUs vs Stock Options: Quick Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-secondary">
                    <th className="text-left py-3 text-text-muted font-medium">Feature</th>
                    <th className="text-left py-3 text-emerald-400 font-medium">RSUs</th>
                    <th className="text-left py-3 text-blue-400 font-medium">Stock Options</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  <tr>
                    <td className="py-3 text-text-muted">Upfront Cost</td>
                    <td className="py-3 text-emerald-300">$0</td>
                    <td className="py-3 text-blue-300">Must pay strike price</td>
                  </tr>
                  <tr>
                    <td className="py-3 text-text-muted">Downside Risk</td>
                    <td className="py-3 text-emerald-300">Low (always have value)</td>
                    <td className="py-3 text-blue-300">High (can expire worthless)</td>
                  </tr>
                  <tr>
                    <td className="py-3 text-text-muted">Upside Potential</td>
                    <td className="py-3 text-emerald-300">Moderate (1:1 with stock)</td>
                    <td className="py-3 text-blue-300">High (leveraged upside)</td>
                  </tr>
                  <tr>
                    <td className="py-3 text-text-muted">Common At</td>
                    <td className="py-3 text-emerald-300">Public companies</td>
                    <td className="py-3 text-blue-300">Startups, pre-IPO</td>
                  </tr>
                  <tr>
                    <td className="py-3 text-text-muted">Taxation</td>
                    <td className="py-3 text-emerald-300">Income at vest</td>
                    <td className="py-3 text-blue-300">Income or capital gains</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
