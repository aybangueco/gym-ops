import z from 'zod'

export const membershipSchema = z.object({
  name: z.string().nonempty({ message: 'Membership name is required' }),
  length: z.string().nonempty({ message: 'Membership length is required' }),
  price: z.string().nonempty({ message: 'Membership price is required' })
})

export type MembershipSchema = z.infer<typeof membershipSchema>
