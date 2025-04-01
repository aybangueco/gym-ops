import { z } from 'zod';

export const registerSchema = z
	.object({
		name: z
			.string({ message: 'Enter your name' })
			.min(5, { message: 'Names must be greater than 5 characters' })
			.max(100, { message: 'Name too long' }),

		email: z.string().email({ message: 'Invalid email format' }),

		password: z.string().min(8, { message: 'Password must be greater than 8 characters' }),

		confirmPassword: z.string()
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ['confirmPassword']
	});

export type RegisterSchema = Omit<z.infer<typeof registerSchema>, 'confirmPassword'>;

export const loginSchema = z.object({
	email: z.string().email({ message: 'Invalid email format' }),

	password: z.string().min(8, { message: 'Password must be greater than 8 characters' })
});

export type LoginSchema = z.infer<typeof loginSchema>;

export const codeSchema = z.object({
	code: z
		.string()
		.length(6, { message: 'Please enter a 6-digit OTP code' })
		.regex(/^\d+$/, { message: 'OTP must be a numeric value' })
});

export type CodeSchema = z.infer<typeof codeSchema>;
