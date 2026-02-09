"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

export default function ContributePage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    company: "",
    role: "",
    location: "",
    level: "",
    baseSalary: "",
    equity: "",
    bonus: "",
    yearsExp: "",
    email: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/salaries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company: formData.company,
          role: formData.role,
          location: formData.location,
          level: formData.level,
          baseSalary: parseInt(formData.baseSalary),
          equity: parseInt(formData.equity || "0"),
          bonus: parseInt(formData.bonus || "0"),
          yearsExp: formData.yearsExp ? parseInt(formData.yearsExp) : null,
          email: formData.email || null,
        }),
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        alert('Failed to submit. Please try again.');
      }
    } catch {
      alert('Failed to submit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <main className="min-h-screen bg-slate-950">
        <div className="px-6 py-12">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto" />
            <h1 className="text-3xl font-bold text-slate-100">Thank You!</h1>
            <p className="text-xl text-slate-400">
              Your submission has been received and is pending review. 
              Once verified, it will help others negotiate better compensation.
            </p>
            <Button onClick={() => setSubmitted(false)} variant="outline">
              Submit Another
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950">
      
      <div className="px-6 py-12">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-slate-100">Contribute Your Salary</h1>
            <p className="text-xl text-slate-400">
              Help others negotiate better. Your data stays anonymous.
            </p>
          </div>

          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Company *</label>
                    <Input 
                      placeholder="Google, Meta, etc." 
                      required
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="bg-slate-800 border-slate-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Role *</label>
                    <Input 
                      placeholder="Software Engineer" 
                      required
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="bg-slate-800 border-slate-700"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Location *</label>
                    <Input 
                      placeholder="San Francisco, CA" 
                      required
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="bg-slate-800 border-slate-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Level</label>
                    <Select
                      value={formData.level}
                      onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                      className="bg-slate-800 border-slate-700"
                    >
                      <option value="">Select level...</option>
                      <option value="L1-L2">Junior (L1-L2)</option>
                      <option value="L3-L4">Mid (L3-L4)</option>
                      <option value="L5-L6">Senior (L5-L6)</option>
                      <option value="L7+">Staff+ (L7+)</option>
                    </Select>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Base Salary *</label>
                    <Input 
                      type="number" 
                      placeholder="150000" 
                      required
                      value={formData.baseSalary}
                      onChange={(e) => setFormData({ ...formData, baseSalary: e.target.value })}
                      className="bg-slate-800 border-slate-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Annual Equity</label>
                    <Input 
                      type="number" 
                      placeholder="50000"
                      value={formData.equity}
                      onChange={(e) => setFormData({ ...formData, equity: e.target.value })}
                      className="bg-slate-800 border-slate-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Annual Bonus</label>
                    <Input 
                      type="number" 
                      placeholder="20000"
                      value={formData.bonus}
                      onChange={(e) => setFormData({ ...formData, bonus: e.target.value })}
                      className="bg-slate-800 border-slate-700"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Years of Experience</label>
                    <Input 
                      type="number" 
                      placeholder="5"
                      value={formData.yearsExp}
                      onChange={(e) => setFormData({ ...formData, yearsExp: e.target.value })}
                      className="bg-slate-800 border-slate-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Email (optional)</label>
                    <Input 
                      type="email" 
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="bg-slate-800 border-slate-700"
                    />
                  </div>
                </div>

                <div className="p-4 bg-slate-800/50 rounded-lg text-sm text-slate-400">
                  <p className="font-medium text-slate-200 mb-2">Privacy Promise</p>
                  <ul className="space-y-1">
                    <li>• Your submission is anonymized immediately</li>
                    <li>• We never share individual data points</li>
                    <li>• Only aggregated statistics are shown publicly</li>
                    <li>• You can request deletion anytime</li>
                  </ul>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-indigo-600 to-violet-600"
                  disabled={loading}
                >
                  {loading ? 'Submitting...' : 'Submit Anonymously'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
