<script lang="ts">
	import * as Sheet from '$lib/components/ui/sheet';
	import * as Form from '$lib/components/ui/form';
	import * as Select from '$lib/components/ui/select';
	import { Input } from '$lib/components/ui/input';
	import { Edit } from '@lucide/svelte';
	import { defaults, superForm } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import { getMemberships, memberSchema, updateMember, type MemberSchema } from '..';
	import { createMutation, createQuery, useQueryClient } from '@tanstack/svelte-query';
	import toast from 'svelte-french-toast';

	let {
		memberId,
		memberName,
		memberContact,
		membership
	}: { memberId: number; memberName: string; memberContact: number; membership: string } = $props();

	const queryClient = useQueryClient();

	const updateMemberMutation = createMutation({
		mutationKey: ['updateMember'],
		mutationFn: async ({ id, data }: { id: number; data: MemberSchema }) => {
			return await updateMember(id, data);
		},
		onSuccess: () => {
			toast.success('Member created successfully');
			queryClient.invalidateQueries({ queryKey: ['members'] });
		},
		onError: (error) => {
			toast.error(error.message);
		}
	});

	const getMembershipsQuery = createQuery({
		queryKey: ['memberships'],
		queryFn: async () => {
			return await getMemberships({ page: 1, limit: 99999 });
		}
	});

	const form = superForm(
		defaults(zod(memberSchema), {
			defaults: {
				member_name: memberName,
				member_contact: Number(memberContact),
				membership: String(membership)
			},
			id: 'update'
		}),
		{
			SPA: true,
			validators: zod(memberSchema),
			onUpdate({ form }) {
				if (form.valid) {
					$updateMemberMutation.mutate({ id: memberId, data: form.data });
				}
			}
		}
	);

	const { form: formData, enhance } = form;
</script>

<Sheet.Root>
	<Sheet.Trigger>
		<Edit />
	</Sheet.Trigger>
	<Sheet.Content>
		<Sheet.Header>
			<Sheet.Title>Edit member</Sheet.Title>
			<Sheet.Description>Press update member to save changes.</Sheet.Description>
			<form class="w-full" method="POST" use:enhance>
				<div class="flex flex-col gap-3">
					<Form.Field {form} name="member_name">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Member Name</Form.Label>
								<Input {...props} bind:value={$formData.member_name} />
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
					<div class="grid grid-cols-2 gap-3">
						<Form.Field {form} name="member_contact">
							<Form.Control>
								{#snippet children({ props })}
									<Form.Label>Member Contact</Form.Label>
									<Input type="number" {...props} bind:value={$formData.member_contact} />
								{/snippet}
							</Form.Control>
							<Form.FieldErrors />
						</Form.Field>
						<Form.Field {form} name="membership">
							<Form.Control>
								{#snippet children({ props })}
									<Form.Label>Membership</Form.Label>
									<Select.Root type="single" bind:value={$formData.membership} name={props.name}>
										<Select.Trigger {...props}>
											{#if $formData.membership === '0'}
												Inactive
											{:else if $formData.membership}
												{$getMembershipsQuery.data?.memberships.find(
													(e) => e.id.toString() === $formData.membership
												)?.membership_name}
											{:else}
												Select membership
											{/if}
										</Select.Trigger>
										<Select.Content>
											{#if $getMembershipsQuery.isLoading}
												<Select.Item value="" label="Loading" />
											{/if}
											{#if $getMembershipsQuery.isSuccess}
												{#each $getMembershipsQuery.data.memberships as membership}
													<Select.Item
														value={`${membership.id}`}
														label={membership.membership_name}
													/>
												{/each}
											{/if}
											<Select.Item value={'0'} label={'Inactive'} />
										</Select.Content>
									</Select.Root>
								{/snippet}
							</Form.Control>
							<Form.FieldErrors />
						</Form.Field>
					</div>
				</div>
				<div class="mt-5">
					<Form.Button type="submit" class="w-full">Update Member</Form.Button>
				</div>
			</form>
		</Sheet.Header>
	</Sheet.Content>
</Sheet.Root>
