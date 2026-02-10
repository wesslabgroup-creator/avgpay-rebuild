"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { TrendingUp, Plus, Trash2, Award } from "lucide-react";

interface Offer {
  id: string;
  companyName: string;
  role: string;
  location: string;
  baseSalary: number;
  equity: number;
  bonus: number;
  signingBonus: number;
}

export default function CompareOffersPage() {
  const [offers, setOffers] = useState<Offer[]>([
    {
      id: "1",
      companyName: "",
      role: "",
      location: "",
      baseSalary: 0,
      equity: 0,
      bonus: 0,
      signingBonus: 0,
    },
    {
      id: "2",
      companyName: "",
      role: "",
      location: "",
      baseSalary: 0,
      equity: 0,
      bonus: 0,
      signingBonus: 0,
    },
  ]);

  const calculateTC = (offer: Offer) => {
    return offer.baseSalary + (offer.equity / 4) + offer.bonus;
  };

  const calculateYear1Total = (offer: Offer) => {
    return calculateTC(offer) + offer.signingBonus;
  };

  const addOffer = () => {
    if (offers.length < 4) {
      setOffers([
        ...offers,
        {
          id: Date.now().toString(),
          companyName: "",
          role: "",
          location: "",
          baseSalary: 0,
          equity: 0,
          bonus: 0,
          signingBonus: 0,
        },
      ]);
    }
  };

  const removeOffer = (id: string) => {
    if (offers.length > 2) {
      setOffers(offers.filter((offer) => offer.id !== id));
    }
  };

  const updateOffer = (id: string, field: keyof Offer, value: string | number) => {
    setOffers(
      offers.map((offer) =>
        offer.id === id ? { ...offer, [field]: value } : offer
      )
    );
  };

  const getHighestValue = (field: keyof Offer) => {
    if (field === "companyName" || field === "role" || field === "location" || field === "id") return null;
    const values = offers.map((offer) => offer[field] as number);
    return Math.max(...values);
  };

  const highestTC = Math.max(...offers.map(calculateTC));
  const highestYear1 = Math.max(...offers.map(calculateYear1Total));

  const formatCurrency = (n: number) => `$${(n / 1000).toFixed(0)}k`;

  return (
    <main className="min-h-screen bg-slate-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 text-sm font-medium">
            <Award className="w-4 h-4" />
            Compare Side-by-Side
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            Compare Job Offers
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Make data-driven decisions by comparing compensation packages side-by-side
          </p>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto">
          <div className="inline-flex gap-4 min-w-full pb-4">
            {offers.map((offer, index) => (
              <Card
                key={offer.id}
                className={`flex-1 min-w-[300px] ${calculateTC(offer) === highestTC && calculateTC(offer) > 0
                    ? "border-2 border-emerald-500 shadow-lg"
                    : "border-slate-200"
                  }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Offer {index + 1}</CardTitle>
                    {offers.length > 2 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeOffer(offer.id)}
                        className="h-8 w-8 p-0 text-slate-400 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  {calculateTC(offer) === highestTC && calculateTC(offer) > 0 && (
                    <div className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      Highest Total Comp
                    </div>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Company & Role */}
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-slate-600">Company</label>
                    <Input
                      type="text"
                      placeholder="e.g., Google"
                      value={offer.companyName}
                      onChange={(e) => updateOffer(offer.id, "companyName", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-medium text-slate-600">Role</label>
                    <Input
                      type="text"
                      placeholder="e.g., Software Engineer"
                      value={offer.role}
                      onChange={(e) => updateOffer(offer.id, "role", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-medium text-slate-600">Location</label>
                    <Input
                      type="text"
                      placeholder="e.g., San Francisco, CA"
                      value={offer.location}
                      onChange={(e) => updateOffer(offer.id, "location", e.target.value)}
                    />
                  </div>

                  {/* Compensation */}
                  <div className="pt-4 border-t border-slate-200 space-y-3">
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-slate-600">
                        Base Salary
                        {offer.baseSalary === getHighestValue("baseSalary") && offer.baseSalary > 0 && (
                          <span className="ml-2 text-emerald-600">🏆</span>
                        )}
                      </label>
                      <Input
                        type="number"
                        placeholder="150000"
                        value={offer.baseSalary || ""}
                        onChange={(e) =>
                          updateOffer(offer.id, "baseSalary", parseInt(e.target.value) || 0)
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-medium text-slate-600">
                        Equity (4-year)
                        {offer.equity === getHighestValue("equity") && offer.equity > 0 && (
                          <span className="ml-2 text-emerald-600">🏆</span>
                        )}
                      </label>
                      <Input
                        type="number"
                        placeholder="200000"
                        value={offer.equity || ""}
                        onChange={(e) =>
                          updateOffer(offer.id, "equity", parseInt(e.target.value) || 0)
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-medium text-slate-600">
                        Annual Bonus
                        {offer.bonus === getHighestValue("bonus") && offer.bonus > 0 && (
                          <span className="ml-2 text-emerald-600">🏆</span>
                        )}
                      </label>
                      <Input
                        type="number"
                        placeholder="20000"
                        value={offer.bonus || ""}
                        onChange={(e) =>
                          updateOffer(offer.id, "bonus", parseInt(e.target.value) || 0)
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-medium text-slate-600">
                        Signing Bonus
                        {offer.signingBonus === getHighestValue("signingBonus") &&
                          offer.signingBonus > 0 && (
                            <span className="ml-2 text-emerald-600">🏆</span>
                          )}
                      </label>
                      <Input
                        type="number"
                        placeholder="50000"
                        value={offer.signingBonus || ""}
                        onChange={(e) =>
                          updateOffer(offer.id, "signingBonus", parseInt(e.target.value) || 0)
                        }
                      />
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="pt-4 border-t border-slate-200 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Total Comp (TC)</span>
                      <span className="text-lg font-bold text-slate-900">
                        {formatCurrency(calculateTC(offer))}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-500">Year 1 Total</span>
                      <span className="text-sm font-semibold text-emerald-600">
                        {formatCurrency(calculateYear1Total(offer))}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Add Offer Button */}
        {offers.length < 4 && (
          <div className="flex justify-center mt-6">
            <Button
              onClick={addOffer}
              variant="outline"
              className="border-2 border-dashed border-slate-300 hover:border-emerald-500"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Another Offer
            </Button>
          </div>
        )}

        {/* Summary Stats */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <Card className="bg-emerald-50 border-emerald-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-emerald-700">Highest TC (Annual)</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-black text-emerald-600">
                {formatCurrency(highestTC)}
              </p>
              <p className="text-xs text-emerald-600 mt-1">
                {offers.find((o) => calculateTC(o) === highestTC)?.companyName || "N/A"}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-blue-50 border-blue-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-blue-700">Highest Year 1</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-black text-blue-600">
                {formatCurrency(highestYear1)}
              </p>
              <p className="text-xs text-blue-600 mt-1">
                {offers.find((o) => calculateYear1Total(o) === highestYear1)?.companyName || "N/A"}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-50 border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-slate-700">Offers Compared</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-black text-slate-900">{offers.length}</p>
              <p className="text-xs text-slate-600 mt-1">Side-by-side analysis</p>
            </CardContent>
          </Card>
        </div>

        {/* Tips */}
        <Card className="mt-12 bg-white border-slate-200">
          <CardHeader>
            <CardTitle>Comparison Tips</CardTitle>
            <CardDescription>Consider these factors beyond raw numbers</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="grid md:grid-cols-2 gap-4 text-sm text-slate-700">
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 mt-1">•</span>
                <span>
                  <strong>Equity Type:</strong> RSUs vs stock options have different risk profiles
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 mt-1">•</span>
                <span>
                  <strong>Vesting Schedule:</strong> 4-year vest with 1-year cliff is standard
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 mt-1">•</span>
                <span>
                  <strong>Cost of Living:</strong> Adjust for location differences
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 mt-1">•</span>
                <span>
                  <strong>Growth Potential:</strong> Startups vs Big Tech have different trajectories
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 mt-1">•</span>
                <span>
                  <strong>Benefits:</strong> Healthcare, 401k match, PTO can add significant value
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 mt-1">•</span>
                <span>
                  <strong>Work-Life Balance:</strong> Quality of life matters beyond compensation
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
