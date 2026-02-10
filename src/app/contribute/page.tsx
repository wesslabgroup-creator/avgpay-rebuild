"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2 } from "lucide-react";

const EXPERIENCE_LEVELS = [
  "Entry Level (0-2 years)",
  "Junior (2-4 years)",
  "Mid-Level (4-7 years)",
  "Senior (7-10 years)",
  "Staff+ (10+ years)",
];

const US_STATES = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
  "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
  "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
  "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
  "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY",
  "DC", "Remote"
];

export default function ContributePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    companyName: "",
    jobTitle: "",
    city: "",
    state: "",
    experienceLevel: "",
    baseSalary: "",
    stockOptions: "",
    bonus: "",
    yearsAtCompany: "",
    email: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const calculateTotalComp = () => {
    const base = parseInt(formData.baseSalary || "0");
    const stock = parseInt(formData.stockOptions || "0") / 4;
    const bonus = parseInt(formData.bonus || "0");
    return Math.round(base + stock + bonus);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.companyName || !formData.jobTitle || !formData.city || !formData.state || !formData.baseSalary || !formData.experienceLevel) {
      setError("Please fill in all required fields (marked *).");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/submit-salary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName: formData.companyName.trim(),
          jobTitle: formData.jobTitle.trim(),
          location: `${formData.city.trim()}, ${formData.state}`,
          level: formData.experienceLevel,
          baseSalary: formData.baseSalary,
          totalComp: calculateTotalComp().toString(),
          userNotes: `Initial submission from contribute page. Years at company: ${formData.yearsAtCompany}`,
        }),
      });

      if (response.ok) {
        setIsSuccess(true);
      } else {
        const errData = await response.json().catch(() => ({}));
        setError(errData.error || "Failed to submit. Please try again.");
      }
    } catch {
      setError("Failed to submit. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <main className="min-h-screen bg-slate-50 pt-24 pb-12">
        <div className="max-w-2xl mx-auto px-6">
          <Card className="bg-white border-emerald-200 shadow-lg">
            <CardContent className="p-12 text-center">
              <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Thank You!</h2>
              <p className="text-lg text-slate-600">
                Your submission has been received and is pending review.
                Once verified, it will help others negotiate better compensation.
              </p>
              <div className="mt-8 flex justify-center gap-4">
                <Button onClick={() => setIsSuccess(false)} variant="outline">
                  Submit Another
                </Button>
                <Button onClick={() => router.push('/salaries')}>
                  View Salaries
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  const inputClass = "w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20";
  const selectClass = "w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20";
  const labelClass = "block text-sm font-medium text-slate-700 mb-1";

  return (
    <main className="min-h-screen bg-slate-50 pt-24 pb-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center space-y-4 mb-8">
          <h1 className="text-4xl font-bold text-slate-900">Contribute Your Salary</h1>
          <p className="text-xl text-slate-600">Help build a more transparent compensation landscape. Your data stays anonymous.</p>
        </div>

        <Card className="bg-white border-slate-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-slate-900 text-2xl">Salary Contribution Form</CardTitle>
            <CardDescription className="text-slate-500">
              Fields marked with <span className="text-red-500">*</span> are required.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Company & Role */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-100 pb-2">Professional Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Company Name <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      required
                      value={formData.companyName}
                      onChange={e => handleChange('companyName', e.target.value)}
                      placeholder="e.g., Google"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Job Title <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      required
                      value={formData.jobTitle}
                      onChange={e => handleChange('jobTitle', e.target.value)}
                      placeholder="e.g., Software Engineer"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>City <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={e => handleChange('city', e.target.value)}
                      placeholder="e.g., San Francisco"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>State <span className="text-red-500">*</span></label>
                    <select
                      required
                      value={formData.state}
                      onChange={e => handleChange('state', e.target.value)}
                      className={selectClass}
                    >
                      <option value="">-- Select state --</option>
                      {US_STATES.map(state => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Experience Level <span className="text-red-500">*</span></label>
                    <select
                      value={formData.experienceLevel}
                      onChange={e => handleChange('experienceLevel', e.target.value)}
                      className={selectClass}
                    >
                      <option value="">-- Select experience --</option>
                      {EXPERIENCE_LEVELS.map(level => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Years at Company</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.yearsAtCompany}
                      onChange={e => handleChange('yearsAtCompany', e.target.value)}
                      placeholder="e.g., 2"
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>

              {/* Compensation */}
              <div className="space-y-4 pt-4">
                <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-100 pb-2">Compensation Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className={labelClass}>Base Salary <span className="text-red-500">*</span></label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={formData.baseSalary}
                      onChange={e => handleChange('baseSalary', e.target.value)}
                      placeholder="150000"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Annual Equity</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.stockOptions}
                      onChange={e => handleChange('stockOptions', e.target.value)}
                      placeholder="50000"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Annual Bonus</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.bonus}
                      onChange={e => handleChange('bonus', e.target.value)}
                      placeholder="20000"
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>

              {/* Contact */}
              <div className="space-y-4 pt-4">
                <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-100 pb-2">Contact Info (Optional)</h3>
                <div>
                  <label className={labelClass}>Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={e => handleChange('email', e.target.value)}
                    placeholder="you@example.com"
                    className={inputClass}
                  />
                  <p className="mt-2 text-xs text-slate-500 italic">
                    Your email is never shared. We only use it to follow up if there are questions about your data verification.
                  </p>
                </div>
              </div>

              {/* Privacy Message */}
              <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-100 text-sm text-slate-600">
                <p className="font-semibold text-emerald-800 mb-1">Privacy Promise</p>
                <ul className="space-y-1 text-slate-600">
                  <li>• Your submission is anonymized immediately</li>
                  <li>• We never share individual data points</li>
                  <li>• Only aggregated statistics are shown publicly</li>
                </ul>
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full py-6 text-lg font-semibold bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300"
              >
                {isLoading ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Submitting...</> : "Submit Anonymously"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
