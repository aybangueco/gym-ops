<script lang="ts">
	import IncomeBarChart from '$lib/components/income-bar-chart.svelte';
	import { getAllMonthlyIncomes, getIncomesThisMonth } from '@modules/dashboard';
	import { createQuery } from '@tanstack/svelte-query';

	const getThisMonthIncomesQuery = createQuery({
		queryKey: ['month-incomes'],
		queryFn: getIncomesThisMonth
	});

	const getAllIncomes = createQuery({
		queryKey: ['monthly-incomes'],
		queryFn: getAllMonthlyIncomes
	});
</script>

<div class="grid grid-cols-2 justify-center gap-3">
	<div class="rounded-md bg-secondary p-5">
		<h1 class="text-2xl font-bold">Active Members</h1>
		<p>30</p>
	</div>
	<div class="rounded-md bg-secondary p-5">
		<h1 class="text-2xl font-bold">Total Income This Month</h1>
		{#if $getThisMonthIncomesQuery.isPending}
			<p>Loading...</p>
		{:else if $getThisMonthIncomesQuery.isError}
			<p>Error</p>
		{:else}
			<p>{$getThisMonthIncomesQuery.data.total_income}</p>
		{/if}
	</div>
	{#if $getAllIncomes.isPending}
		<p>Loading...</p>
	{:else if $getAllIncomes.isError}
		<p>Error</p>
	{:else}
		<IncomeBarChart barTitle="Monthly Incomes" chartData={$getAllIncomes.data.monthlyIncomes} />
	{/if}
</div>
