<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import * as Select from '$lib/components/ui/select';
	import { Input } from '$lib/components/ui/input';
	import { defaults, superForm } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import { addMember, getMemberships, memberSchema } from '..';
	import { createMutation, createQuery, useQueryClient } from '@tanstack/svelte-query';
	import toast from 'svelte-french-toast';

	const queryClient = useQueryClient();

	const addMemberMutation = createMutation({
		mutationKey: ['addMember'],
		mutationFn: addMember,
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

	const form = superForm(defaults(zod(memberSchema)), {
		SPA: true,
		validators: zod(memberSchema),
		onUpdate({ form }) {
			if (form.valid) {
				$addMemberMutation.mutate(form.data);
			}
		}
	});

	const { form: formData, enhance } = form;
</script>

<form class="w-full" method="POST" use:enhance>
	<div class="mb-5 text-center">
		<h1 class="text-3xl font-bold">Add Member</h1>
	</div>
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
										<Select.Item value={`${membership.id}`} label={membership.membership_name} />
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
		<Form.Button type="submit" class="w-full">Add Member</Form.Button>
	</div>
</form>
