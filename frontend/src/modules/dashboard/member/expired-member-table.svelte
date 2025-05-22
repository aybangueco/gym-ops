<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import * as Pagination from '$lib/components/ui/pagination';
	import { Trash } from '@lucide/svelte';
	import { deleteMember, getExpiredMembers, getMemberships } from '..';
	import { createMutation, createQuery, useQueryClient } from '@tanstack/svelte-query';
	import toast from 'svelte-french-toast';
	import { EditMemberForm } from '.';

	let page = $state(1);

	const queryClient = useQueryClient();

	const getMembersQuery = createQuery({
		queryKey: ['expired-members', () => page],
		queryFn: async () => {
			return await getExpiredMembers({ page });
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
	<h1 class="text-center text-3xl font-bold">Expired Members list</h1>
	<Table.Root class="mt-3 border">
		<Table.Header>
			<Table.Row>
				<Table.Head>ID</Table.Head>
				<Table.Head>Member Name</Table.Head>
				<Table.Head>Member Contact</Table.Head>
				<Table.Head>Membership</Table.Head>
				<Table.Head>Membership Status</Table.Head>
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
								>{$getMembershipsQuery.data?.memberships.find(
									(e) => e.id === Number(member.membership)
								)?.membership_name ?? 'N/A'}</Table.Cell
							>
						{/if}
						<Table.Cell>{member.membership_status}</Table.Cell>
						<Table.Cell>
							{member.membership_start
								? new Date(member.membership_start).toISOString().split('T')[0]
								: 'N/A'}
						</Table.Cell>
						<Table.Cell>
							{member.membership_end
								? new Date(member.membership_end).toISOString().split('T')[0]
								: 'N/A'}
						</Table.Cell>
						<Table.Cell class="flex gap-3">
							<EditMemberForm
								memberId={member.id}
								memberName={member.member_name}
								memberContact={member.member_contact}
								membership={member.membership ?? '0'}
							/>
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
						<Table.Cell colspan={8} class="w-full text-center">Empty members list</Table.Cell>
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
