import { actionGetSession } from '@/modules/auth'
import { RegisterForm } from '@/modules/auth/components'
import { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Gym Ops | Sign Up',
}

export default async function RegisterPage() {
  const session = await actionGetSession()

  if (session) {
    redirect('/dashboard')
  }

  return <RegisterForm />
}
