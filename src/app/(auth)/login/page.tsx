import { actionGetSession } from '@/modules/auth'
import { LoginForm } from '@/modules/auth/components'
import { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Gym Ops | Sign In',
}

export default async function LoginPage() {
  const session = await actionGetSession()

  if (session) {
    redirect('/dashboard')
  }

  return <LoginForm />
}
