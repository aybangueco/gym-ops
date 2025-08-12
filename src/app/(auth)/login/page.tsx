import { Metadata } from 'next'
import { getSession, LoginForm } from '@/modules/auth'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Gym Ops | Login'
}

export default async function LoginPage() {
  const session = await getSession()

  if (session) {
    redirect('/dashboard')
  }

  return <LoginForm />
}
