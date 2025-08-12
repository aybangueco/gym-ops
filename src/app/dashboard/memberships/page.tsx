import { DataTable } from '@/components/ui/data-table'
import { getSession } from '@/modules/auth'
import {
  actionGetMemberships,
  MembershipColumns,
  MembershipForm
} from '@/modules/memberships'

import { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Gym Ops | Memberships'
}

export default async function MembershipsPage() {
  const session = await getSession()

  if (!session) {
    redirect('/login')
  }

  const memberships = await actionGetMemberships()

  return (
    <section className="p-3">
      <div>
        <h1 className="mb-5 text-3xl font-bold">Memberships Management</h1>
        <MembershipForm state="CREATE" />
        <DataTable columns={MembershipColumns} data={memberships.data ?? []} />
      </div>
    </section>
  )
}
