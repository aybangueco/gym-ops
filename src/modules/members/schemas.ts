import { MemberStatus } from '@/generated/prisma'
import z from 'zod'

export const memberSchema = z
  .object({
    firstName: z.string().nonempty({ error: 'First name is required' }),
    lastName: z.string().nonempty({ error: 'Last name is required' }),
    email: z.email().nonempty('Email is required'),
    mobileNumber: z.string(),
    memberStatus: z
      .enum(MemberStatus)
      .nonoptional({ error: 'Member status is required' }),
    membershipId: z.string().superRefine((id, ctx) => {
      const idTrim = id.trim()
      if (idTrim && Number.isNaN(Number(idTrim))) {
        ctx.addIssue({
          code: 'custom',
          message: 'Membership id is invalid',
          path: ['membershipId'],
        })
      }
    }),
  })
  .superRefine((data, ctx) => {
    const membershipId = data.membershipId.trim()
    const isZeroOrEmpty = membershipId === '0' || membershipId === ''

    if (data.memberStatus === 'ACTIVE' && isZeroOrEmpty) {
      ctx.addIssue({
        code: 'custom',
        path: ['memberStatus'],
        message: 'Active member requires a valid membership',
      })
    }

    if (data.memberStatus !== 'ACTIVE' && !isZeroOrEmpty) {
      ctx.addIssue({
        code: 'custom',
        path: ['memberStatus'],
        message: `Non active member must not have membership`,
      })
    }
  })

export type MemberSchema = z.infer<typeof memberSchema>
