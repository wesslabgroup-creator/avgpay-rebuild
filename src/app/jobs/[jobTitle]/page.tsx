"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, MapPin, Building2, Briefcase } from 'lucide-react';
import { DataTable } from '@/components/data-table';
import { COMPANIES, LOCATIONS } from '@/app/lib/data'; // Assuming these are available

// Mock data structure for a job detail page
interface JobDetailData {
  jobTitle: string;
  medianTotalComp: number;
  minComp: number;
  maxComp: number;
  count: number;
  levelsCount: number;
  companyRankings: { company: string; medianComp: number; rank: number }[];
  locationRankings: { location: string; medianComp: number; rank: number }[];
}

export default function JobDetailPage() {
  const router = useRouter();
  const { jobTitle } = router.query; // Get job title from URL

  const [data, setData] = useState<JobDetailData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch job detail data
  useEffect(() => {
    if (!jobTitle) return;

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch aggregated data for the specific job title
        const response = await fetch(`/api/salaries?role=${encodeURIComponent(jobTitle as string)}&view=role_global`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const globalRoleData = await response.json();

        // Assume the first result is the global aggregate if available
        let aggregatedStats = null;
        if (globalRoleData && globalRoleData.length > 0) {
          aggregatedStats = globalRoleData[0]; 
        } else {
          // If no global data, try to fetch location-specific and company-specific data to piece it together
          // This part might need more complex API support or client-side aggregation if API doesn't directly provide it for a single role
          console.warn("No global role data found, attempting fallback (not fully implemented).");
          // Fallback: try to get data for a common location or company if needed
        }
        
        if (!aggregatedStats) {
          throw new Error("Could not retrieve salary data for this job title.");
        }

        // Mock data for rankings - in a real scenario, these would be fetched from separate API endpoints or derived
        // For now, we'll sort the global role data to simulate rankings
        const sortedByCompany = globalRoleData
          .sort((a, b) => b.medianTotalComp - a.medianTotalComp)
          .slice(0, 10) // Top 10 companies
          .map((item, index) => ({
            company: item.groupKey, // Assuming groupKey is company name
            medianComp: item.medianTotalComp,
            rank: index + 1,
          }));

        const sortedByLocation = globalRoleData
          .sort((a, b) => b.medianTotalComp - a.medianTotalComp)
          .slice(0, 10) // Top 10 locations
          .map((item, index) => ({
            location: item.secondaryKey || "Unknown", // Assuming secondaryKey holds location for role_location view
            medianComp: item.medianTotalComp,
            rank: index + 1,
          }));

        setData({
          jobTitle: jobTitle as string,
          medianTotalComp: aggregatedStats.medianTotalComp,
          minComp: aggregatedStats.minComp,
          maxComp: aggregatedStats.maxComp,
          count: aggregatedStats.count,
          levelsCount: aggregatedStats.levelsCount,
          companyRankings: sortedByCompany,
          locationRankings: sortedByLocation,
        });

      } catch (err) {
        console.error("Failed to fetch job data:", err);
        setError("Could not load job details. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [jobTitle]);

  const formatCurrency = (n: number) => `$${(n / 1000).toFixed(0)}k`;

  const companyTableHeaders = [
    { label: "Company", key: "company" },
    { label: "Median Comp", key: "medianComp" },
    { label: "Rank", key: "rank" },
  ];

  const locationTableHeaders = [
    { label: "Location", key: "location" },
    { label: "Median Comp", key: "medianComp" },
    { label: "Rank", key: "rank" },
  ];

  if (isLoading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  if (error) return <div className="flex justify-center items-center min-h-screen text-red-500">Error: {error}</div>;
  if (!data) return <div className="flex justify-center items-center min-h-screen">No data available.</div>;

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-6 py-12 space-y-8">
        <Button variant="ghost" onClick={() => router.back()} className="text-emerald-600 hover:text-emerald-700 -ml-4">
          <ChevronLeft className="w-4 h-4 mr-1" /> Back to Salaries
        </Button>

        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">{data.jobTitle}</h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Understand compensation trends for {data.jobTitle} roles.
          </p>
        </div>

        {/* Summary Stats */}
        <Card className="bg-white border-emerald-500">
          <CardHeader>
            <CardTitle className="text-lg text-slate-900 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-emerald-600" />
              Overall Compensation for {data.jobTitle}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <p className="text-4xl font-bold text-emerald-600">{formatCurrency(data.medianTotalComp)}</p>
                <p className="text-sm font-medium text-slate-500 uppercase mt-1">Median Total Comp</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-semibold text-slate-800">{formatCurrency(data.minComp)}</p>
                <p className="text-sm font-medium text-slate-500 uppercase mt-1">Min Comp</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-semibold text-slate-800">{formatCurrency(data.maxComp)}</p>
                <p className="text-sm font-medium text-slate-500 uppercase mt-1">Max Comp</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-semibold text-slate-800">{data.count.toLocaleString()}</p>
                <p className="text-sm font-medium text-slate-500 uppercase mt-1">Data Points</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rankings Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Company Rankings */}
          <Card className="bg-white border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg text-slate-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-slate-600" />
                Top Companies for {data.jobTitle}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable headers={companyTableHeaders} rows={data.companyRankings.map(r => [r.company, formatCurrency(r.medianComp), r.rank])} />
            </CardContent>
          </Card>

          {/* Location Rankings */}
          <Card className="bg-white border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg text-slate-900 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-slate-600" />
                Top Locations for {data.jobTitle}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable headers={locationTableHeaders} rows={data.locationRankings.map(r => [r.location, formatCurrency(r.medianComp), r.rank])} />
            </CardContent>
          </Card>
        </div>

        {/* Placeholder for More Info / Internal Linking */}
        <Card className="bg-white border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg text-slate-900">More Information</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Example: Links to related jobs or guides */}
              <div className="space-y-2">
                <h3 className="text-md font-semibold text-slate-800">Explore Related Roles:</h3>
                <div className="flex flex-wrap gap-2">
                  {/* Dynamically link to other job titles */}
                  <Button variant="outline" size="sm" className="border-emerald-500 text-emerald-600 hover:bg-emerald-50">
                    <Link href={`/jobs/product-manager`}>Product Manager</Link>
                  </Button>
                  <Button variant="outline" size="sm" className="border-emerald-500 text-emerald-600 hover:bg-emerald-50">
                    <Link href={`/jobs/data-scientist`}>Data Scientist</Link>
                  </Button>
                  {/* Add more related roles */}
                </div>
                <h3 className="text-md font-semibold text-slate-800 mt-4">Relevant Guides:</h3>
                <div className="flex flex-wrap gap-2">
                   <Button variant="outline" size="sm" className="border-emerald-500 text-emerald-600 hover:bg-emerald-50">
                    <Link href={`/guides/negotiation`}>Salary Negotiation Tips</Link>
                  </Button>
                   <Button variant="outline" size="sm" className="border-emerald-500 text-emerald-600 hover:bg-emerald-50">
                    <Link href={`/guides/equity`}> Understanding Stock Options</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
      </div>
    </main>
  );
}
