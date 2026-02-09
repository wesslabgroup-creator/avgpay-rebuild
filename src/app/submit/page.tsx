"use client";

import { useState } from 'react';
import { useRouter } from 'next/router';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ROLES, COMPANIES, LOCATIONS, LEVELS } from '@/app/lib/data'; // Assuming these are available from lib/data

export default function SubmitSalaryPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    jobTitle: '',
    companyName: '',
    location: '',
    baseSalary: '',
    totalComp: '',
    level: '',
    userNotes: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Basic validation
    if (!formData.jobTitle || !formData.companyName || !formData.totalComp || !formData.location || !formData.level) {
      setError("Please fill in all required fields.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/submit-salary', { // API endpoint to handle submission
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      // On success, redirect to a confirmation page or back to salaries
      router.push('/salaries'); // Or a dedicated success page
    } catch (err: any) {
      console.error("Failed to submit salary:", err);
      setError(err.message || "Failed to submit salary. Please try again.");
      setIsLoading(false);
    }
  };

  const formatCurrencyInput = (value: string): string => {
    // Remove non-digit characters
    const numericValue = value.replace(/\D/g, '');
    // Format with commas, but keep it as a string for the input
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: formatCurrencyInput(value)
    }));
  };

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center space-y-4 mb-10">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">Share Your Salary</h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Help us build a more transparent compensation landscape. Your data is anonymized.
          </p>
        </div>

        <Card className="bg-white border-slate-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-slate-900 text-2xl">Salary Submission Form</CardTitle>
            <CardDescription className="text-slate-500">Fields marked with * are required.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Job Title */}
              <div>
                <label htmlFor="jobTitle" className="block text-sm font-medium text-slate-700 mb-1">Job Title *</label>
                <Input
                  id="jobTitle"
                  name="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleInputChange}
                  placeholder="e.g., Software Engineer, Product Manager"
                  required
                  className="text-base py-3 px-4"
                />
              </div>

              {/* Company Name */}
              <div>
                <label htmlFor="companyName" className="block text-sm font-medium text-slate-700 mb-1">Company Name *</label>
                <Input
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  placeholder="e.g., Google, Meta"
                  required
                  className="text-base py-3 px-4"
                />
              </div>

              {/* Location */}
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-slate-700 mb-1">Location *</label>
                <Select onValueChange={(value) => handleSelectChange('location', value)} name="location" defaultValue={formData.location}>
                  <SelectTrigger className="w-full text-base py-3 px-4 h-auto">
                    <SelectValue placeholder="Select Location" />
                  </SelectTrigger>
                  <SelectContent>
                    {LOCATIONS.map(loc => (
                      <SelectItem key={loc} value={loc} className="text-base py-2 px-3">
                        {loc}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Experience Level */}
              <div>
                <label htmlFor="level" className="block text-sm font-medium text-slate-700 mb-1">Experience Level *</label>
                <Select onValueChange={(value) => handleSelectChange('level', value)} name="level" defaultValue={formData.level}>
                  <SelectTrigger className="w-full text-base py-3 px-4 h-auto">
                    <SelectValue placeholder="Select Level" />
                  </SelectTrigger>
                  <SelectContent>
                    {LEVELS.map(lvl => (
                      <SelectItem key={lvl.value} value={lvl.label} className="text-base py-2 px-3">
                        {lvl.label} {/* Assuming LEVELS has {value: string, label: string} */}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Base Salary (Optional) */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="baseSalary" className="block text-sm font-medium text-slate-700 mb-1">Base Salary (Optional)</label>
                  <Input
                    id="baseSalary"
                    name="baseSalary"
                    value={formData.baseSalary}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    placeholder="e.g., 120,000"
                    className="text-base py-3 px-4"
                  />
                </div>
                {/* Total Compensation */}
                <div>
                  <label htmlFor="totalComp" className="block text-sm font-medium text-slate-700 mb-1">Total Compensation *</label>
                  <Input
                    id="totalComp"
                    name="totalComp"
                    value={formData.totalComp}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    placeholder="e.g., 155,000"
                    required
                    className="text-base py-3 px-4"
                  />
                </div>
              </div>

              {/* User Notes (Optional) */}
              <div>
                <label htmlFor="userNotes" className="block text-sm font-medium text-slate-700 mb-1">Additional Notes (Optional)</label>
                <Textarea
                  id="userNotes"
                  name="userNotes"
                  value={formData.userNotes}
                  onChange={handleInputChange}
                  placeholder="e.g., Includes stock options, bonus structure, etc."
                  rows={4}
                  className="text-base py-3 px-4"
                />
              </div>

              {error && (
                <div className="text-red-500 text-center p-3 bg-red-50 border border-red-200 rounded">
                  {error}
                </div>
              )}

              <div className="text-center pt-4">
                <Button
                  type="submit"
                  size="lg"
                  className="w-full max-w-xs bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-6 text-lg"
                  disabled={isLoading}
                >
                  {isLoading ? 'Submitting...' : 'Submit Salary'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
