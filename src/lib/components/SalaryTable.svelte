<script lang="ts">
	import { onMount } from 'svelte';
	
    interface Salary {
        id: string;
        locationCity: string;
        locationState: string;
        specialty: string;
        yearsExperience: number;
        payRateHourly: number;
        bonusesAnnual?: number | null;
    }

	let salaries: Salary[] = [];
	let filteredSalaries: Salary[] = [];
	let isLoading = true;
	let error: string | null = null;
	
	let filterState = '';
	let filterSpecialty = '';

	onMount(async () => {
		try {
			const response = await fetch('/api/salaries');
			if (!response.ok) {
				throw new Error('Failed to fetch salary data.');
			}
			const data = await response.json();
            salaries = data;
			filteredSalaries = data;
		} catch (e: any) {
			console.warn('Using mock data due to API error:', e);
            // Mock data for demo purposes
            salaries = [
                { id: '1', locationCity: 'San Francisco', locationState: 'CA', specialty: 'ICU', yearsExperience: 5, payRateHourly: 85.50, bonusesAnnual: 5000 },
                { id: '2', locationCity: 'Houston', locationState: 'TX', specialty: 'Med-Surg', yearsExperience: 2, payRateHourly: 38.00, bonusesAnnual: 1000 },
                { id: '3', locationCity: 'New York', locationState: 'NY', specialty: 'ER', yearsExperience: 8, payRateHourly: 72.00, bonusesAnnual: 3000 },
                { id: '4', locationCity: 'Miami', locationState: 'FL', specialty: 'L&D', yearsExperience: 4, payRateHourly: 42.50, bonusesAnnual: 1500 },
                { id: '5', locationCity: 'Los Angeles', locationState: 'CA', specialty: 'Pediatrics', yearsExperience: 6, payRateHourly: 68.00, bonusesAnnual: 2500 },
                { id: '6', locationCity: 'Seattle', locationState: 'WA', specialty: 'ICU', yearsExperience: 3, payRateHourly: 55.00, bonusesAnnual: 2000 },
            ];
            filteredSalaries = salaries;
		} finally {
			isLoading = false;
		}
	});

	function filterData() {
		filteredSalaries = salaries.filter(s => {
			const stateMatch = filterState ? s.locationState.toLowerCase().includes(filterState.toLowerCase()) : true;
			const specialtyMatch = filterSpecialty ? s.specialty.toLowerCase().includes(filterSpecialty.toLowerCase()) : true;
			return stateMatch && specialtyMatch;
		});
	}

	$: filterState, filterSpecialty, filterData();
	
	function formatCurrency(value: number | null | undefined) {
		if (value == null) return 'N/A';
		return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
	}
</script>

<div class="bg-white p-6 rounded-lg shadow-md border border-slate-200">
	<div class="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
		<h2 class="text-2xl font-bold text-slate-800">Community Salary Data</h2>
		<div class="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
			<input 
                type="text" 
                placeholder="Filter by State (e.g. CA)" 
                bind:value={filterState} 
                class="rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 text-sm w-full" 
            />
			<input 
                type="text" 
                placeholder="Filter by Specialty" 
                bind:value={filterSpecialty} 
                class="rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 text-sm w-full" 
            />
		</div>
	</div>

	{#if isLoading}
		<div class="text-center py-12">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
            <p class="text-slate-500 mt-2 text-sm">Loading data...</p>
        </div>
	{:else if error}
		<div class="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm text-center" role="alert">
			{error}
		</div>
	{:else if filteredSalaries.length === 0}
		<div class="text-center py-12 bg-slate-50 rounded-md border border-dashed border-slate-300">
            <p class="text-slate-500">No matching salary data found.</p>
        </div>
	{:else}
		<div class="overflow-x-auto border rounded-md border-slate-200">
			<table class="w-full text-left border-collapse">
				<thead class="bg-slate-50 text-slate-600">
					<tr>
						<th class="px-4 py-3 text-xs font-semibold uppercase tracking-wider border-b border-slate-200">Location</th>
						<th class="px-4 py-3 text-xs font-semibold uppercase tracking-wider border-b border-slate-200">Specialty</th>
						<th class="px-4 py-3 text-xs font-semibold uppercase tracking-wider border-b border-slate-200">Exp.</th>
						<th class="px-4 py-3 text-xs font-semibold uppercase tracking-wider border-b border-slate-200 text-right">Hourly Rate</th>
						<th class="px-4 py-3 text-xs font-semibold uppercase tracking-wider border-b border-slate-200 text-right">Annual Bonus</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-slate-200 bg-white">
					{#each filteredSalaries as salary (salary.id)}
						<tr class="hover:bg-slate-50 transition-colors">
							<td class="px-4 py-3 text-sm text-slate-700">{salary.locationCity}, {salary.locationState}</td>
							<td class="px-4 py-3 text-sm text-slate-700">{salary.specialty}</td>
							<td class="px-4 py-3 text-sm text-slate-700">{salary.yearsExperience} yrs</td>
							<td class="px-4 py-3 text-sm font-medium text-slate-900 text-right">{formatCurrency(salary.payRateHourly)}/hr</td>
							<td class="px-4 py-3 text-sm text-slate-500 text-right">{salary.bonusesAnnual ? formatCurrency(salary.bonusesAnnual) : '-'}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
        <p class="text-xs text-slate-400 mt-2 text-right">Showing latest {filteredSalaries.length} submissions</p>
	{/if}
</div>
