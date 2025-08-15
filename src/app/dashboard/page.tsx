import { actionGetSession } from '@/modules/auth'
import { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Gym Ops | Dashboard',
}

export default async function DashboardPage() {
  const session = await actionGetSession()

  if (!session) {
    redirect('/login')
  }

  return <section className="p-3"></section>
}
