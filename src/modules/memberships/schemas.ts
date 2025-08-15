import z from 'zod'

export const membershipSchema = z.object({
  name: z.string().nonempty({ error: 'Membership name is required' }),
  length: z
    .string()
    .nonempty({ error: 'Membership length is required' })
    .superRefine((length, ctx) => {
      const numLength = length.trim()

      if (Number.isNaN(numLength)) {
        ctx.addIssue({
          code: 'custom',
          message: 'Membership length is invalid',
          path: ['length'],
        })
      }
    }),
  cost: z
    .string()
    .nonempty({ error: 'Membership cost is required' })
    .superRefine((length, ctx) => {
      const numLength = length.trim()

      if (Number.isNaN(numLength)) {
        ctx.addIssue({
          code: 'custom',
          message: 'Membership cost is invalid',
          path: ['cost'],
        })
      }
    }),
})

export type MembershipSchema = z.infer<typeof membershipSchema>
