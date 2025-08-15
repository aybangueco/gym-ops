'use client'

import { Membership } from '@/generated/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import DeleteDialog from '@/components/reuseables/dialog/delete-dialog'
import { actionDeleteMembership } from '../actions'
import { toast } from 'sonner'
import { useState } from 'react'
import UpdateDialogForm from '@/components/reuseables/dialog/update-dialog-form'
import MembershipForm from './membership-form'

type MembershipCardProps = {
  data: Membership
}

export default function MembershipCard({ data }: MembershipCardProps) {
  const [deleteIsPending, setDeleteIsPending] = useState<boolean>(false)

  const deleteMembership = async () => {
    setDeleteIsPending(true)
    const { ok, error } = await actionDeleteMembership(data.id)

    if (!ok && error !== null) {
      toast.error(error.message)
      setDeleteIsPending(false)
      return
    }

    toast.success('Membership deleted successfully')
    setDeleteIsPending(false)
  }

  return (
    <Card className="mx-auto w-full shadow-md transition-shadow duration-200 hover:shadow-lg">
      <CardHeader className="flex items-center justify-between">
        <CardTitle className="text-xl font-semibold">{data.name}</CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger>...</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Action</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <UpdateDialogForm
                title="Update Membership"
                description="Update membership information"
              >
                <MembershipForm
                  action="UPDATE"
                  membershipID={data.id}
                  data={{
                    name: data.name,
                    length: data.length.toString(),
                    cost: data.cost.toString(),
                  }}
                />
              </UpdateDialogForm>
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <DeleteDialog
                itemName={data.name}
                deleteFn={deleteMembership}
                isPending={deleteIsPending}
              />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex justify-between">
          <span>Length:</span>
          <span className="font-medium">{data.length} days</span>
        </div>
        <div className="flex justify-between">
          <span>Cost:</span>
          <span className="font-medium">{data.cost}</span>
        </div>
        <div className="flex justify-between">
          <span>Active Members</span>
          <span className="font-medium">{data.id}</span>
        </div>
      </CardContent>
    </Card>
  )
}
