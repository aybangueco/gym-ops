<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { defaults, setError, superForm } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import { register, registerSchema, setToken, type RegisterSchema } from '../';
	import { Button } from '$lib/components/ui/button';
	import { goto } from '$app/navigation';
	import toast from 'svelte-french-toast';
	import type { ApiErrorResponse } from '$lib/types';
	import { createMutation } from '@tanstack/svelte-query';

	const registerMutation = createMutation({
		mutationKey: ['register'],
		mutationFn: register,
		onSuccess: (data) => {
			toast.success('Registered successfully');
			setToken(data.token);
			goto('/dashboard');
		},
		onError: (error: ApiErrorResponse) => {
			if (error.message) {
				toast.error(error.message);
			}
		}
	});

	const form = superForm(defaults(zod(registerSchema)), {
		SPA: true,
		validators: zod(registerSchema),
		async onUpdate({ form }) {
			if (form.valid) {
				try {
					return await $registerMutation.mutateAsync({
						name: form.data.name,
						email: form.data.email,
						password: form.data.password
					});
				} catch (error) {
					const apiError = error as ApiErrorResponse;

					if (apiError.field_errors) {
						form.errors = {
							email: apiError.field_errors.email ? [`${apiError.field_errors.email}`] : undefined
						};

						setError(form, '');
						return;
					}
				}
			}
		}
	});

	const { form: formData, enhance } = form;
</script>

<form class="w-full max-w-md rounded-lg border p-3" method="POST" use:enhance>
	<div class="mb-5 text-center">
		<h1 class="text-3xl font-bold">Register</h1>
		<p>Create your account to get started</p>
	</div>
	<div>
		<Form.Field {form} name="name">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Name</Form.Label>
					<Input {...props} bind:value={$formData.name} />
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
		<Form.Field {form} name="email">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Email</Form.Label>
					<Input type="email" {...props} bind:value={$formData.email} />
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
		<Form.Field {form} name="password">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Password</Form.Label>
					<Input type="password" {...props} bind:value={$formData.password} />
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
		<Form.Field {form} name="confirmPassword">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Confirm Password</Form.Label>
					<Input type="password" {...props} bind:value={$formData.confirmPassword} />
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
	</div>
	<div class="mt-10">
		<Form.Button type="submit" class="w-full">Register</Form.Button>
		<Button variant="link" onclick={() => goto('/login')} type="button" class="mt-3 w-full"
			>Already Have Account?</Button
		>
	</div>
</form>
