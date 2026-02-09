"use client";

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select } from '@/components/ui/select';
import { DataTable } from '@/components/data-data-table';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { COMPANIES, ROLES, LOCATIONS, LEVELS } from '@/app/lib/data';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SalaryResult {
  company: string;
  role: string;
  location: string;
  level: string;
  medianTotalComp: number;
  blsBenchmark: number;
  count: number;
}

const ITEMS_PER_PAGE_OPTIONS = [10, 25, 50, 100]; // Options for items per page

export default function SalariesPage() {
  const [filters, setFilters] = useState({
    company: '',
    role: '',
    location: '',
    level: '',
  });
  const [results, setResults] = useState<SalaryResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Sorting state
  const [sortConfig, setSortConfig] = useState<{ key: keyof SalaryResult | null, direction: 'ascending' | 'descending' }>({ key: 'medianTotalComp', direction: 'descending' });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE_OPTIONS[0]); // Default to first option

  // Fetch data on filter or itemsPerPage change
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      setCurrentPage(1); // Reset to page 1 when filters or itemsPerPage change
      try {
        const params = new URLSearchParams();
        if (filters.role) params.append('role', filters.role);
        if (filters.location) params.append('location', filters.location);
        if (filters.company) params.append('company', filters.company);
        if (filters.level) params.append('level', filters.level);
        // Note: API currently doesn't support itemsPerPage for fetching, but UI has it.
        // If API Supported: params.append('limit', itemsPerPage.toString());

        const response = await fetch(`/api/salaries?${params.toString()}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: SalaryResult[] = await response.json();
        setResults(data);
      } catch (err) {
        console.error("Failed to fetch salary data:", err);
        setError("Could not load salary data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [filters, itemsPerPage]); // Re-fetch when filters or itemsPerPage change

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(parseInt(e.target.value, 10));
    setCurrentPage(1); // Reset to page 1 when itemsPerPage changes
  };

  const formatCurrency = (n: number) => `$${(n / 1000).toFixed(0)}k`;

  // Sorting logic
  const sortedResults = useMemo(() => {
    const sortableItems = [...results];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        const aValue = a[sortConfig.key!];
        const bValue = b[sortConfig.key!];
        
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

  // Pagination logic
  const totalPages = Math.ceil(sortedResults.length / itemsPerPage);
  const paginatedResults = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedResults.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedResults, currentPage, itemsPerPage]);

  const requestSort = (key: keyof SalaryResult) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
    setCurrentPage(1); // Reset to page 1 when sorting changes
  };

  const goToNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const goToPrevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  // Prepare data for DataTable using paginated results
  const tableData = paginatedResults.map((res, index) => [ // Added index for unique keys if needed inside DataTable rows
    <Link key={`company-${index}`} href={`/company/${encodeURIComponent(res.company)}`} className="text-indigo-400 hover:text-indigo-300 transition-colors">
      {res.company}
    </Link>,
    res.role,
    res.location,
    res.level,
    formatCurrency(res.medianTotalComp),
    formatCurrency(res.blsBenchmark),
    res.count,
  ]);

  // Define table headers with onClick for sorting
  const tableHeaders = [
    { key: 'company', label: "Company", onClick: () => requestSort('company') },
    { key: 'role', label: "Role", onClick: () => requestSort('role') },
    { key: 'location', label: "Location", onClick: () => requestSort('location') },
    { key: 'level', label: "Level", onClick: () => requestSort('level') },
    { key: 'medianTotalComp', label: "Median Total Comp", onClick: () => requestSort('medianTotalComp') },
    { key: 'blsBenchmark', label: "BLS Benchmark", onClick: () => requestSort('blsBenchmark') },
    { key: 'count', label: "Data Points", onClick: () => requestSort('count') },
  ];
  
  // Helper to render sort indicator
  const SortIndicator = ({ columnKey }: { columnKey: keyof SalaryResult }) => {
    if (sortConfig.key !== columnKey) return null;
    return sortConfig.direction === 'ascending' ? ' ↑' : ' ↓';
  };

  return (
    <main className="min-h-screen bg-slate-950">
      <Navigation />
      <div className="px-6 py-12">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tight text-slate-100">Explore Salaries</h1>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              Discover compensation benchmarks across companies, roles, locations, and experience levels.
            </p>
          </div>

          {/* Filter & Sort Section */}
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="text-slate-100">Filter & Sort</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Company</label>
                  <Select value={filters.company} onChange={(e) => handleFilterChange('company', e.target.value)}>
                    <option value="">All Companies</option>
                    {COMPANIES.map(comp => <option key={comp} value={comp}>{comp}</option>)}
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Role</label>
                  <Select value={filters.role} onChange={(e) => handleFilterChange('role', e.target.value)}>
                    <option value="">All Roles</option>
                    {ROLES.map(role => <option key={role} value={role}>{role}</option>)}
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Location</label>
                  <Select value={filters.location} onChange={(e) => handleFilterChange('location', e.target.value)}>
                    <option value="">All Locations</option>
                    {LOCATIONS.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Level</label>
                  <Select value={filters.level} onChange={(e) => handleFilterChange('level', e.target.value)}>
                    <option value="">All Levels</option>
                    {LEVELS.map(lvl => <option key={lvl.value} value={lvl.value}>{lvl.label}</option>)}
                  </Select>
                </div>
              </div>

              {/* Sort Controls - Instruct users to click headers */}
              <div className="flex items-center gap-4 pt-4 border-t border-slate-800">
                <span className="text-sm text-slate-400">Sort by clicking table headers:</span>
              </div>
            </CardContent>
          </Card>

          {/* Results Table & Pagination */}
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-slate-100">Salary Data</CardTitle>
                {!isLoading && !error && (
                  <CardDescription className="text-slate-400">
                    Showing {paginatedResults.length} of {sortedResults.length} results
                  </CardDescription>
                )}
                {isLoading && <CardDescription>Loading data...</CardDescription>}
                {error && <CardDescription className="text-red-400">{error}</CardDescription>}
              </div>
              {/* Items per page selector */}
              <div className="flex items-center gap-2">
                <label htmlFor="items-per-page" className="text-sm text-slate-400 hidden md:inline">Rows per page:</label>
                <Select id="items-per-page" value={itemsPerPage} onChange={handleItemsPerPageChange}>
                  {ITEMS_PER_PAGE_OPTIONS.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              {!isLoading && !error && (
                sortedResults.length > 0 ? (
                  <>
                    {/* Pass headers with onClick for sorting, and render sort indicator */}
                    <DataTable 
                      headers={tableHeaders.map(header => ({
                        label: (
                          <div className="flex items-center cursor-pointer" onClick={header.onClick}>
                            {header.label}
                            {sortConfig.key === header.key && (
                              <SortIndicator columnKey={header.key} />
                            )}
                          </div>
                        ),
                        key: header.key // Ensure DataTable has a way to identify headers, using key
                      }))} 
                      rows={tableData} 
                    />
                    
                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                      <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-800">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={goToPrevPage} 
                          disabled={currentPage === 1}
                          className="flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <ChevronLeft className="w-4 h-4" /> Previous
                        </Button>
                        <div className="flex items-center gap-1 sm:gap-2">
                           <span className="text-sm text-slate-400">Page</span>
                           {/* Render page numbers, perhaps with ellipsis for large numbers */}
                           <Button 
                             variant={currentPage === 1 ? 'default' : 'ghost'} 
                             size="sm" 
                             onClick={() => setCurrentPage(1)}
                             className="px-2.5 py-1.5 h-auto"
                           >1</Button>
                           {currentPage > 2 && <span className="text-sm text-slate-400">...</span>}
                           {currentPage > 1 && currentPage < totalPages && (
                             <Button 
                               variant='default' 
                               size="sm"
                               className="px-2.5 py-1.5 h-auto"
                             >{currentPage}</Button>
                           )}
                           {currentPage < totalPages -1 && <span className="text-sm text-slate-400">...</span>}
                           {totalPages > 1 && (
                              <Button 
                                variant={currentPage === totalPages ? 'default' : 'ghost'} 
                                size="sm" 
                                onClick={() => setCurrentPage(totalPages)}
                                className="px-2.5 py-1.5 h-auto"
                              >{totalPages}</Button>
                           )}
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={goToNextPage} 
                          disabled={currentPage === totalPages}
                          className="flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Next <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-slate-400 text-center py-8">No results found for your selected filters.</p>
                )
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
