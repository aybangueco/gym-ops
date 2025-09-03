'use client'

import { ItemBoughtLog } from '@/generated/prisma'
import { ColumnDef } from '@tanstack/react-table'

const PosItemBoughtColumns: ColumnDef<ItemBoughtLog>[] = [
  {
    accessorKey: 'itemId',
    header: 'Item',
  },
  {
    accessorKey: 'boughtBy',
    header: 'Bought by',
  },
  {
    accessorKey: 'stocksBought',
    header: 'Stocks Bought',
  },
]

export default PosItemBoughtColumns
