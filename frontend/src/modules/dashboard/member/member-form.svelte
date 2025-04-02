<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import * as Select from '$lib/components/ui/select';
	import { Input } from '$lib/components/ui/input';
	import { defaults, superForm } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import { addMember, memberSchema, type Membership } from '..';
	import { createMutation } from '@tanstack/svelte-query';
	import toast from 'svelte-french-toast';

	let { memberships }: { memberships: Array<Membership> } = $props();

	const addMemberMutation = createMutation({
		mutationKey: ['members'],
		mutationFn: addMember,
		onSuccess: () => {
			toast.success('Member created successfully');
		},
		onError: (error) => {
			toast.error(error.message);
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
						<Form.Label>Email</Form.Label>
						<Select.Root type="single" bind:value={$formData.membership} name={props.name}>
							<Select.Trigger {...props}>
								{$formData.membership
									? memberships.find((e) => e.id.toString() === $formData.membership.toString())
											?.membership_name
									: 'Select membership'}
							</Select.Trigger>
							<Select.Content>
								{#each memberships as membership}
									<Select.Item value={`${membership.id}`} label={membership.membership_name} />
								{/each}
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
