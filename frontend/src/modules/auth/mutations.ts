import { api } from '$lib/api';
import type { AuthResponse } from '$lib/types';
import type { LoginSchema, CodeSchema, RegisterSchema } from './';

export async function login(data: LoginSchema): Promise<AuthResponse> {
	return await api<AuthResponse>({ method: 'POST', url: '/login', data });
}

export async function register(data: RegisterSchema): Promise<AuthResponse> {
	return await api<AuthResponse>({
		method: 'POST',
		url: '/register',
		data: {
			name: data.name,
			email: data.email,
			password: data.password
		}
	});
}

export async function verifyEmail(data: CodeSchema) {
	return await api({
		method: 'POST',
		url: '/verify',
		data: {
			code: Number(data.code)
		}
	});
}

export async function resendOtpCode() {
	return await api({ method: 'POST', url: '/resend-verify' });
}
