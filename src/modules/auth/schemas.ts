import z from 'zod'

export const signInSchema = z.object({
  email: z.email().nonempty({ error: 'Email is required' }),
  password: z.string().nonempty({ error: 'Password is required' }),
})

export type SignInSchema = z.infer<typeof signInSchema>

export const signUpSchema = z
  .object({
    name: z
      .string()
      .nonempty({ error: 'Name is required' })
      .min(10, { error: 'Name too short' })
      .max(30, { error: 'Name too long' }),
    email: z.email().nonempty({ error: 'Email is required' }),
    password: z
      .string()
      .nonempty({ error: 'Password is required' })
      .min(8, { error: 'Password too short' })
      .max(50, { error: 'Password too long' }),
    confirmPassword: z
      .string()
      .nonempty({ error: 'Confirm password is required' }),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: 'custom',
        message: 'Passwords do not match',
        path: ['confirmPassword'],
      })
    }
  })

export type SignUpSchema = z.infer<typeof signUpSchema>
