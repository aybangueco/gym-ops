import { api } from '$lib/api';
import {
	type MonthIncome,
	type MonthlyIncomesResponse,
	type MembershipsResponse,
	type MembersResponse,
	type TotalMember,
	type TotalMembersResponse
} from '.';

export async function getIncomesThisMonth() {
	return await api<MonthIncome>({ method: 'GET', url: '/month-incomes' });
}

export async function getAllMonthlyIncomes() {
	return await api<MonthlyIncomesResponse>({ method: 'GET', url: '/monthly-incomes' });
}

export async function getMembers({ page }: { page: number }) {
	return await api<MembersResponse>({ method: 'GET', url: '/members', params: { page } });
}

export async function getTotalMembers() {
	return await api<TotalMembersResponse>({
		method: 'GET',
		url: '/members/total'
	});
}

export async function getExpiredMembers({ page }: { page: number }) {
	return await api<MembersResponse>({
		method: 'GET',
		url: '/members/expired',
		params: { page }
	});
}

export async function getMembershipsTotalMembers() {
	return await api<TotalMember[]>({
		method: 'GET',
		url: '/memberships/member-count'
	});
}

export async function getMemberships({ page, limit }: { page: number; limit?: number }) {
	return await api<MembershipsResponse>({
		method: 'GET',
		url: '/memberships',
		params: { page, limit }
	});
}
