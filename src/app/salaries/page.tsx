"use client";

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select } from '@/components/ui/select';
import { DataTable } from '@/components/data-table';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { COMPANIES, ROLES, LOCATIONS } from '@/app/lib/data';
import { Building2, Briefcase, MapPin } from 'lucide-react';

type ViewType = 'company' | 'role_location' | 'role_global';

interface AggregatedResult {
  groupKey: string;
  secondaryKey?: string;
  medianTotalComp: number;
  minComp: number;
  maxComp: number;
  count: number;
  levelsCount: number;
}

export default function SalariesPage() {
  const [view, setView] = useState<ViewType>('role_global');
  const [filters, setFilters] = useState({
    company: '',
    role: '',
    location: '',
  });
  const [results, setResults] = useState<AggregatedResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Sorting state
  const [sortConfig, setSortConfig] = useState<{ key: string | null, direction: 'ascending' | 'descending' }>({ key: 'medianTotalComp', direction: 'descending' });

  // Fetch aggregated data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        params.append('view', view);
        if (filters.role) params.append('role', filters.role);
        if (filters.location) params.append('location', filters.location);
        if (filters.company) params.append('company', filters.company);

        const response = await fetch(`/api/salaries?${params.toString()}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: AggregatedResult[] = await response.json();
        setResults(data);
      } catch (err) {
        console.error("Failed to fetch salary data:", err);
        setError("Could not load salary data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [view, filters]);

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const formatCurrency = (n: number) => `$${(n / 1000).toFixed(0)}k`;

  // Sorting logic
  const sortedResults = useMemo(() => {
    const sortableItems = [...results];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        const aValue = a[sortConfig.key as keyof AggregatedResult];
        const bValue = b[sortConfig.key as keyof AggregatedResult];
        
        if (aValue === undefined || bValue === undefined) return 0;

        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortConfig.direction === 'ascending' ? aValue - bValue : bValue - aValue;
        } else if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortConfig.direction === 'ascending' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        }
        return 0;
      });
    }
    return sortableItems;
  }, [results, sortConfig]);

  const requestSort = (key: string) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Get view-specific labels and table setup
  const getViewConfig = () => {
    switch (view) {
      case 'company':
        return {
          title: "Salaries by Company",
          description: "Aggregated compensation data for major tech companies.",
          primaryLabel: "Company",
          showSecondary: false
        };
      case 'role_location':
        return {
          title: "Salaries by Role & Location",
          description: "Compensation benchmarks for specific roles in specific cities.",
          primaryLabel: "Job Title",
          showSecondary: true,
          secondaryLabel: "Location"
        };
      case 'role_global':
      default:
        return {
          title: "Salaries by Job Title",
          description: "National average compensation by role across all companies and locations.",
          primaryLabel: "Job Title",
          showSecondary: false
        };
    }
  };

  const viewConfig = getViewConfig();

  // Prepare table headers
  const tableHeaders = [
    { label: viewConfig.primaryLabel, key: "groupKey" },
    ...(viewConfig.showSecondary ? [{ label: viewConfig.secondaryLabel || "Location", key: "secondaryKey" }] : []),
    { label: "Comp Range", key: "range" },
    { label: "Median Comp", key: "medianTotalComp" },
    { label: "Data Points", key: "count" }
  ];

  // Prepare table rows
  const tableRows = sortedResults.map((res, index) => {
    let primaryCell;
    if (view === 'company') {
      primaryCell = (
        <Link key={`link-${index}`} href={`/company/${encodeURIComponent(res.groupKey)}`} className="text-emerald-600 hover:text-emerald-500 font-medium transition-colors">
          {res.groupKey}
        </Link>
      );
    } else { // 'role_global' or 'role_location'
      primaryCell = (
        <Link key={`link-${index}`} href={`/jobs/${encodeURIComponent(res.groupKey)}`} className="text-emerald-600 hover:text-emerald-500 font-medium transition-colors">
          {res.groupKey}
        </Link>
      );
    }

    const row = [
      primaryCell,
      ...(viewConfig.showSecondary ? [res.secondaryKey || "—"] : []),
      `${formatCurrency(res.minComp)} – ${formatCurrency(res.maxComp)}`,
      <span key={`median-${index}`} className="font-semibold text-emerald-700">{formatCurrency(res.medianTotalComp)}</span>,
      res.count.toLocaleString()
    ];
    return row;
  });

  return (
    <main className="min-h-screen bg-white">
      <div className="px-6 py-12">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tight text-slate-900">Explore Salaries</h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Aggregated compensation benchmarks. All data is anonymized and rolled up by median.
            </p>
          </div>

          {/* View Selector Tabs */}
          <div className="flex flex-wrap justify-center gap-2">
            <Button
              variant={view === 'company' ? 'default' : 'outline'}
              onClick={() => setView('company')}
              className={view === 'company' ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'text-slate-700 border-slate-300'}
            >
              <Building2 className="w-4 h-4 mr-2" />
              By Company
            </Button>
            <Button
              variant={view === 'role_global' ? 'default' : 'outline'}
              onClick={() => setView('role_global')}
              className={view === 'role_global' ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'text-slate-700 border-slate-300'}
            >
              <Briefcase className="w-4 h-4 mr-2" />
              By Job Title
            </Button>
            <Button
              variant={view === 'role_location' ? 'default' : 'outline'}
              onClick={() => setView('role_location')}
              className={view === 'role_location' ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'text-slate-700 border-slate-300'}
            >
              <MapPin className="w-4 h-4 mr-2" />
              By Job + Location
            </Button>
          </div>

          {/* Filters (conditional based on view) */}
          <Card className="bg-white border-slate-200">
            <CardHeader>
              <CardTitle className="text-slate-900">Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {view !== 'company' && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Job Title</label>
                    <Select value={filters.role} onChange={(e) => handleFilterChange('role', e.target.value)}>
                      <option value="">All Roles</option>
                      {ROLES.map(role => <option key={role} value={role}>{role}</option>)}
                    </Select>
                  </div>
                )}
                {view === 'role_location' && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                    <Select value={filters.location} onChange={(e) => handleFilterChange('location', e.target.value)}>
                      <option value="">All Locations</option>
                      {LOCATIONS.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                    </Select>
                  </div>
                )}
                {view === 'company' && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Company</label>
                    <Select value={filters.company} onChange={(e) => handleFilterChange('company', e.target.value)}>
                      <option value="">All Companies</option>
                      {COMPANIES.map(comp => <option key={comp} value={comp}>{comp}</option>)}
                    </Select>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Results Table */}
          <Card className="bg-white border-slate-200">
            <CardHeader>
              <CardTitle className="text-slate-900">{viewConfig.title}</CardTitle>
              <CardDescription className="text-slate-500">{viewConfig.description}</CardDescription>
              {!isLoading && !error && (
                <CardDescription className="text-slate-600 mt-1">
                  Showing {sortedResults.length} aggregated results
                </CardDescription>
              )}
              {isLoading && <CardDescription>Loading data...</CardDescription>}
              {error && <CardDescription className="text-red-500">{error}</CardDescription>}
            </CardHeader>
            <CardContent>
              {!isLoading && !error && sortedResults.length > 0 ? (
                <DataTable 
                  headers={tableHeaders.map(header => ({
                    label: (
                      <div className="flex items-center cursor-pointer select-none" onClick={() => requestSort(header.key)}>
                        {header.label}
                        {sortConfig.key === header.key && (
                          <span className="ml-1">{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
                        )}
                      </div>
                    ),
                    key: header.key
                  }))} 
                  rows={tableRows} 
                />
              ) : !isLoading && !error ? (
                <p className="text-slate-500 text-center py-8">No results found for your filters.</p>
              ) : null}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
