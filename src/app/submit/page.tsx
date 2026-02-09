"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { SearchableSelect } from '@/components/searchable-select';
import { CheckCircle2, Loader2 } from 'lucide-react';

const EXPERIENCE_LEVELS = [
  { value: "Entry Level (0-2 years)", label: "Entry Level (0-2 years)" },
  { value: "Junior (2-4 years)", label: "Junior (2-4 years)" },
  { value: "Mid-Level (4-7 years)", label: "Mid-Level (4-7 years)" },
  { value: "Senior (7-10 years)", label: "Senior (7-10 years)" },
  { value: "Staff+ (10+ years)", label: "Staff+ (10+ years)" },
];

// Common US states for dropdown
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

  const [formData, setFormData] = useState({
    jobTitle: '',
    companyName: '',
    city: '',
    state: '',
    baseSalary: '',
    stockOptions: '',
    bonus: '',
    otherComp: '',
    experienceLevel: '',
    yearsAtCompany: '',
    userNotes: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setTouched(prev => ({ ...prev, [name]: true }));
    setError(null); // Clear error on change
  };

  const calculateTotalComp = () => {
    const base = parseInt(formData.baseSalary || "0");
    const stock = parseInt(formData.stockOptions || "0") / 4; // Annualized
    const bonus = parseInt(formData.bonus || "0");
    const other = parseInt(formData.otherComp || "0");
    return base + stock + bonus + other;
  };

  const validateForm = (): boolean => {
    const requiredFields = ['jobTitle', 'companyName', 'city', 'state', 'baseSalary', 'experienceLevel'];
    const missingFields = requiredFields.filter(field => {
      const value = formData[field as keyof typeof formData];
      const isMissing = !value || value.toString().trim() === '';
      return isMissing;
    });

    if (missingFields.length > 0) {
      const fieldNames: Record<string, string> = {
        jobTitle: 'Job Title',
        companyName: 'Company Name', 
        city: 'City',
        state: 'State',
        baseSalary: 'Base Salary',
        experienceLevel: 'Experience Level'
      };
      setError(`Please fill in: ${missingFields.map(f => fieldNames[f] || f).join(', ')}`);
      // Mark all fields as touched to show validation errors
      const allTouched: Record<string, boolean> = {};
      requiredFields.forEach(f => allTouched[f] = true);
      setTouched(allTouched);
      return false;
    }

    const baseSalaryNum = parseInt(formData.baseSalary);
    if (isNaN(baseSalaryNum) || baseSalaryNum <= 0) {
      setError("Base salary must be a valid number greater than 0");
      setTouched(prev => ({ ...prev, baseSalary: true }));
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('Form submission started', formData);
    
    if (!validateForm()) {
      console.log('Validation failed');
      return;
    }

    setIsLoading(true);
    setError(null);

    const totalComp = calculateTotalComp();
    const location = `${formData.city.trim()}, ${formData.state}`;

    try {
      const response = await fetch('/api/submit-salary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobTitle: formData.jobTitle,
          companyName: formData.companyName,
          location: location,
          baseSalary: formData.baseSalary,
          stockOptions: formData.stockOptions || '0',
          bonus: formData.bonus || '0',
          otherComp: formData.otherComp || '0',
          totalComp: totalComp.toString(),
          experienceLevel: formData.experienceLevel,
          yearsAtCompany: formData.yearsAtCompany || '0',
          userNotes: formData.userNotes,
          submittedAt: new Date().toISOString(),
          status: 'pending_review',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      setIsSuccess(true);
      setTimeout(() => {
        router.push('/salaries');
      }, 3000);
    } catch (err: any) {
      console.error("Failed to submit salary:", err);
      setError(err.message || "Failed to submit salary. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const isFieldError = (fieldName: string) => {
    return touched[fieldName] && !formData[fieldName as keyof typeof formData];
  };

  if (isSuccess) {
    return (
      <main className="min-h-screen bg-slate-50 pt-24 pb-12">
        <div className="max-w-2xl mx-auto px-6">
          <Card className="bg-white border-emerald-200 shadow-lg">
            <CardContent className="p-12 text-center">
              <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Thank You!</h2>
              <p className="text-lg text-slate-600 mb-4">
                Your contribution helps make the tech industry more transparent.
              </p>
              <p className="text-sm text-slate-500">
                Redirecting you to the salaries page...
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 pt-24 pb-12">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center space-y-4 mb-10">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">Share Your Salary</h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Help us build a more transparent compensation landscape. Your data is anonymized and reviewed for quality.
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
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              {/* Job Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-100 pb-2">Job Details</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="jobTitle" className="block text-sm font-medium text-slate-700 mb-1">
                      Job Title <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="jobTitle"
                      name="jobTitle"
                      value={formData.jobTitle}
                      onChange={handleInputChange}
                      placeholder="e.g., Software Engineer"
                      className={`text-base py-3 px-4 ${isFieldError('jobTitle') ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                    />
                    {isFieldError('jobTitle') && (
                      <p className="text-red-500 text-xs mt-1">Job title is required</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="companyName" className="block text-sm font-medium text-slate-700 mb-1">
                      Company Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="companyName"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      placeholder="e.g., Google"
                      className={`text-base py-3 px-4 ${isFieldError('companyName') ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                    />
                    {isFieldError('companyName') && (
                      <p className="text-red-500 text-xs mt-1">Company name is required</p>
                    )}
                  </div>
                </div>

                <SearchableSelect
                  label="Experience Level"
                  value={formData.experienceLevel}
                  onChange={(value) => {
                    setFormData(prev => ({ ...prev, experienceLevel: value }));
                    setTouched(prev => ({ ...prev, experienceLevel: true }));
                    setError(null);
                  }}
                  options={EXPERIENCE_LEVELS.map(l => l.label)}
                  placeholder="Select experience level..."
                  required
                />
                {isFieldError('experienceLevel') && (
                  <p className="text-red-500 text-xs mt-1">Experience level is required</p>
                )}

                {/* Location - City and State */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-slate-700 mb-1">
                      City <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="e.g., San Francisco"
                      className={`text-base py-3 px-4 ${isFieldError('city') ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                    />
                    {isFieldError('city') && (
                      <p className="text-red-500 text-xs mt-1">City is required</p>
                    )}
                  </div>

                  <div>
                    <SearchableSelect
                      label="State"
                      value={formData.state}
                      onChange={(value) => {
                        setFormData(prev => ({ ...prev, state: value }));
                        setTouched(prev => ({ ...prev, state: true }));
                        setError(null);
                      }}
                      options={US_STATES}
                      placeholder="Select state..."
                      required
                    />
                    {isFieldError('state') && (
                      <p className="text-red-500 text-xs mt-1">State is required</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="yearsAtCompany" className="block text-sm font-medium text-slate-700 mb-1">
                    Years at Company
                  </label>
                  <Input
                    id="yearsAtCompany"
                    name="yearsAtCompany"
                    type="number"
                    value={formData.yearsAtCompany}
                    onChange={handleInputChange}
                    placeholder="e.g., 2"
                    min="0"
                    className="text-base py-3 px-4"
                  />
                </div>
              </div>

              {/* Compensation Breakdown */}
              <div className="space-y-4 pt-4">
                <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-100 pb-2">Compensation Details</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="baseSalary" className="block text-sm font-medium text-slate-700 mb-1">
                      Base Salary (Annual) <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="baseSalary"
                      name="baseSalary"
                      type="number"
                      value={formData.baseSalary}
                      onChange={handleInputChange}
                      placeholder="e.g., 150000"
                      min="1"
                      className={`text-base py-3 px-4 ${isFieldError('baseSalary') || (touched.baseSalary && parseInt(formData.baseSalary) <= 0) ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                    />
                    {(isFieldError('baseSalary') || (touched.baseSalary && parseInt(formData.baseSalary) <= 0)) && (
                      <p className="text-red-500 text-xs mt-1">Valid base salary is required</p>
                    )}
                    <p className="text-xs text-slate-400 mt-1">Your annual base pay</p>
                  </div>

                  <div>
                    <label htmlFor="stockOptions" className="block text-sm font-medium text-slate-700 mb-1">
                      Stock/Equity (4-year grant)
                    </label>
                    <Input
                      id="stockOptions"
                      name="stockOptions"
                      type="number"
                      value={formData.stockOptions}
                      onChange={handleInputChange}
                      placeholder="e.g., 400000"
                      min="0"
                      className="text-base py-3 px-4"
                    />
                    <p className="text-xs text-slate-400 mt-1">Total equity grant over 4 years</p>
                  </div>

                  <div>
                    <label htmlFor="bonus" className="block text-sm font-medium text-slate-700 mb-1">
                      Annual Bonus
                    </label>
                    <Input
                      id="bonus"
                      name="bonus"
                      type="number"
                      value={formData.bonus}
                      onChange={handleInputChange}
                      placeholder="e.g., 25000"
                      min="0"
                      className="text-base py-3 px-4"
                    />
                    <p className="text-xs text-slate-400 mt-1">Expected annual bonus</p>
                  </div>

                  <div>
                    <label htmlFor="otherComp" className="block text-sm font-medium text-slate-700 mb-1">
                      Other Compensation
                    </label>
                    <Input
                      id="otherComp"
                      name="otherComp"
                      type="number"
                      value={formData.otherComp}
                      onChange={handleInputChange}
                      placeholder="e.g., 5000"
                      min="0"
                      className="text-base py-3 px-4"
                    />
                    <p className="text-xs text-slate-400 mt-1">Signing bonus, relocation, etc.</p>
                  </div>
                </div>

                <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
                  <p className="text-sm text-slate-700">
                    <span className="font-semibold">Calculated Total Comp:</span>{' '}
                    <span className="text-lg font-bold text-emerald-700">
                      ${calculateTotalComp().toLocaleString()}
                    </span>
                    <span className="text-xs text-slate-500 ml-2">(Base + Equity/4 + Bonus + Other)</span>
                  </p>
                </div>
              </div>

              {/* Additional Info */}
              <div className="space-y-4 pt-4">
                <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-100 pb-2">Additional Information</h3>
                
                <div>
                  <label htmlFor="userNotes" className="block text-sm font-medium text-slate-700 mb-1">
                    Additional Notes
                  </label>
                  <Textarea
                    id="userNotes"
                    name="userNotes"
                    value={formData.userNotes}
                    onChange={handleInputChange}
                    placeholder="Any additional context about your compensation (benefits, unique circumstances, etc.)"
                    rows={4}
                    className="text-base py-3 px-4 bg-white border-slate-300 text-slate-900 placeholder:text-slate-400"
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

              <p className="text-xs text-slate-400 text-center">
                Your submission will be reviewed for quality before being added to our database. 
                All data is anonymized and timestamped.
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
