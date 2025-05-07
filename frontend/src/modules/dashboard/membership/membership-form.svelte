<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { defaults, superForm } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import { membershipSchema, addMembership } from '..';
	import { createMutation, useQueryClient } from '@tanstack/svelte-query';
	import toast from 'svelte-french-toast';

	const queryClient = useQueryClient();

	const addMembershipMutation = createMutation({
		mutationKey: ['memberships'],
		mutationFn: addMembership,
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

	const form = superForm(defaults(zod(membershipSchema)), {
		SPA: true,
		validators: zod(membershipSchema),
		onUpdate({ form }) {
			if (form.valid) {
				$addMembershipMutation.mutate(form.data);
			}
		}
	});

	const { form: formData, enhance } = form;
</script>

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
		<Form.Button type="submit" class="w-full">Add Membership</Form.Button>
	</div>
</form>
