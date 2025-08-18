import PageLoading from '@/components/reuseables/loading/page-loading'
import { actionGetSession } from '@/modules/auth'
import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'Gym Ops | Dashboard',
}

async function DashboardInner() {
  const session = await actionGetSession()

  if (!session) {
    redirect('/login')
  }

  return <section className="p-3"></section>
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<PageLoading />}>
      <DashboardInner />
    </Suspense>
  )
}
