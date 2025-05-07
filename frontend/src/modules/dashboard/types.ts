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

export interface Member extends MemberSchema {
	id: number;
	created_by: number;
	membership_start: Date;
	membership_end: Date;
}

export type MemberResponse = {
	member: Member;
};

export type MembersResponse = {
	metadata: Metadata;
	members: Array<Member>;
};
