'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Item } from '@/generated/prisma'
import { ColumnDef } from '@tanstack/react-table'
import { actionDeleteItem } from '../'
import { toast } from 'sonner'
import UpdateDialogForm from '@/components/reuseables/dialog/update-dialog-form'
import PosItemForm from './pos-item-form'
import DeleteDialog from '@/components/reuseables/dialog/delete-dialog'

const PosItemColumns: ColumnDef<Item>[] = [
  {
    accessorKey: 'name',
    header: 'Item Name',
  },
  {
    accessorKey: 'price',
    header: 'Price',
  },
  {
    accessorKey: 'stocks',
    header: 'Stocks',
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const posItem = row.original

      const deletePosItem = async () => {
        const { ok, error } = await actionDeleteItem(posItem.id)

        if (!ok && error !== null) {
          toast.error(error.message)
          return
        }

        toast.success('Item deleted successfully')
      }

      return (
        <DropdownMenu>
          <DropdownMenuTrigger>...</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <UpdateDialogForm
                title="Update item"
                description="Update item information"
              >
                <PosItemForm
                  itemID={posItem.id}
                  data={{
                    name: posItem.name,
                    stocks: posItem.stocks.toString(),
                    price: posItem.price.toString(),
                  }}
                  action="UPDATE"
                />
              </UpdateDialogForm>
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <DeleteDialog itemName={posItem.name} deleteFn={deletePosItem} />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export default PosItemColumns
