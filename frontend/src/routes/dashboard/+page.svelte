<script lang="ts">
	import { getIncomesThisMonth } from '@modules/dashboard';
	import { createQuery } from '@tanstack/svelte-query';

	const getThisMonthIncomesQuery = createQuery({
		queryKey: ['month-incomes'],
		queryFn: getIncomesThisMonth
	});
</script>

<div class="grid grid-cols-3 justify-center gap-3">
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
</div>
