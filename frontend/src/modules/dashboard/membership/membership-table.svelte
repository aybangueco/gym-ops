<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import * as Pagination from '$lib/components/ui/pagination';
	import { createMutation, createQuery, useQueryClient } from '@tanstack/svelte-query';
	import { getMemberships } from '../queries';
	import { deleteMembership } from '../mutations';
	import toast from 'svelte-french-toast';
	import { Eye, Trash } from '@lucide/svelte';

	let page = $state(1);

	const queryClient = useQueryClient();

	const getMembershipsQuery = createQuery({
		queryKey: ['memberships', page],
		queryFn: async () => {
			return await getMemberships({ page });
		}
	});

	const deleteMembershipMutation = createMutation({
		mutationKey: ['deleteMember'],
		mutationFn: deleteMembership,
		onSuccess: () => {
			toast.success('Membership deleted successfully');
			queryClient.invalidateQueries({ queryKey: ['memberships'] });
		}
	});

	const handlePageChange = (newPage: number) => {
		page = newPage;
		queryClient.invalidateQueries({ queryKey: ['members'] });
	};
</script>

<div class="mt-10">
	<h1 class="text-center text-3xl font-bold">Members list</h1>
	<Table.Root class="mt-3 border">
		<Table.Header>
			<Table.Row>
				<Table.Head>ID</Table.Head>
				<Table.Head>Membership Name</Table.Head>
				<Table.Head>Membership Length</Table.Head>
				<Table.Head>Actions</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#if $getMembershipsQuery.isPending}
				<h1>Loading</h1>
			{/if}
			{#if $getMembershipsQuery.isError}
				<h1>Error occured</h1>
			{/if}
			{#if $getMembershipsQuery.isSuccess}
				{#each $getMembershipsQuery.data.memberships as membership}
					<Table.Row>
						<Table.Cell>{membership.id}</Table.Cell>
						<Table.Cell>{membership.membership_name}</Table.Cell>
						<Table.Cell>{membership.membership_length}</Table.Cell>
						<Table.Cell class="flex gap-3">
							<Eye class="cursor-pointer hover:text-muted-foreground" />
							<Trash
								onclick={() => {
									$deleteMembershipMutation.mutate(membership.id);
								}}
								class="cursor-pointer hover:text-destructive"
							/>
						</Table.Cell>
					</Table.Row>
				{/each}
				{#if $getMembershipsQuery.data.memberships.length < 1}
					<Table.Row>
						<Table.Cell colspan={7} class="w-full text-center">Empty members list</Table.Cell>
					</Table.Row>
				{/if}
			{/if}
		</Table.Body>
	</Table.Root>
	<Pagination.Root
		class="p-3"
		count={$getMembershipsQuery.data?.metadata.count ?? 0}
		perPage={$getMembershipsQuery.data?.metadata.per_page}
		{page}
		onPageChange={handlePageChange}
	>
		{#snippet children({ pages, currentPage })}
			<Pagination.Content>
				<Pagination.Item>
					<Pagination.PrevButton />
				</Pagination.Item>
				{#each pages as page (page.key)}
					{#if page.type === 'ellipsis'}
						<Pagination.Item>
							<Pagination.Ellipsis />
						</Pagination.Item>
					{:else}
						<Pagination.Item>
							<Pagination.Link {page} isActive={currentPage === page.value}>
								{page.value}
							</Pagination.Link>
						</Pagination.Item>
					{/if}
				{/each}
				<Pagination.Item>
					<Pagination.NextButton />
				</Pagination.Item>
			</Pagination.Content>
		{/snippet}
	</Pagination.Root>
</div>
