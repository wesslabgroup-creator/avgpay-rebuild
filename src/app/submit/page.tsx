"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Loader2 } from 'lucide-react';

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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const VALUE_LABELS: Record<string, string> = {
  '': '(empty)',
};

export default function SubmitSalaryPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDebug, setShowDebug] = useState(false);
  const [lastSubmitData, setLastSubmitData] = useState<Record<string, string>>({});

  const calculateTotalComp = (formData: FormData) => {
    const base = parseInt((formData.get('baseSalary') as string) || "0");
    const stock = parseInt((formData.get('stockOptions') as string) || "0") / 4;
    const bonus = parseInt((formData.get('bonus') as string) || "0");
    const other = parseInt((formData.get('otherComp') as string) || "0");
    return base + stock + bonus + other;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    // Get form data directly from the form element - most reliable method
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    // Extract all values
    const jobTitle = (formData.get('jobTitle') as string || '').trim();
    const companyName = (formData.get('companyName') as string || '').trim();
    const city = (formData.get('city') as string || '').trim();
    const experienceLevel = formData.get('experienceLevel') as string || '';
    const state = formData.get('state') as string || '';
    const baseSalary = formData.get('baseSalary') as string || '';
    const stockOptions = formData.get('stockOptions') as string || '';
    const bonus = formData.get('bonus') as string || '';
    const otherComp = formData.get('otherComp') as string || '';
    const yearsAtCompany = formData.get('yearsAtCompany') as string || '';
    const userNotes = (formData.get('userNotes') as string || '').trim();

    // Store for debug display
    setLastSubmitData({
      jobTitle,
      companyName,
      city,
      experienceLevel: experienceLevel || '(empty string)',
      state: state || '(empty string)',
      baseSalary,
    });

    console.log('FormData values:', {
      jobTitle, companyName, city, experienceLevel, state, baseSalary
    });

    // Validation
    const missing: string[] = [];
    if (!jobTitle) missing.push('Job Title');
    if (!companyName) missing.push('Company Name');
    if (!experienceLevel) missing.push('Experience Level');
    if (!city) missing.push('City');
    if (!state) missing.push('State');
    if (!baseSalary || parseInt(baseSalary) <= 0) missing.push('Base Salary');

    if (missing.length > 0) {
      setError(`⚠️ Missing required fields: ${missing.join(', ')}`);
      console.log('Validation failed:', missing);
      return;
    }

    setIsLoading(true);

    const totalComp = calculateTotalComp(formData);
    const location = `${city}, ${state}`;

    const payload = {
      jobTitle,
      companyName,
      location,
      baseSalary,
      stockOptions: stockOptions || '0',
      bonus: bonus || '0',
      otherComp: otherComp || '0',
      totalComp: totalComp.toString(),
      experienceLevel,
      yearsAtCompany: yearsAtCompany || '0',
      userNotes,
      submittedAt: new Date().toISOString(),
      status: 'pending_review',
    };

    console.log('Submitting:', payload);

    try {
      const response = await fetch('/api/submit-salary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || `Server error: ${response.status}`);
      }

      setIsSuccess(true);
      setTimeout(() => router.push('/salaries'), 3000);
    } catch (err: any) {
      console.error('Submit error:', err);
      setError(err.message || "Failed to submit. Please try again.");
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
              <p className="text-lg text-slate-600">Your contribution helps make the tech industry more transparent.</p>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  const inputClass = "w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20";
  const selectClass = "w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 cursor-pointer";
  const labelClass = "block text-sm font-medium text-slate-700 mb-1";
  const requiredMark = <span className="text-red-500">*</span>;

  return (
    <main className="min-h-screen bg-slate-50 pt-24 pb-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center space-y-4 mb-8">
          <h1 className="text-4xl font-bold text-slate-900">Share Your Salary</h1>
          <p className="text-xl text-slate-600">
            Help us build a more transparent compensation landscape.
          </p>
        </div>

        <Card className="bg-white border-slate-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-slate-900 text-2xl">Salary Submission Form</CardTitle>
            <CardDescription className="text-slate-500">
              Fields marked with {requiredMark} are required.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6" id="salary-form">
              
              {/* Job Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-100 pb-2">Job Details</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>
                      Job Title {requiredMark}
                    </label>
                    <input
                      name="jobTitle"
                      type="text"
                      placeholder="e.g., Software Engineer"
                      className={inputClass}
                      required
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      Company Name {requiredMark}
                    </label>
                    <input
                      name="companyName"
                      type="text"
                      placeholder="e.g., Google"
                      className={inputClass}
                      required
                    />
                  </div>
                </div>

                {/* Experience Level */}
                <div>
                  <label className={labelClass}>
                    Experience Level {requiredMark}
                  </label>
                  <select 
                    name="experienceLevel" 
                    className={selectClass}
                    defaultValue=""
                    required
                  >
                    <option value="" disabled>-- Select experience level --</option>
                    {EXPERIENCE_LEVELS.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>

                {/* Location */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>
                      City {requiredMark}
                    </label>
                    <input
                      name="city"
                      type="text"
                      placeholder="e.g., San Francisco"
                      className={inputClass}
                      required
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      State {requiredMark}
                    </label>
                    <select 
                      name="state" 
                      className={selectClass}
                      defaultValue=""
                      required
                    >
                      <option value="" disabled>-- Select state --</option>
                      {US_STATES.map(state => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className={labelClass}>
                    Years at Company
                  </label>
                  <input
                    name="yearsAtCompany"
                    type="number"
                    min="0"
                    placeholder="e.g., 2"
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Compensation */}
              <div className="space-y-4 pt-4">
                <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-100 pb-2">Compensation Details</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>
                      Base Salary (Annual) {requiredMark}
                    </label>
                    <input
                      name="baseSalary"
                      type="number"
                      min="1"
                      placeholder="e.g., 150000"
                      className={inputClass}
                      required
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      Stock/Equity (4-year grant)
                    </label>
                    <input
                      name="stockOptions"
                      type="number"
                      min="0"
                      placeholder="e.g., 400000"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      Annual Bonus
                    </label>
                    <input
                      name="bonus"
                      type="number"
                      min="0"
                      placeholder="e.g., 25000"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      Other Compensation
                    </label>
                    <input
                      name="otherComp"
                      type="number"
                      min="0"
                      placeholder="e.g., 5000"
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="space-y-4 pt-4">
                <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-100 pb-2">Additional Information</h3>
                <div>
                  <label className={labelClass}>
                    Additional Notes
                  </label>
                  <textarea
                    name="userNotes"
                    placeholder="Any additional context..."
                    rows={4}
                    className={`${inputClass} resize-none`}
                  />
                </div>
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
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Salary Data"
                )}
              </Button>

              {/* Debug Toggle */}
              <button
                type="button"
                onClick={() => setShowDebug(!showDebug)}
                className="text-xs text-slate-400 underline"
              >
                {showDebug ? 'Hide' : 'Show'} Debug Info
              </button>

              {showDebug && (
                <div className="p-4 bg-slate-100 rounded-lg text-xs font-mono">
                  <p className="font-semibold mb-2">Last Submit Attempt:</p>
                  {Object.entries(lastSubmitData).map(([key, val]) => (
                    <p key={key}>{key}: &quot;{val || '(empty)'}&quot;</p>
                  ))}
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
