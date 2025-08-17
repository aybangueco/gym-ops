'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Member } from '@/generated/prisma'
import { ColumnDef } from '@tanstack/react-table'
import { useMemberDataContext } from './member-data-provider'
import UpdateDialogForm from '@/components/reuseables/dialog/update-dialog-form'
import MemberForm from './member-form'
import DeleteDialog from '@/components/reuseables/dialog/delete-dialog'
import { useState } from 'react'
import { actionDeleteMember } from '..'
import { toast } from 'sonner'

const MemberColumns: ColumnDef<Member>[] = [
  {
    accessorKey: 'firstName',
    header: 'First Name',
  },
  {
    accessorKey: 'lastName',
    header: 'Last Name',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'mobileNumber',
    header: 'Mobile Number',
    cell: ({ row }) => {
      const member = row.original

      if (member.mobileNumber === '') {
        return <p>N/A</p>
      } else {
        return <p>{member.mobileNumber}</p>
      }
    },
  },
  {
    accessorKey: 'membershipId',
    header: 'Membership',
    cell: ({ row }) => {
      const { memberships } = useMemberDataContext()

      return (
        <p>
          {memberships.find(
            (membership) => membership.id === row.getValue('membershipId')
          )?.name ?? 'N/A'}
        </p>
      )
    },
  },
  {
    accessorKey: 'memberStatus',
    header: 'Member Status',
  },
  {
    accessorKey: 'membershipStart',
    header: 'Membership Start',
    cell: ({ row }) => {
      const date = new Date(row.getValue('membershipStart'))

      if (!row.getValue('membershipStart')) {
        return 'N/A'
      }

      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const year = date.getFullYear()
      return `${month}-${day}-${year}`
    },
  },
  {
    accessorKey: 'membershipEnd',
    header: 'Membership End',
    cell: ({ row }) => {
      const date = new Date(row.getValue('membershipEnd'))

      if (!row.getValue('membershipStart')) {
        return 'N/A'
      }

      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const year = date.getFullYear()
      return `${month}-${day}-${year}`
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const member = row.original
      const [deleteIsPending, setDeleteIsPending] = useState<boolean>(false)

      const deleteMember = async () => {
        setDeleteIsPending(true)
        const { ok, error } = await actionDeleteMember(member.id)

        if (!ok && error !== null) {
          toast.error(error.message)
          setDeleteIsPending(false)
          return
        }

        toast.success('Member deleted successfully')
        setDeleteIsPending(false)
      }

      return (
        <DropdownMenu>
          <DropdownMenuTrigger>...</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <UpdateDialogForm
                title="Update member"
                description="Update member information"
              >
                <MemberForm
                  memberID={member.id}
                  data={{
                    firstName: member.firstName,
                    lastName: member.lastName,
                    email: member.email,
                    mobileNumber: member.mobileNumber ?? '',
                    membershipId: member.membershipId?.toString() ?? '',
                    memberStatus: member.memberStatus,
                  }}
                  action="UPDATE"
                />
              </UpdateDialogForm>
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <DeleteDialog
                itemName={member.firstName}
                deleteFn={deleteMember}
                isPending={deleteIsPending}
              />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export default MemberColumns
