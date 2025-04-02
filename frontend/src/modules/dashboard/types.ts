export type Membership = {
	id: number;
	membership_name: string;
	membership_length: number;
	created_by: number;
	version: number;
};

export type MembershipResponse = {
	membership: Membership;
};

export type MembershipsResponse = {
	memberships: Array<Membership>;
};

export type Member = {
	id: number;
	member_name: string;
	member_contact: string;
	membership: number;
	created_by: number;
	membership_start: Date;
	membership_end: Date;
};

export type MemberResponse = {
	member: Member;
};

export type MembersResponse = {
	members: Array<MemberResponse>;
};
