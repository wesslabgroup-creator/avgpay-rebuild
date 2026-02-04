<script lang="ts">
	import { onMount } from 'svelte';
	import Header from '$lib/components/Header.svelte';
	import Button from '$lib/components/Button.svelte';
	import SalaryForm from '$lib/components/SalaryForm.svelte';
	import SalaryTable from '$lib/components/SalaryTable.svelte';

	let showForm = false;
	let dataUnlocked = false;

	onMount(() => {
		if (localStorage.getItem('avgpay_submitted') === 'true') {
			dataUnlocked = true;
		}
	});

	function handleShowForm() {
		showForm = true;
	}

	function handleUnlockData() {
		localStorage.setItem('avgpay_submitted', 'true');
		dataUnlocked = true;
		showForm = false;
	}
</script>

<div class="bg-slate-50 min-h-screen">
	<Header />

	<main class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
		{#if !dataUnlocked && !showForm}
			<div class="text-center bg-white p-12 rounded-lg shadow-md">
				<h2 class="text-4xl font-extrabold text-slate-800 sm:text-5xl">
					How much are Registered Nurses <span class="text-blue-600">really</span> making?
				</h2>
				<p class="mt-4 text-xl text-slate-600">
					View thousands of real, anonymous salary data points. Add yours to unlock access.
				</p>
				<div class="mt-8 flex justify-center gap-4">
					<Button variant="primary" onClick={handleShowForm}>Anonymously Add My Salary</Button>
				</div>
				<p class="mt-4 text-sm text-slate-500">
					To keep our data fresh and free, we ask for a quick contribution.
				</p>
			</div>
		{/if}

		{#if showForm && !dataUnlocked}
			<SalaryForm on:success={handleUnlockData} />
		{/if}

		{#if dataUnlocked}
			<SalaryTable />
		{/if}
	</main>
</div>
