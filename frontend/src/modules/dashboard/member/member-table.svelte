<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import * as Pagination from '$lib/components/ui/pagination';
	import { Eye, Trash } from '@lucide/svelte';
	import { deleteMember, getMembers, getMemberships } from '..';
	import { createMutation, createQuery, useQueryClient } from '@tanstack/svelte-query';
	import toast from 'svelte-french-toast';

	let page = $state(1);

	const queryClient = useQueryClient();

	const getMembersQuery = createQuery({
		queryKey: ['members', page],
		queryFn: async () => {
			return await getMembers({ page });
		}
	});

	const getMembershipsQuery = createQuery({
		queryKey: ['memberships'],
		queryFn: async () => {
			return await getMemberships({ page: 1, limit: 99999 });
		}
	});

	const deleteMemberMutation = createMutation({
		mutationKey: ['deleteMember'],
		mutationFn: deleteMember,
		onSuccess: () => {
			toast.success('Member deleted successfully');
			queryClient.invalidateQueries({ queryKey: ['members'] });
		},
		onError: (error) => {
			toast.error(error.message);
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
				<Table.Head>Member Name</Table.Head>
				<Table.Head>Member Contact</Table.Head>
				<Table.Head>Membership</Table.Head>
				<Table.Head>Membership Start</Table.Head>
				<Table.Head>Membership End</Table.Head>
				<Table.Head>Actions</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#if $getMembersQuery.isPending}
				<h1>Loading</h1>
			{/if}
			{#if $getMembersQuery.isError}
				<h1>Error occured</h1>
			{/if}
			{#if $getMembersQuery.isSuccess}
				{#each $getMembersQuery.data.members as member}
					<Table.Row>
						<Table.Cell>{member.id}</Table.Cell>
						<Table.Cell>{member.member_name}</Table.Cell>
						<Table.Cell>{member.member_contact}</Table.Cell>
						{#if $getMembershipsQuery.isSuccess}
							<Table.Cell
								>{$getMembershipsQuery.data?.memberships.find((e) => e.id === member.membership)
									?.membership_name}</Table.Cell
							>
						{/if}
						<Table.Cell>{new Date(member.membership_start).toISOString().split('T')[0]}</Table.Cell>
						<Table.Cell>{new Date(member.membership_end).toISOString().split('T')[0]}</Table.Cell>
						<Table.Cell class="flex gap-3">
							<Eye class="cursor-pointer hover:text-muted-foreground" />
							<Trash
								onclick={() => {
									$deleteMemberMutation.mutate(member.id);
								}}
								class="cursor-pointer hover:text-destructive"
							/>
						</Table.Cell>
					</Table.Row>
				{/each}
				{#if $getMembersQuery.data.members.length < 1}
					<Table.Row>
						<Table.Cell colspan={7} class="w-full text-center">Empty members list</Table.Cell>
					</Table.Row>
				{/if}
			{/if}
		</Table.Body>
	</Table.Root>
	<Pagination.Root
		class="p-3"
		count={$getMembersQuery.data?.metadata.count ?? 0}
		perPage={$getMembersQuery.data?.metadata.per_page}
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
