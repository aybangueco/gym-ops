<script lang="ts">
	import * as Sheet from '$lib/components/ui/sheet';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { Edit } from '@lucide/svelte';
	import { defaults, superForm } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import {
		getMemberships,
		membershipSchema,
		updateMembership,
		type MemberSchema,
		type MembershipSchema
	} from '..';
	import { createMutation, useQueryClient } from '@tanstack/svelte-query';
	import toast from 'svelte-french-toast';

	let {
		membershipID,
		membershipName,
		membershipLength,
		cost
	}: { membershipID: number; membershipName: string; membershipLength: number; cost: number } =
		$props();

	const queryClient = useQueryClient();

	const updateMembershipMutation = createMutation({
		mutationKey: ['update-membership'],
		mutationFn: async ({ id, data }: { id: number; data: MembershipSchema }) => {
			return await updateMembership(id, data);
		},
		onSuccess: () => {
			toast.success('Membership created successfully');
			queryClient.invalidateQueries({ queryKey: ['memberships'] });
		},
		onError: (error) => {
			if (error.message) {
				toast.error(error.message);
			}
		}
	});

	const form = superForm(
		defaults(zod(membershipSchema), {
			defaults: {
				membership_name: membershipName,
				membership_length: membershipLength,
				cost: cost
			},
			id: 'update'
		}),
		{
			SPA: true,
			validators: zod(membershipSchema),
			onUpdate({ form }) {
				if (form.valid) {
					$updateMembershipMutation.mutate({ id: membershipID, data: form.data });
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
				<div class="mb-5 text-center">
					<h1 class="text-3xl font-bold">Add Membership</h1>
				</div>
				<div class="grid grid-cols-2 gap-3">
					<Form.Field {form} name="membership_name">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Membership Name</Form.Label>
								<Input {...props} bind:value={$formData.membership_name} />
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
					<Form.Field {form} name="membership_length">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Membership Length</Form.Label>
								<Input type="number" {...props} bind:value={$formData.membership_length} />
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
					<Form.Field {form} name="cost">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Cost</Form.Label>
								<Input type="number" {...props} bind:value={$formData.cost} />
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
				</div>
				<div class="mt-5">
					<Form.Button type="submit" class="w-full">Update Membership</Form.Button>
				</div>
			</form>
		</Sheet.Header>
	</Sheet.Content>
</Sheet.Root>
