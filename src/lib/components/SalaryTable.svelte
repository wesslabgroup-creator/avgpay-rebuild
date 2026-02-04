<script lang="ts">
	import { onMount } from 'svelte';
	import type { Salary } from '@prisma/client';

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
			salaries = await response.json();
			filteredSalaries = salaries;
		} catch (e: any) {
			error = e.message || 'An unknown error occurred.';
		} finally {
			isLoading = false;
		}
	});

	$: {
		filteredSalaries = salaries
			.filter(s => filterState ? s.locationState.toLowerCase().includes(filterState.toLowerCase()) : true)
			.filter(s => filterSpecialty ? s.specialty.toLowerCase().includes(filterSpecialty.toLowerCase()) : true);
	}
	
	function formatCurrency(value: number | null | undefined) {
		if (value == null) return 'N/A';
		return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
	}
</script>

<div class="bg-white p-8 rounded-lg shadow-md">
	<div class="md:flex justify-between items-center mb-6">
		<h2 class="text-3xl font-bold text-slate-800">Community Salary Data</h2>
		<div class="flex gap-4 mt-4 md:mt-0">
			<input type="text" placeholder="Filter by State (e.g. CA)" bind:value={filterState} class="rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
			<input type="text" placeholder="Filter by Specialty (e.g. ICU)" bind:value={filterSpecialty} class="rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
		</div>
	</div>

	{#if isLoading}
		<p class="text-slate-600 text-center py-12">Loading salary data...</p>
	{:else if error}
		<div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
			<span class="block sm:inline">{error}</span>
		</div>
	{:else if filteredSalaries.length === 0}
		<p class="text-slate-600 text-center py-12">No matching salary data found. Be the first to contribute for your area!</p>
	{:else}
		<div class="overflow-x-auto">
			<table class="w-full text-left table-auto">
				<thead class="bg-slate-50 border-b border-slate-200">
					<tr>
						<th class="px-4 py-3 text-sm font-semibold text-slate-600">Location</th>
						<th class="px-4 py-3 text-sm font-semibold text-slate-600">Specialty</th>
						<th class="px-4 py-3 text-sm font-semibold text-slate-600">Experience</th>
						<th class="px-4 py-3 text-sm font-semibold text-slate-600">Hourly Rate</th>
						<th class="px-4 py-3 text-sm font-semibold text-slate-600">Annual Bonuses</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-slate-200">
					{#each filteredSalaries as salary (salary.id)}
						<tr>
							<td class="px-4 py-3 text-slate-800">{salary.locationCity}, {salary.locationState}</td>
							<td class="px-4 py-3 text-slate-800">{salary.specialty}</td>
							<td class="px-4 py-3 text-slate-800">{salary.yearsExperience} yrs</td>
							<td class="px-4 py-3 text-slate-800 font-semibold">{formatCurrency(salary.payRateHourly)}/hr</td>
							<td class="px-4 py-3 text-slate-800">{formatCurrency(salary.bonusesAnnual)}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</div>
