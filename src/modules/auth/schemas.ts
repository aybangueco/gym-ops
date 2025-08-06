import z from 'zod'

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(5, { message: 'Name too short' })
      .max(50, { message: 'Name too long' }),
    email: z.email().nonempty({ message: 'Email is required' }),
    password: z.string().nonempty({ message: 'Password is required' }),
    confirmPassword: z
      .string()
      .nonempty({ message: 'Confirm password is required' })
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: 'custom',
        message: 'The passwords do not match',
        path: ['confirmPassword']
      })
    }
  })

export type RegisterSchema = z.infer<typeof registerSchema>

export const loginSchema = z.object({
  email: z.email().nonempty({ message: 'Email is required' }),
  password: z.string().nonempty({ message: 'Password is required' })
})

export type LoginSchema = z.infer<typeof loginSchema>
