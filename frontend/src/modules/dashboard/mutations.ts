import { api } from '$lib/api';
import type { MemberSchema, MembershipSchema } from './schemas';

export async function addMembership(data: MembershipSchema) {
	return await api({ method: 'POST', url: '/memberships', data });
}

export async function deleteMembership(id: number) {
	return await api({
		method: 'DELETE',
		url: `/memberships/${id}`
	});
}

export async function addMember(data: MemberSchema) {
	return await api({
		method: 'POST',
		url: '/members',
		data: {
			member_name: data.member_name,
			member_contact: data.member_contact.toString(),
			membership: data.membership == '0' ? null : Number(data.membership)
		}
	});
}

export async function deleteMember(id: number) {
	return await api({
		method: 'DELETE',
		url: `/members/${id}`
	});
}
