<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { defaults, superForm } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import { loginSchema } from '../';
	import { Button } from '$lib/components/ui/button';
	import { goto } from '$app/navigation';

	const form = superForm(defaults(zod(loginSchema)), {
		SPA: true,
		validators: zod(loginSchema)
	});

	const { form: formData, enhance } = form;
</script>

<form class="w-full max-w-md rounded-lg border p-3" method="POST" use:enhance>
	<div class="mb-5 text-center">
		<h1 class="text-3xl font-bold">Login</h1>
		<p>Login now to start managing your gym business</p>
	</div>
	<div>
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
	</div>
	<div class="mt-10">
		<Form.Button type="submit" class="w-full">Login</Form.Button>
		<Button variant="link" onclick={() => goto('/register')} type="button" class="mt-3 w-full"
			>Don&apos;t have account yet?</Button
		>
	</div>
</form>
