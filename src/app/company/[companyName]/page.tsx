"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, ExternalLink } from 'lucide-react'; // Ensure ExternalLink is imported

// Mock data for company-specific details and salaries
// In a real app, this would come from an API or a more sophisticated data source.
// This mock data aims to be more realistic and varied for demonstration.
const MOCK_COMPANY_DATA: Record<string, CompanyInfo> = {
  "Acme Corp": {
    name: "Acme Corp",
    website: "https://acme.example.com",
    description: "A leading innovator in widget manufacturing, providing cutting-edge solutions for a global market. Known for its robust engineering culture and competitive compensation.",
    logoUrl: "/logos/acme-corp.png", // Placeholder logo path
    salaries: [
      { role: "Software Engineer", location: "San Francisco, CA", level: "Staff+ (L7+)", medianTotalComp: 320000, blsBenchmark: 290000, count: 150 },
      { role: "Software Engineer", location: "San Francisco, CA", level: "Senior (L5-L6)", medianTotalComp: 240000, blsBenchmark: 210000, count: 200 },
      { role: "Software Engineer", location: "New York, NY", level: "Mid (L3-L4)", medianTotalComp: 180000, blsBenchmark: 160000, count: 180 },
      { role: "Product Manager", location: "San Francisco, CA", level: "Senior (L5-L6)", medianTotalComp: 230000, blsBenchmark: 210000, count: 80 },
      { role: "Data Scientist", location: "Remote", level: "Staff+ (L7+)", medianTotalComp: 290000, blsBenchmark: 270000, count: 50 },
      { role: "UX Designer", location: "New York, NY", level: "Senior (L5-L6)", medianTotalComp: 190000, blsBenchmark: 185000, count: 65 },
    ],
  },
  "Beta Inc": {
    name: "Beta Inc",
    website: "https://beta.example.com",
    description: "Beta Inc is at the forefront of sustainable technology, driving change through research and development. Focuses on AI for environmental solutions.",
    logoUrl: "/logos/beta-inc.png",
    salaries: [
      { role: "Software Engineer", location: "Seattle, WA", level: "Senior (L5-L6)", medianTotalComp: 230000, blsBenchmark: 205000, count: 120 },
      { role: "UX Designer", location: "Remote", level: "Mid (L3-L4)", medianTotalComp: 150000, blsBenchmark: 140000, count: 60 },
      { role: "Product Manager", location: "Seattle, WA", level: "Staff+ (L7+)", medianTotalComp: 250000, blsBenchmark: 230000, count: 40 },
      { role: "AI Researcher", location: "Remote", level: "Staff+ (L7+)", medianTotalComp: 310000, blsBenchmark: 290000, count: 30 },
    ],
  },
  "Gamma Solutions": {
    name: "Gamma Solutions",
    website: "https://gamma.example.com",
    description: "Providing intelligent automation solutions for enterprise businesses. Specializes in workflow optimization and AI-driven process management.",
    logoUrl: "/logos/gamma-solutions.png",
    salaries: [
      { role: "Software Engineer", location: "Austin, TX", level: "Mid (L3-L4)", medianTotalComp: 160000, blsBenchmark: 150000, count: 100 },
      { role: "Data Scientist", location: "Remote", level: "Senior (L5-L6)", medianTotalComp: 200000, blsBenchmark: 190000, count: 70 },
      { role: "Software Engineer", location: "Austin, TX", level: "Junior (L1-L2)", medianTotalComp: 120000, blsBenchmark: 110000, count: 90 },
      { role: "DevOps Engineer", location: "Remote", level: "Senior (L5-L6)", medianTotalComp: 190000, blsBenchmark: 180000, count: 55 },
    ],
  },
};

interface SalaryData {
  role: string;
  location: string;
  level: string;
  medianTotalComp: number;
  blsBenchmark: number;
  count: number;
}

interface CompanyInfo {
  name: string;
  website: string;
  description: string;
  logoUrl?: string;
  salaries?: SalaryData[];
}

const CompanyDetailPage = () => {
  const params = useParams();
  // Dynamic route parameter extraction
  const companyNameFromUrl = params?.companyName as string || decodeURIComponent(params?.companyName as string); 

  const [companyData, setCompanyData] = useState<CompanyInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    
    // Simulate fetching data for a specific company
    const fetchCompanyData = () => {
      const data = MOCK_COMPANY_DATA[companyNameFromUrl];
      if (data) {
        // Simulate API delay
        setTimeout(() => {
          setCompanyData(data);
          setIsLoading(false);
        }, 500); 
      } else {
        // Handle case where company name from URL doesn't match mock data
        setError(`Company "${companyNameFromUrl}" not found.`);
        setIsLoading(false);
      }
    };
    
    fetchCompanyData();
  }, [companyNameFromUrl]);

  const formatCurrency = (n: number) => `$${(n / 1000).toFixed(0)}k`;

  if (isLoading) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Card className="bg-white border-slate-200 p-8 w-96">
            <CardHeader>
              <CardTitle className="text-slate-900 animate-pulse">Loading Company Data...</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-slate-600">Please wait while we fetch details for {companyNameFromUrl}.</CardDescription>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  if (error || !companyData) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Card className="bg-white border-slate-200 p-8 w-96">
            <CardHeader>
              <CardTitle className="text-red-500">Error Loading Company</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-red-400">{error || `Could not find data for ${companyNameFromUrl}.`}</CardDescription>
              <Button variant="outline" className="mt-4" onClick={() => window.history.back()}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="px-6 py-12">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Company Header */}
          <Card className="bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 border-0">
            <CardContent className="p-6 flex flex-col md:flex-row items-center gap-6">
              {companyData.logoUrl && (
                <div className="flex-shrink-0 h-24 w-24 md:h-32 md:w-32 rounded-xl overflow-hidden border-2 border-slate-700 bg-white p-2">
                  <img src={companyData.logoUrl} alt={`${companyData.name} Logo`} className="w-full h-full object-contain"/>
                </div>
              )}
              <div className="text-center md:text-left w-full">
                <CardTitle className="text-4xl font-bold tracking-tight text-slate-900">{companyData.name}</CardTitle>
                <CardDescription className="text-xl text-slate-600 mt-2 max-w-3xl mx-auto md:mx-0">{companyData.description}</CardDescription>
                <div className="mt-4 flex justify-center md:justify-start">
                  <Button variant="outline" size="lg">
                    <a href={companyData.website} target="_blank" rel="noopener noreferrer" className="flex items-center">
                      Visit Website <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Salary Data Section */}
          <Card className="bg-white border-slate-200">
            <CardHeader>
              <CardTitle className="text-slate-900">Salary Insights</CardTitle>
              <CardDescription className="text-slate-600">Compensation data for {companyData.name}.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {companyData.salaries && companyData.salaries.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {companyData.salaries.map((salary, index) => (
                    <Card key={index} className="bg-slate-800/70 border-slate-700 hover:shadow-lg transition-shadow duration-200">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-semibold text-slate-900">{salary.role}</CardTitle>
                        <CardDescription className="text-sm text-slate-600 flex items-center justify-between">
                          {salary.location}
                          <span className="text-xs font-medium bg-blue-900/50 text-blue-300 px-2 py-0.5 rounded-md">
                            {salary.level}
                          </span>
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-2xl font-bold text-slate-900">{formatCurrency(salary.medianTotalComp)} <span className="text-base font-normal text-slate-300">(Median Total Comp)</span></p>
                        <p className="text-sm text-slate-600 mt-1">vs. {formatCurrency(salary.blsBenchmark)} BLS Benchmark</p>
                        <p className="text-xs text-slate-500 mt-2">Based on {salary.count} data points.</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-slate-600 text-center py-8">No detailed salary data available for this company.</p>
              )}
            </CardContent>
          </Card>
          
          {/* Related Links / Action Section */}
          <Card className="bg-white border-slate-200">
            <CardHeader>
              <CardTitle className="text-slate-900">More Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" size="lg" className="group" onClick={() => window.location.href='/salaries'}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Salary Explorer
                </Button>
                <Button variant="outline" size="lg" className="group" onClick={() => window.location.href='/companies'}>
                  All Companies <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
};

export default CompanyDetailPage;
