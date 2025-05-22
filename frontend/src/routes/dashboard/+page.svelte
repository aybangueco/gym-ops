<script lang="ts">
	import IncomeBarChart from '$lib/components/income-bar-chart.svelte';
	import MembershipsPieChart from '$lib/components/memberships-pie-chart.svelte';
	import {
		getAllMonthlyIncomes,
		getIncomesThisMonth,
		getMemberships,
		getMembershipsTotalMembers,
		getTotalMembers
	} from '@modules/dashboard';
	import { ExpiredMemberTable } from '@modules/dashboard/member';
	import { createQuery } from '@tanstack/svelte-query';

	const getThisMonthIncomesQuery = createQuery({
		queryKey: ['month-incomes'],
		queryFn: getIncomesThisMonth
	});

	const getAllIncomes = createQuery({
		queryKey: ['monthly-incomes'],
		queryFn: getAllMonthlyIncomes
	});

	const getMembershipsQuery = createQuery({
		queryKey: ['memberships'],
		queryFn: async () => {
			return await getMemberships({ page: 1, limit: 99999 });
		}
	});

	const getTotalMembersQuery = createQuery({
		queryKey: ['total-members'],
		queryFn: getTotalMembers
	});

	const getMembershipsTotalMembersQuery = createQuery({
		queryKey: ['memberships-total-members'],
		queryFn: getMembershipsTotalMembers
	});
</script>

<div class="grid grid-cols-2 justify-center gap-3">
	<div class="rounded-md bg-secondary p-5">
		<h1 class="text-2xl font-bold">Total Members</h1>
		{#if $getTotalMembersQuery.isPending}
			<p>Loading...</p>
		{:else if $getTotalMembersQuery.isError}
			<p>Error</p>
		{:else}
			<p>{$getTotalMembersQuery.data.total_members}</p>
		{/if}
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
	{#if $getMembershipsQuery.isPending && $getMembershipsTotalMembersQuery.isPending}
		<p>Loading...</p>
	{:else if $getMembershipsQuery.isError && $getMembershipsTotalMembersQuery.isError}
		<p>Error</p>
	{:else if $getMembershipsQuery.data && $getMembershipsTotalMembersQuery.data}
		<MembershipsPieChart
			barTitle="Most members of memberships"
			chartData={$getMembershipsTotalMembersQuery.data}
			memberships={$getMembershipsQuery.data.memberships}
		/>
	{/if}
	<div class="col-span-2">
		<ExpiredMemberTable />
	</div>
</div>
