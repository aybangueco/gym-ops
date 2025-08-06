import { authClient } from '@/lib/auth-client'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'
import toast from 'react-hot-toast'

export async function signInUser({
  email,
  password
}: {
  email: string
  password: string
}) {
  return await authClient.signIn.email(
    {
      email,
      password,
      callbackURL: '/dashboard'
    },
    {
      onSuccess: () => {
        toast.success('Logged in successfully')
      },
      onError: (ctx) => {
        toast.error(ctx.error.message)
      }
    }
  )
}

export async function signUpUser({
  name,
  email,
  password
}: {
  name: string
  email: string
  password: string
}) {
  return await authClient.signUp.email(
    {
      name,
      email,
      password
    },
    {
      onSuccess: () => {
        toast.success('Registered successfully')
        window.location.href = '/login'
      },
      onError: (ctx) => {
        toast.error(ctx.error.message)
      }
    }
  )
}

export async function signOutUser(router: AppRouterInstance) {
  return await authClient.signOut({
    fetchOptions: {
      onSuccess: () => {
        router.push('/login')
      }
    }
  })
}
