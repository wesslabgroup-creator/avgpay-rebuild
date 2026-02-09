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

interface LocationSuggestion {
  name: string;
  state?: string;
}

export default function SubmitSalaryPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    jobTitle: '',
    companyName: '',
    location: '',
    baseSalary: '',
    stockOptions: '',
    bonus: '',
    otherComp: '',
    totalComp: '',
    experienceLevel: '',
    yearsAtCompany: '',
    yearsInIndustry: '',
    userNotes: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [locations, setLocations] = useState<string[]>([]);
  const [locationSuggestions, setLocationSuggestions] = useState<string[]>([]);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch('/api/analyzer-data');
        const data = await response.json();
        if (data.locations) setLocations(data.locations);
      } catch (error) {
        console.error("Failed to fetch locations:", error);
      }
    };
    fetchLocations();
  }, []);

  // Autocomplete location as user types
  useEffect(() => {
    if (formData.location.length < 2) {
      setLocationSuggestions([]);
      return;
    }
    const lowerQuery = formData.location.toLowerCase();
    const suggestions = locations.filter(loc => 
      loc.toLowerCase().includes(lowerQuery)
    ).slice(0, 5);
    setLocationSuggestions(suggestions);
  }, [formData.location, locations]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const calculateTotalComp = () => {
    const base = parseInt(formData.baseSalary || "0");
    const stock = parseInt(formData.stockOptions || "0") / 4; // Annualized
    const bonus = parseInt(formData.bonus || "0");
    const other = parseInt(formData.otherComp || "0");
    return base + stock + bonus + other;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Validation - base salary is required
    if (!formData.baseSalary || parseInt(formData.baseSalary) <= 0) {
      setError("Base salary is required and must be greater than 0.");
      setIsLoading(false);
      return;
    }

    if (!formData.jobTitle || !formData.companyName || !formData.location || !formData.experienceLevel) {
      setError("Please fill in all required fields.");
      setIsLoading(false);
      return;
    }

    const totalComp = calculateTotalComp();

    try {
      const response = await fetch('/api/submit-salary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          totalComp: totalComp.toString(),
          submittedAt: new Date().toISOString(),
          status: 'pending_review', // For quality checks
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
            <form onSubmit={handleSubmit} className="space-y-6">
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
                      required
                      className="text-base py-3 px-4"
                    />
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
                      required
                      className="text-base py-3 px-4"
                    />
                  </div>
                </div>

                <SearchableSelect
                  label="Experience Level"
                  value={formData.experienceLevel}
                  onChange={(value) => setFormData(prev => ({ ...prev, experienceLevel: value }))}
                  options={EXPERIENCE_LEVELS.map(l => l.label)}
                  placeholder="Select experience level..."
                  required
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <label htmlFor="location" className="block text-sm font-medium text-slate-700 mb-1">
                      Location (City, State) <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="e.g., San Francisco, CA"
                      required
                      className="text-base py-3 px-4"
                    />
                    {locationSuggestions.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg">
                        {locationSuggestions.map((suggestion) => (
                          <button
                            key={suggestion}
                            type="button"
                            onClick={() => {
                              setFormData(prev => ({ ...prev, location: suggestion }));
                              setLocationSuggestions([]);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    )}
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
                      required
                      min="1"
                      className="text-base py-3 px-4"
                    />
                    <p className="text-xs text-slate-400 mt-1">Required - your annual base pay</p>
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
                      placeholder="e.g., 400000 (total over 4 years)"
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
                      placeholder="e.g., 5000 (signing bonus, etc.)"
                      min="0"
                      className="text-base py-3 px-4"
                    />
                    <p className="text-xs text-slate-400 mt-1">Signing bonus, relocation, etc.</p>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-lg">
                  <p className="text-sm text-slate-600">
                    <span className="font-medium">Calculated Total Comp:</span>{' '}
                    <span className="text-lg font-bold text-emerald-600">
                      ${calculateTotalComp().toLocaleString()}
                    </span>
                    <span className="text-xs text-slate-400 ml-2">(Base + Equity/4 + Bonus + Other)</span>
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
                    className="text-base py-3 px-4"
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
