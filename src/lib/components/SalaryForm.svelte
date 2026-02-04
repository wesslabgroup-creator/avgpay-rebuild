<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Button from '$lib/components/Button.svelte';
	import { salarySchema } from '$lib/schema';
	import type { z } from 'zod';

	const dispatch = createEventDispatcher();

	let formData = {
		locationState: 'CA',
		locationCity: '',
		specialty: 'ICU',
		yearsExperience: 0,
		payRateHourly: 50,
		overtimeRateHourly: undefined,
		stipendWeekly: undefined,
		bonusesAnnual: undefined,
	};

	let errors: z.ZodFormattedError<typeof formData> | null = null;
	let formError: string | null = null;
	let isLoading = false;

	async function handleSubmit() {
		isLoading = true;
		errors = null;
		formError = null;

		const result = salarySchema.safeParse(formData);

		if (!result.success) {
			errors = result.error.format();
			isLoading = false;
			return;
		}

		const response = await fetch('/api/salaries', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(result.data),
		});

		if (response.ok) {
			dispatch('success');
		} else {
			const { error } = await response.json();
			formError = error || 'An unexpected error occurred. Please try again.';
		}

		isLoading = false;
	}

  const states = ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"];
  const specialties = ["ICU", "ER", "Med-Surg", "OR", "L&D", "Pediatrics", "PACU", "NICU", "Telemetry", "Oncology", "Other"];

</script>

<div class="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto">
	<h2 class="text-3xl font-bold mb-6 text-slate-800 text-center">Add Your Anonymous Salary</h2>
	<p class="text-center text-slate-600 mb-8">
		Help the community by sharing your compensation. All submissions are anonymous.
	</p>
	<form on:submit|preventDefault={handleSubmit} class="grid grid-cols-1 md:grid-cols-2 gap-6">
		
		<div>
			<label for="locationCity" class="block text-sm font-medium text-slate-700">City</label>
			<input type="text" id="locationCity" bind:value={formData.locationCity} class="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
			{#if errors?.locationCity}
				<p class="text-sm text-red-600 mt-1">{errors.locationCity._errors[0]}</p>
			{/if}
		</div>
		
		<div>
			<label for="locationState" class="block text-sm font-medium text-slate-700">State</label>
			<select id="locationState" bind:value={formData.locationState} class="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
				{#each states as state}
					<option value={state}>{state}</option>
				{/each}
			</select>
		</div>

		<div>
			<label for="specialty" class="block text-sm font-medium text-slate-700">Specialty</label>
			<select id="specialty" bind:value={formData.specialty} class="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
				{#each specialties as specialty}
					<option value={specialty}>{specialty}</option>
				{/each}
			</select>
		</div>

		<div>
			<label for="yearsExperience" class="block text-sm font-medium text-slate-700">Years of Experience</label>
			<input type="number" id="yearsExperience" bind:value={formData.yearsExperience} class="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
			{#if errors?.yearsExperience}
				<p class="text-sm text-red-600 mt-1">{errors.yearsExperience._errors[0]}</p>
			{/if}
		</div>

		<div class="md:col-span-2">
			<label for="payRateHourly" class="block text-sm font-medium text-slate-700">Standard Hourly Rate ($)</label>
			<input type="number" step="0.01" id="payRateHourly" bind:value={formData.payRateHourly} class="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
			{#if errors?.payRateHourly}
				<p class="text-sm text-red-600 mt-1">{errors.payRateHourly._errors[0]}</p>
			{/if}
		</div>

		<h3 class="md:col-span-2 text-lg font-semibold text-slate-700 mt-4 border-t pt-4">Optional</h3>

		<div>
			<label for="overtimeRateHourly" class="block text-sm font-medium text-slate-700">Overtime Rate ($/hr)</label>
			<input type="number" step="0.01" id="overtimeRateHourly" bind:value={formData.overtimeRateHourly} class="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
		</div>
		
		<div>
			<label for="stipendWeekly" class="block text-sm font-medium text-slate-700">Weekly Stipend ($)</label>
			<input type="number" step="0.01" id="stipendWeekly" bind:value={formData.stipendWeekly} class="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
		</div>
		
		<div class="md:col-span-2">
			<label for="bonusesAnnual" class="block text-sm font-medium text-slate-700">Annual Bonuses ($)</label>
			<input type="number" step="100" id="bonusesAnnual" bind:value={formData.bonusesAnnual} class="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
		</div>

		<div class="md:col-span-2 mt-6">
			{#if formError}
				<div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
					<span class="block sm:inline">{formError}</span>
				</div>
			{/if}
			<Button type="submit" variant="primary" disabled={isLoading}>
				{isLoading ? 'Submitting...' : 'Submit & Unlock Data'}
			</Button>
		</div>
	</form>
</div>
