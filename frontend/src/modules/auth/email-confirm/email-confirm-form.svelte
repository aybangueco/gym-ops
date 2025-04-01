<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import * as InputOTP from '$lib/components/ui/input-otp/index.js';
	import { defaults, setError, superForm } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import { invalidate } from '$app/navigation';
	import toast from 'svelte-french-toast';
	import type { ApiErrorResponse } from '$lib/types';
	import { createMutation } from '@tanstack/svelte-query';
	import { codeSchema, removeToken, resendOtpCode, verifyEmail } from '../';

	const verifyEmailMutation = createMutation({
		mutationFn: verifyEmail,
		onSuccess: () => {
			toast.success('Email verified successfully');
			invalidate('auth:me');
		},
		onError: (error: ApiErrorResponse) => {
			if (error.message) {
				toast.error(error.message);
			}
		}
	});

	const resendOtp = createMutation({
		mutationFn: resendOtpCode,
		onSuccess: () => {
			toast.success('OTP resent successfully');
		},
		onError: (error: ApiErrorResponse) => {
			if (error.message) {
				toast.error(error.message);
			}
		}
	});

	const form = superForm(defaults(zod(codeSchema)), {
		SPA: true,
		validators: zod(codeSchema),
		async onUpdate({ form }) {
			if (form.valid) {
				try {
					return await $verifyEmailMutation.mutateAsync(form.data);
				} catch (error) {
					const apiError = error as ApiErrorResponse;

					if (apiError.field_errors) {
						form.errors = {
							code: apiError.field_errors.code ? [`${apiError.field_errors.code}`] : undefined
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

<form class="w-full max-w-md rounded-lg border p-5" method="POST" use:enhance>
	<div class="mb-5 text-center">
		<h1 class="text-3xl font-bold">Confirm Your Email</h1>
		<p>A 6 digit otp verification code has been sent to your email.</p>
	</div>
	<div class="flex items-center justify-center">
		<Form.Field {form} name="code" class="text-center">
			<Form.Control>
				{#snippet children({ props })}
					<InputOTP.Root maxlength={6} {...props} bind:value={$formData.code}>
						{#snippet children({ cells })}
							<InputOTP.Group>
								{#each cells.slice(0, 3) as cell}
									<InputOTP.Slot {cell} />
								{/each}
							</InputOTP.Group>
							<InputOTP.Separator />
							<InputOTP.Group>
								{#each cells.slice(3, 6) as cell}
									<InputOTP.Slot {cell} />
								{/each}
							</InputOTP.Group>
						{/snippet}
					</InputOTP.Root>
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
	</div>
	<div class="mt-5 text-center">
		<Form.Button type="submit" class="w-full">Submit</Form.Button>
		<Form.Button onclick={() => $resendOtp.mutate()} type="button" class="mt-5 w-full"
			>Resend code</Form.Button
		>
		<Form.Button
			onclick={() => {
				removeToken();
				invalidate('auth:me');
			}}
			variant="link"
			type="button"
			class="mt-5 w-full">Logout</Form.Button
		>
	</div>
</form>
