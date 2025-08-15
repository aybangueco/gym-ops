import { MemberStatus } from '@/generated/prisma'
import z from 'zod'

export const memberSchema = z.object({
  firstName: z.string().nonempty({ error: 'First name is required' }),
  lastName: z.string().nonempty({ error: 'Last name is required' }),
  email: z.email().nonempty('Email is required'),
  mobileNumber: z.string(),
  memberStatus: z
    .enum(MemberStatus)
    .nonoptional({ error: 'Member status is required' }),
  membershipId: z.string().superRefine((id, ctx) => {
    const numId = id.trim()

    if (Number.isNaN(numId) && numId.length !== 0) {
      ctx.addIssue({
        code: 'custom',
        message: 'Membership id is invalid',
        path: ['cost'],
      })
    }
  }),
})

export type MemberSchema = z.infer<typeof memberSchema>
