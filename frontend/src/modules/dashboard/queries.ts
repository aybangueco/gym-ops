import { api } from '$lib/api';
import { type MembershipsResponse, type MembersResponse } from '.';

export async function getMembers() {
	return await api<MembersResponse>({ method: 'GET', url: '/members' });
}

export async function getMemberships() {
	return await api<MembershipsResponse>({ method: 'GET', url: '/memberships' });
}
