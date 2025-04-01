import { api } from '$lib/api';
import type { AuthResponse } from '$lib/types';
import type { LoginSchema, RegisterSchema } from './';

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
