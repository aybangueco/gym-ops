'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Membership } from '@/generated/prisma'
import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown, Book, PhilippinePesoIcon } from 'lucide-react'
import { DeleteDialog, FormDialog } from '@/components/reusables'
import { actionDeleteMembership, MembershipForm } from '..'
import toast from 'react-hot-toast'

const membershipColumns: ColumnDef<Membership>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          <Book />
          Membership Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    }
  },
  {
    accessorKey: 'length',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Membership Length
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    }
  },
  {
    accessorKey: 'price',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Membership Price
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const membership = row.original

      return (
        <div className="flex items-center">
          <PhilippinePesoIcon size={15} />
          {membership.price}
        </div>
      )
    }
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const membership = row.original

      const onClickDeleteMembership = async () => {
        try {
          await actionDeleteMembership(membership.id)
          toast.success('Membership deleted successfully')
        } catch (_) {
          toast.error('Error deleting membership')
        }
      }

      return (
        <DropdownMenu>
          <DropdownMenuTrigger>...</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <FormDialog>
                <MembershipForm
                  id={membership.id}
                  data={membership}
                  state="UPDATE"
                />
              </FormDialog>
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <DeleteDialog
                data={membership}
                onClickDelete={onClickDeleteMembership}
              />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  }
]

export default membershipColumns
