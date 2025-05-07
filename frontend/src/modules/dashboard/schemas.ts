import { z } from 'zod';

export const memberSchema = z.object({
	member_name: z
		.string()
		.min(5, { message: 'Member name too short' })
		.max(30, { message: 'Member name too long' }),
	member_contact: z
		.number()
		.min(1, { message: 'Member contact too short' })
		.max(999999999999999, { message: 'Member contact too long' }),
	membership: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
		message: 'Please select a valid membership'
	})
});

export type MemberSchema = z.infer<typeof memberSchema>;

export const membershipSchema = z.object({
	membership_name: z
		.string()
		.min(5, { message: 'Membership name too short' })
		.max(30, { message: 'Membership name too long' }),
	membership_length: z
		.number()
		.min(1, { message: 'Membership length too short' })
		.max(99999, { message: 'Membership length too long' }),
	cost: z.number().min(1, { message: 'Cost too short' })
});

export type MembershipSchema = z.infer<typeof membershipSchema>;
