import { DataTable } from '@/components/ui/data-table'
import {
  actionGetMembers,
  MemberColumns,
  MemberDataProvider,
  MemberForm,
} from '@/modules/members'
import { actionGetMemberships } from '@/modules/memberships'

export default async function MembersPage() {
  const memberships = await actionGetMemberships()
  const members = await actionGetMembers()

  return (
    <div className="p-3">
      <MemberDataProvider memberships={memberships.data}>
        <header className="flex flex-col items-center justify-center">
          <h1 className="text-4xl font-bold">Manage Members</h1>
          <p className="">Manage members information</p>
        </header>

        <section className="mt-10">
          <MemberForm action="CREATE" />
        </section>

        <section className="mt-10">
          <DataTable columns={MemberColumns} data={members.data ?? []} />
        </section>
      </MemberDataProvider>
    </div>
  )
}
