import { Metadata } from 'next'
import { getSession, RegisterForm } from '@/modules/auth'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Gym Ops | Register'
}

export default async function RegisterPage() {
  const session = await getSession()

  if (session) {
    redirect('/dashboard')
  }

  return <RegisterForm />
}
