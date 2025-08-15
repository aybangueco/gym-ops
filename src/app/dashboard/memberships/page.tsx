import { actionGetSession } from '@/modules/auth'
import {
  actionGetMemberships,
  MembershipForm,
  MembershipList,
} from '@/modules/memberships'
import { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Gym Ops | Memberships',
}

export default async function MembershipsPage() {
  const session = await actionGetSession()

  if (!session) {
    redirect('/login')
  }

  const memberships = await actionGetMemberships()

  return (
    <div className="p-3">
      <header className="flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold">Manage Memberships</h1>
        <p className="">Manage memberships information</p>
      </header>

      <section className="mt-10">
        <MembershipForm action="CREATE" />
      </section>

      <section className="mt-10">
        <MembershipList memberships={memberships} />
      </section>
    </div>
  )
}
