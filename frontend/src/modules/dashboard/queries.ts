import { api } from '$lib/api';
import { type MembershipsResponse, type MembersResponse } from '.';

export async function getMembers({ page }: { page: number }) {
	return await api<MembersResponse>({ method: 'GET', url: '/members', params: { page } });
}

export async function getMemberships({ page, limit }: { page: number; limit?: number }) {
	return await api<MembershipsResponse>({
		method: 'GET',
		url: '/memberships',
		params: { page, limit }
	});
}
