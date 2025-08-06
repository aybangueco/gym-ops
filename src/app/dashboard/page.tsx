import { getSession } from '@/modules/auth'
import { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Gym Ops | Dashboard'
}

export default async function DashboardPage() {
  const session = await getSession()

  if (!session) {
    redirect('/login')
  }

  return <>p</>
}
