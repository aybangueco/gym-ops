import PageLoading from '@/components/reuseables/loading/page-loading'
import { DataTable } from '@/components/ui/data-table'
import { actionGetSession } from '@/modules/auth'
import { actionGetMembers } from '@/modules/members'
import { actionGetItemBoughtLogs, actionGetItems } from '@/modules/pos'
import { PosDataProvider } from '@/modules/pos/components'
import PosItemColumns from '@/modules/pos/components/pos-item-columns'
import PosItemForm from '@/modules/pos/components/pos-item-form'
import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'Gym Ops | POS',
}

async function InnerPOS() {
  const session = await actionGetSession()

  if (!session) {
    redirect('/login')
  }

  const items = await actionGetItems()
  const itemBoughtLogs = await actionGetItemBoughtLogs()
  const members = await actionGetMembers()

  return (
    <div className="p-3">
      <PosDataProvider
        items={items.data ?? []}
        itemBoughtLogs={itemBoughtLogs.data ?? []}
        members={members.data ?? []}
      >
        <header className="flex flex-col items-center justify-center">
          <h1 className="text-4xl font-bold">Point Of Sale</h1>
          <p className="">Manage Gym Items For Sale</p>
        </header>

        <section className="mt-10">
          <PosItemForm action="CREATE" />
        </section>

        <section className="mt-10">
          <DataTable columns={PosItemColumns} data={items.data ?? []} />
        </section>
      </PosDataProvider>
    </div>
  )
}

export default function POSPage() {
  return (
    <Suspense fallback={<PageLoading />}>
      <InnerPOS />
    </Suspense>
  )
}
