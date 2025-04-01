import { getToken, removeToken } from '@modules/auth';
import type { LayoutLoad } from './$types';
import { getAuthenticated } from '@modules/auth/queries';
import type { ApiErrorResponse } from '$lib/types';
import { goto } from '$app/navigation';

export const ssr = false;

export const load: LayoutLoad = async ({ depends }) => {
	depends('auth:me');
	const token = getToken();

	if (!token) {
		return;
	}

	try {
		const user = await getAuthenticated();
		return { user };
	} catch (error: unknown) {
		const apiError = error as ApiErrorResponse;

		if (apiError.status === 401) {
			removeToken();
			goto('/login');
			return;
		}
	}
};
