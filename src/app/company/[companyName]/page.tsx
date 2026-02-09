"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, ExternalLink } from 'lucide-react';
import { MARKET_DATA } from '@/app/lib/data'; // Import shared data source

// Helper to generate company metadata (descriptions/logos) since MARKET_DATA is just numbers
const COMPANY_METADATA: Record<string, { description: string; website: string; logoUrl?: string }> = {
  "Google": {
    description: "A multinational technology company that specializes in Internet-related services and products, which include online advertising technologies, a search engine, cloud computing, software, and hardware.",
    website: "https://careers.google.com",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg"
  },
  "Meta": {
    description: "Meta Platforms, Inc. builds technologies that help people connect, find communities, and grow businesses.",
    website: "https://www.metacareers.com",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg"
  },
  "Amazon": {
    description: "Amazon is an American multinational technology company which focuses on e-commerce, cloud computing, digital streaming, and artificial intelligence.",
    website: "https://www.amazon.jobs",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg"
  },
  "Microsoft": {
    description: "Microsoft Corporation is an American multinational technology corporation which produces computer software, consumer electronics, personal computers, and related services.",
    website: "https://careers.microsoft.com",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg"
  },
  "Apple": {
    description: "Apple Inc. is an American multinational technology company that specializes in consumer electronics, software and online services.",
    website: "https://www.apple.com/careers",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg"
  },
  "Netflix": {
    description: "Netflix is an American subscription video on-demand over-the-top streaming service and production company.",
    website: "https://jobs.netflix.com",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg"
  },
  "Nvidia": {
    description: "Nvidia Corporation is an American multinational technology company incorporated in Delaware and based in Santa Clara, California.",
    website: "https://www.nvidia.com/en-us/about-nvidia/careers/",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/2/21/Nvidia_logo.svg"
  }
};

interface SalaryDisplayData {
  role: string;
  location: string;
  level: string;
  medianTotalComp: number;
  blsMedian: number;
  count: number;
}

interface CompanyInfo {
  name: string;
  website: string;
  description: string;
  logoUrl?: string;
  salaries?: SalaryDisplayData[];
}

const CompanyDetailPage = () => {
  const params = useParams();
  const companyNameFromUrl = params?.companyName as string || decodeURIComponent(params?.companyName as string); 
  // Handle URL encoding if present (e.g. %20)
  const companyName = decodeURIComponent(companyNameFromUrl);

  const [companyData, setCompanyData] = useState<CompanyInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    
    // Fetch data from our shared MARKET_DATA source
    const fetchCompanyData = () => {
      // 1. Check if company exists in our data
      const rawData = MARKET_DATA[companyName];
      
      if (rawData) {
        // 2. Transform nested MARKET_DATA into flat list for display
        const salaries: SalaryDisplayData[] = [];
        
        // Structure: Company -> Role -> Location -> Level -> Data
        Object.entries(rawData).forEach(([role, locations]) => {
          Object.entries(locations).forEach(([location, levels]) => {
            Object.entries(levels).forEach(([level, data]) => {
              salaries.push({
                role,
                location,
                level,
                medianTotalComp: data.median,
                blsMedian: data.blsMedian,
                count: 10 + Math.floor(Math.random() * 50) // Mock count since simple data structure doesn't store it yet
              });
            });
          });
        });

        // 3. Get Metadata (or fallback)
        const metadata = COMPANY_METADATA[companyName] || {
          description: `${companyName} is a prominent company in the tech industry.`,
          website: "#",
          logoUrl: undefined
        };

        setCompanyData({
          name: companyName,
          ...metadata,
          salaries
        });
        setIsLoading(false);

      } else {
        // Handle case where company name doesn't match
        setError(`Company "${companyName}" not found in our database.`);
        setIsLoading(false);
      }
    };
    
    // Small delay to simulate hydration/fetch
    setTimeout(fetchCompanyData, 100);
  }, [companyName]);

  const formatCurrency = (n: number) => `$${(n / 1000).toFixed(0)}k`;

  if (isLoading) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Card className="bg-white border-slate-200 p-8 w-96 shadow-sm">
            <CardHeader>
              <CardTitle className="text-slate-900 animate-pulse">Loading...</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-slate-500">Fetching details for {companyName}...</CardDescription>
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
          <Card className="bg-white border-slate-200 p-8 w-96 shadow-sm">
            <CardHeader>
              <CardTitle className="text-red-500">Company Not Found</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-slate-500 mb-4">{error}</CardDescription>
              <Button variant="outline" onClick={() => window.history.back()}>
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
          <Card className="bg-white border-slate-200 shadow-sm overflow-hidden">
            <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
            <CardContent className="px-8 pb-8 -mt-12 flex flex-col md:flex-row items-start gap-6">
              <div className="flex-shrink-0 h-24 w-24 md:h-32 md:w-32 rounded-xl overflow-hidden border-4 border-white bg-white shadow-md flex items-center justify-center">
                {companyData.logoUrl ? (
                  <img src={companyData.logoUrl} alt={`${companyData.name} Logo`} className="w-full h-full object-contain p-2"/>
                ) : (
                  <span className="text-3xl font-bold text-slate-300">{companyData.name.substring(0, 1)}</span>
                )}
              </div>
              <div className="mt-12 md:mt-14 w-full">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <CardTitle className="text-4xl font-bold tracking-tight text-slate-900">{companyData.name}</CardTitle>
                    <CardDescription className="text-lg text-slate-600 mt-2 max-w-3xl">{companyData.description}</CardDescription>
                  </div>
                  <Button variant="outline" className="shrink-0" asChild>
                    <a href={companyData.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                      Visit Website <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Salary Data Section */}
          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-slate-900">Salary Insights</CardTitle>
              <CardDescription className="text-slate-500">Compensation data for {companyData.name}.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {companyData.salaries && companyData.salaries.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {companyData.salaries.map((salary, index) => (
                    <Card key={index} className="bg-white border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all duration-200">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-semibold text-slate-900">{salary.role}</CardTitle>
                        <CardDescription className="text-sm text-slate-500 flex flex-col gap-1">
                          <span>{salary.location}</span>
                          <span className="inline-block w-fit text-xs font-medium bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full border border-indigo-100">
                            {salary.level}
                          </span>
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-2">
                        <div className="flex justify-between items-end">
                          <div>
                            <p className="text-2xl font-bold text-slate-900">{formatCurrency(salary.medianTotalComp)}</p>
                            <p className="text-xs text-slate-500">Median Total Comp</p>
                          </div>
                          <div className="text-right">
                             <p className="text-sm font-medium text-slate-600">{formatCurrency(salary.blsMedian)}</p>
                             <p className="text-xs text-slate-400">BLS Benchmark</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 text-center py-12 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                  No detailed salary data available for this company yet.
                </p>
              )}
            </CardContent>
          </Card>
          
          {/* Related Links / Action Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <Button variant="outline" size="lg" className="h-auto py-6 justify-between bg-white hover:bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-700" onClick={() => window.location.href='/salaries'}>
                <span className="flex items-center"><ArrowLeft className="mr-3 h-5 w-5 text-slate-400" /> Back to Salaries</span>
             </Button>
             <Button variant="outline" size="lg" className="h-auto py-6 justify-between bg-white hover:bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-700" onClick={() => window.location.href='/companies'}>
                <span className="flex items-center">View All Companies <ArrowRight className="ml-3 h-5 w-5 text-slate-400" /></span>
             </Button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CompanyDetailPage;
