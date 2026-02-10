"use client";

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Loader2 } from 'lucide-react';

const EXPERIENCE_LEVELS = [
  "Select level...",
  "Entry Level (0-2 years)",
  "Junior (2-4 years)",
  "Mid-Level (4-7 years)",
  "Senior (7-10 years)",
  "Staff+ (10+ years)",
];

const US_STATES = [
  "Select state...",
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
  "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
  "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
  "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
  "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY",
  "DC", "Remote"
];

export default function SubmitSalaryPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDebug, setShowDebug] = useState(false);

  // Uncontrolled refs for all fields
  const jobTitleRef = useRef<HTMLInputElement>(null);
  const companyNameRef = useRef<HTMLInputElement>(null);
  const cityRef = useRef<HTMLInputElement>(null);
  const experienceLevelRef = useRef<HTMLSelectElement>(null);
  const stateRef = useRef<HTMLSelectElement>(null);
  const baseSalaryRef = useRef<HTMLInputElement>(null);
  const stockOptionsRef = useRef<HTMLInputElement>(null);
  const bonusRef = useRef<HTMLInputElement>(null);
  const otherCompRef = useRef<HTMLInputElement>(null);
  const yearsAtCompanyRef = useRef<HTMLInputElement>(null);
  const userNotesRef = useRef<HTMLTextAreaElement>(null);

  const calculateTotalComp = () => {
    const base = parseInt(baseSalaryRef.current?.value || "0");
    const stock = parseInt(stockOptionsRef.current?.value || "0") / 4;
    const bonusVal = parseInt(bonusRef.current?.value || "0");
    const other = parseInt(otherCompRef.current?.value || "0");
    return base + stock + bonusVal + other;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Read values directly from DOM refs
    const jobTitle = jobTitleRef.current?.value?.trim() || '';
    const companyName = companyNameRef.current?.value?.trim() || '';
    const city = cityRef.current?.value?.trim() || '';
    const experienceLevel = experienceLevelRef.current?.value || '';
    const state = stateRef.current?.value || '';
    const baseSalary = baseSalaryRef.current?.value || '';

    console.log('Form values from refs:', {
      jobTitle, companyName, city, experienceLevel, state, baseSalary
    });

    // Validation
    const missing: string[] = [];
    if (!jobTitle) missing.push('Job Title');
    if (!companyName) missing.push('Company Name');
    if (!experienceLevel || experienceLevel === 'Select level...') missing.push('Experience Level');
    if (!city) missing.push('City');
    if (!state || state === 'Select state...') missing.push('State');
    if (!baseSalary || parseInt(baseSalary) <= 0) missing.push('Base Salary');

    if (missing.length > 0) {
      setError(`Missing required fields: ${missing.join(', ')}`);
      console.log('Validation failed:', missing);
      return;
    }

    setIsLoading(true);

    const totalComp = calculateTotalComp();
    const location = `${city}, ${state}`;

    const payload = {
      jobTitle,
      companyName,
      location,
      baseSalary,
      stockOptions: stockOptionsRef.current?.value || '0',
      bonus: bonusRef.current?.value || '0',
      otherComp: otherCompRef.current?.value || '0',
      totalComp: totalComp.toString(),
      experienceLevel,
      yearsAtCompany: yearsAtCompanyRef.current?.value || '0',
      userNotes: userNotesRef.current?.value?.trim() || '',
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

  const inputClass = "w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20";
  const selectClass = "w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 appearance-none cursor-pointer";

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
              Fields marked with <span className="text-red-500">*</span> are required.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Job Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-100 pb-2">Job Details</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Job Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      ref={jobTitleRef}
                      type="text"
                      placeholder="e.g., Software Engineer"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Company Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      ref={companyNameRef}
                      type="text"
                      placeholder="e.g., Google"
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* Experience Level */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Experience Level <span className="text-red-500">*</span>
                  </label>
                  <select ref={experienceLevelRef} className={selectClass}>
                    {EXPERIENCE_LEVELS.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>

                {/* Location */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      ref={cityRef}
                      type="text"
                      placeholder="e.g., San Francisco"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      State <span className="text-red-500">*</span>
                    </label>
                    <select ref={stateRef} className={selectClass}>
                      {US_STATES.map(state => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Years at Company
                  </label>
                  <input
                    ref={yearsAtCompanyRef}
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
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Base Salary (Annual) <span className="text-red-500">*</span>
                    </label>
                    <input
                      ref={baseSalaryRef}
                      type="number"
                      min="1"
                      placeholder="e.g., 150000"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Stock/Equity (4-year grant)
                    </label>
                    <input
                      ref={stockOptionsRef}
                      type="number"
                      min="0"
                      placeholder="e.g., 400000"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Annual Bonus
                    </label>
                    <input
                      ref={bonusRef}
                      type="number"
                      min="0"
                      placeholder="e.g., 25000"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Other Compensation
                    </label>
                    <input
                      ref={otherCompRef}
                      type="number"
                      min="0"
                      placeholder="e.g., 5000"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
                  <p className="text-sm text-slate-700">
                    <span className="font-semibold">Calculated Total Comp:</span>{' '}
                    <span className="text-lg font-bold text-emerald-700">
                      ${calculateTotalComp().toLocaleString()}
                    </span>
                  </p>
                </div>
              </div>

              {/* Additional Info */}
              <div className="space-y-4 pt-4">
                <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-100 pb-2">Additional Information</h3>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Additional Notes
                  </label>
                  <textarea
                    ref={userNotesRef}
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
                  <p className="font-semibold mb-2">Form Refs (current values):</p>
                  <p>jobTitle: {jobTitleRef.current?.value || '(empty)'}</p>
                  <p>experienceLevel: {experienceLevelRef.current?.value || '(empty)'}</p>
                  <p>state: {stateRef.current?.value || '(empty)'}</p>
                  <p>city: {cityRef.current?.value || '(empty)'}</p>
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
