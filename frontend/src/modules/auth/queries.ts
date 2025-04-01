import { api } from '$lib/api';
import { type AuthenticatedResponse } from '$lib/types';

export async function getAuthenticated() {
	return (await api<AuthenticatedResponse>({ method: 'GET', url: '/auth/me' })).user;
}
