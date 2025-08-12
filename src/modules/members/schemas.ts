import z from 'zod'

export const memberSchema = z.object({
  name: z.string().nonempty({ message: 'Member name is required' }),
  email: z.email().nonempty({ message: 'Member email is required' }),
  membershipId: z.string().nonempty({ message: 'Membership is required' })
})

export type MemberSchema = z.infer<typeof memberSchema>
