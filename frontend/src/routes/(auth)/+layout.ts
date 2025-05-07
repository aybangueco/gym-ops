import { goto } from '$app/navigation';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ parent }) => {
	const { user } = await parent();

	if (!user) {
		return;
	}

	if (user && user.activated) {
		goto('/dashboard');
		return;
	} else {
		goto('/u/email-confirmation');
		return;
	}
};
