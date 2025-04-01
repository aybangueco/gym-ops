import { goto } from '$app/navigation';
import toast from 'svelte-french-toast';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ parent }) => {
	const { user } = await parent();

	if (!user) {
		goto('/login');
		return;
	}

	if (!user.activated) {
		toast.error('Please activate your email to continue');
		goto('/u/email-confirmation');
		return;
	}
};
