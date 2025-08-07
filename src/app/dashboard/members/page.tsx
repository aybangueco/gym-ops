import { DataTable } from '@/components/ui/data-table'
import { getSession } from '@/modules/auth'
import { actionGetMembers, MemberColumns } from '@/modules/members'
import MemberForm from '@/modules/members/components/member-form'
import { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Gym Ops | Members'
}

export default async function MembersPage() {
  const session = await getSession()

  if (!session) {
    redirect('/login')
  }

  const members = await actionGetMembers()

  return (
    <section className="p-3">
      <div className="">
        <h1 className="mb-5 text-3xl font-bold">Members Management</h1>
        <MemberForm />
        <DataTable columns={MemberColumns} data={members.data ?? []} />
      </div>
    </section>
  )
}
