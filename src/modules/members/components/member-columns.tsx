'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Membership, Prisma } from '@/generated/prisma'
import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'
import { actionDeleteMember } from '../actions'
import toast from 'react-hot-toast'
import { DeleteDialog, FormDialog } from '@/components/reusables'
import MemberForm from './member-form'
import { actionGetMemberships } from '@/modules/memberships'
import { useEffect, useState } from 'react'

type MemberWithMembership = Prisma.MemberGetPayload<{
  include: { membership: true }
}>

const memberColumns: ColumnDef<MemberWithMembership>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    }
  },
  {
    accessorKey: 'email',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    }
  },
  {
    accessorKey: 'status',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    }
  },
  {
    accessorKey: 'membershipId',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Membership
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const member = row.original
      if (!member.membership) {
        return <p>N/A</p>
      }

      return <p>{member.membership.name}</p>
    }
  },
  {
    accessorKey: 'membershipStart',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Membership Start
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const member = row.original
      if (!member.membershipStart) {
        return <p>N/A</p>
      }
      const startDate = new Date(member.membershipStart)
      const month = String(startDate.getMonth() + 1).padStart(2, '0')
      const day = String(startDate.getDate()).padStart(2, '0')
      const year = startDate.getFullYear()

      return <p>{`${month}-${day}-${year}`}</p>
    }
  },
  {
    accessorKey: 'membershipEnd',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Membership End
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const member = row.original
      if (!member.membershipEnd) {
        return <p>N/A</p>
      }
      const startDate = new Date(member.membershipEnd)
      const month = String(startDate.getMonth() + 1).padStart(2, '0')
      const day = String(startDate.getDate()).padStart(2, '0')
      const year = startDate.getFullYear()

      return <p>{`${month}-${day}-${year}`}</p>
    }
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const member = row.original

      const onClickDeleteMember = async () => {
        try {
          await actionDeleteMember(member.id)
          toast.success('Member deleted successfully')
        } catch (_) {
          toast.error('Error deleting member')
        }
      }

      return (
        <DropdownMenu>
          <DropdownMenuTrigger>...</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <FormDialog>
                <MemberForm
                  id={member.id}
                  data={{
                    email: member.email,
                    membershipId: member.membership.id.toString(),
                    name: member.name
                  }}
                  state="UPDATE"
                />
              </FormDialog>
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <DeleteDialog data={member} onClickDelete={onClickDeleteMember} />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  }
]

export default memberColumns
