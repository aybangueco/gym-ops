import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import PageLoading from '@/components/reuseables/loading/page-loading'
import { DataTable } from '@/components/ui/data-table'
import { actionGetSession } from '@/modules/auth'
import { actionGetMembers } from '@/modules/members'
import {
  actionGetItemBoughtLogs,
  actionGetItems,
  PosDataProvider,
  PosItemBoughtColumns,
  PosItemColumns,
  PosItemForm,
  PosSelectMemberForm,
} from '@/modules/pos'
import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import { Button } from '@/components/ui/button'

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

        <section className="mt-20">
          <h1 className="text-center text-3xl font-bold">
            Track Members Who Bought Items
          </h1>

          <div className="mt-10 flex flex-col gap-3">
            <Dialog>
              <DialogTrigger asChild>
                <Button>Add Items Bought</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Are you absolutely sure?</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. This will permanently delete
                    your account and remove your data from our servers.
                  </DialogDescription>
                  <PosSelectMemberForm />
                </DialogHeader>
              </DialogContent>
            </Dialog>

            <DataTable
              columns={PosItemBoughtColumns}
              data={itemBoughtLogs.data ?? []}
            />
          </div>
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
