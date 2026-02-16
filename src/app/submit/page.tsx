"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { FileUploader } from '@/components/upload/file-uploader';

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

export default function SubmitSalaryPage() {
  const router = useRouter();

  // Controlled form state - guaranteed to sync with UI
  const [formData, setFormData] = useState({
    jobTitle: '',
    companyName: '',
    city: '',
    experienceLevel: '',
    state: '',
    baseSalary: '',
    stockOptions: '',
    bonus: '',
    otherComp: '',
    yearsAtCompany: '',
    userNotes: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Guaranteed onChange handler
  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const calculateTotalComp = () => {
    const base = parseInt(formData.baseSalary || "0");
    const stock = parseInt(formData.stockOptions || "0") / 4;
    const bonus = parseInt(formData.bonus || "0");
    const other = parseInt(formData.otherComp || "0");
    return base + stock + bonus + other;
  };

  const validate = () => {
    const missing: string[] = [];
    if (!formData.jobTitle.trim()) missing.push('Job Title');
    if (!formData.companyName.trim()) missing.push('Company Name');
    if (!formData.experienceLevel) missing.push('Experience Level');
    if (!formData.city.trim()) missing.push('City');
    if (!formData.state) missing.push('State');
    if (!formData.baseSalary || parseInt(formData.baseSalary) <= 0) missing.push('Base Salary');
    return missing;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const missing = validate();
    if (missing.length > 0) {
      setError(`Missing required fields: ${missing.join(', ')}`);
      return;
    }

    setIsLoading(true);

    const payload = {
      jobTitle: formData.jobTitle.trim(),
      companyName: formData.companyName.trim(),
      location: `${formData.city.trim()}, ${formData.state}`,
      baseSalary: formData.baseSalary,
      stockOptions: formData.stockOptions || '0',
      bonus: formData.bonus || '0',
      otherComp: formData.otherComp || '0',
      totalComp: calculateTotalComp().toString(),
      level: formData.experienceLevel,
      experienceLevel: formData.experienceLevel,
      yearsAtCompany: formData.yearsAtCompany || '0',
      userNotes: formData.userNotes?.trim() || '',
      submittedAt: new Date().toISOString(),
      status: 'pending_review',
    };

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
    } catch (err: unknown) {
      setError((err as Error).message || "Failed to submit. Please try again.");
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
              <p className="text-lg text-slate-600">Your contribution helps make salary data more transparent for everyone.</p>
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
          <h1 className="text-4xl font-bold text-slate-900">Share Your Salary</h1>
          <p className="text-xl text-slate-600">Help us build a more transparent compensation landscape.</p>
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
                    <label className={labelClass}>Job Title <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={formData.jobTitle}
                      onChange={e => handleChange('jobTitle', e.target.value)}
                      placeholder="e.g., Software Engineer"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Company Name <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={formData.companyName}
                      onChange={e => handleChange('companyName', e.target.value)}
                      placeholder="e.g., Google"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Experience Level <span className="text-red-500">*</span></label>
                  <select
                    value={formData.experienceLevel}
                    onChange={e => handleChange('experienceLevel', e.target.value)}
                    className={selectClass}
                  >
                    <option value="">-- Select experience level --</option>
                    {EXPERIENCE_LEVELS.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>City <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={e => handleChange('city', e.target.value)}
                      placeholder="e.g., San Francisco"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>State <span className="text-red-500">*</span></label>
                    <select
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

              {/* Compensation */}
              <div className="space-y-4 pt-4">
                <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-100 pb-2">Compensation Details</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Base Salary (Annual) <span className="text-red-500">*</span></label>
                    <input
                      type="number"
                      min="1"
                      value={formData.baseSalary}
                      onChange={e => handleChange('baseSalary', e.target.value)}
                      placeholder="e.g., 150000"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Stock/Equity (4-year grant)</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.stockOptions}
                      onChange={e => handleChange('stockOptions', e.target.value)}
                      placeholder="e.g., 400000"
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
                      placeholder="e.g., 25000"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Other Compensation</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.otherComp}
                      onChange={e => handleChange('otherComp', e.target.value)}
                      placeholder="e.g., 5000"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
                  <p className="text-sm text-slate-700">
                    <span className="font-semibold">Calculated Total Comp:</span>{' '}
                    <span className="text-lg font-bold text-emerald-700">${calculateTotalComp().toLocaleString()}</span>
                  </p>
                </div>
              </div>

              {/* Additional Info */}
              <div className="space-y-4 pt-4">
                <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-100 pb-2">Additional Information</h3>
                <div>
                  <label className={labelClass}>Additional Notes</label>
                  <textarea
                    value={formData.userNotes}
                    onChange={e => handleChange('userNotes', e.target.value)}
                    placeholder="Any additional context..."
                    rows={4}
                    className={`${inputClass} resize-none`}
                  />
                </div>
              </div>

              {/* Verification */}
              <div className="space-y-4 pt-4">
                <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-100 pb-2">Verification (Optional)</h3>
                <p className="text-sm text-slate-600">
                  Upload your offer letter to get a &quot;Verified&quot; badge and unlock premium insights.
                </p>
                <div className="mt-4">
                  {/* We need to import FileUploader dynamically or at top */}
                  {/* Since this is a client component, we can import it. I will add import at top later */}
                  <FileUploader />
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
                {isLoading ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Submitting...</> : "Submit Salary Data"}
              </Button>

              {/* Live state display */}
              <div className="text-xs text-slate-400 mt-4 border-t pt-4">
                <p>Experience Level: {formData.experienceLevel || '(not selected)'}</p>
                <p>State: {formData.state || '(not selected)'}</p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
