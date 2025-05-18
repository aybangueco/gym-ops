import type { MemberSchema, MembershipSchema } from './schemas';

export type Metadata = {
	count: number;
	page: number;
	per_page: number;
	total_pages: number;
};

export interface Membership extends MembershipSchema {
	id: number;
	created_by: number;
	version: number;
}

export type MembershipResponse = {
	membership: Membership;
};

export type MembershipsResponse = {
	metadata: Metadata;
	memberships: Array<Membership>;
};

export interface Member extends Omit<MemberSchema, 'membership'> {
	id: number;
	created_by: number;
	membership: string | null;
	membership_status: string;
	membership_start: Date | null;
	membership_end: Date | null;
}

export type MemberResponse = {
	member: Member;
};

export type MembersResponse = {
	metadata: Metadata;
	members: Array<Member>;
};

export type MonthIncome = {
	month: Date;
	total_income: number;
};

export type MonthlyIncomesResponse = {
	monthlyIncomes: Array<MonthIncome>;
};
