import { api } from '$lib/api';
import type { MemberSchema, MembershipSchema } from './schemas';

export async function addMembership(data: MembershipSchema) {
	return await api({ method: 'POST', url: '/memberships', data });
}

export async function addMember(data: MemberSchema) {
	return await api({
		method: 'POST',
		url: '/members',
		data: {
			member_name: data.member_name,
			member_contact: data.member_contact.toString(),
			membership: Number(data.membership)
		}
	});
}
