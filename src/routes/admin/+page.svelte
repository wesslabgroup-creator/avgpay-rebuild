<script lang="ts">
  import { onMount } from 'svelte';
  import type { Metrics } from '@prisma/client';

  let metrics: Metrics[] = [];
  let isLoading = true;
  let error: string | null = null;

  onMount(async () => {
    try {
      const response = await fetch('/api/metrics');
      if (!response.ok) throw new Error('Failed to fetch metrics');
      metrics = await response.json();
    } catch (e: any) {
      error = e.message;
    } finally {
      isLoading = false;
    }
  });

  function formatCurrency(value: number | null | undefined) {
    if (value == null) return 'N/A';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
  }

  function formatDate(date: Date) {
    return new Intl.DateTimeFormat('en-US').format(new Date(date));
  }
</script>

<div class="bg-slate-50 min-h-screen p-8">
  <h1 class="text-4xl font-bold text-slate-800 mb-8">Admin Metrics Dashboard</h1>
  {#if isLoading}
    <p>Loading metrics...</p>
  {:else if error}
    <div class="bg-red-100 p-4 rounded">Error: {error}</div>
  {:else}
    <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-lg font-semibold text-slate-600">Total Revenue (Stripe)</h3>
        {#each metrics.filter(m => m.source === 'Stripe') as m}
          <p>{formatCurrency(m.revenue)}</p>
        {/each}
      </div>
      <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-lg font-semibold text-slate-600">Sessions (GA4)</h3>
        {#each metrics.filter(m => m.source === 'GA4') as m}
          <p>{m.sessions || 0}</p>
        {/each}
      </div>
      <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-lg font-semibold text-slate-600">Builds (Netlify)</h3>
        {#each metrics.filter(m => m.source === 'Netlify') as m}
          <p>{m.builds || 0}</p>
        {/each}
      </div>
      <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-lg font-semibold text-slate-600">Functions Invoked</h3>
        {#each metrics.filter(m => m.source === 'Netlify') as m}
          <p>{m.functionsInvoked || 0}</p>
        {/each}
      </div>
    </div>

    <div class="bg-white rounded-lg shadow overflow-hidden">
      <table class="w-full">
        <thead class="bg-slate-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Date</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Source</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Users New</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Sessions</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Revenue</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Builds</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-200">
          {#each metrics.slice(0, 50) as metric}
            <tr>
              <td class="px-6 py-4">{formatDate(metric.date)}</td>
              <td class="px-6 py-4 font-medium">{metric.source}</td>
              <td class="px-6 py-4">{metric.usersNew || 0}</td>
              <td class="px-6 py-4">{metric.sessions || 0}</td>
              <td class="px-6 py-4">{formatCurrency(metric.revenue)}</td>
              <td class="px-6 py-4">{metric.builds || 0}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</div>
