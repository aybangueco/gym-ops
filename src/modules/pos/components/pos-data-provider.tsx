'use client'

import { Item, ItemBoughtLog, Member } from '@/generated/prisma'
import { createContext, ReactNode, useContext } from 'react'

type PosDataContextType = {
  items: Item[]
  itemBoughtLogs: ItemBoughtLog[]
  members: Member[]
}

const PosDataContext = createContext<PosDataContextType | null>(null)

type PosDataProviderProps = PosDataContextType & {
  children: ReactNode
}

export default function PosDataProvider({
  items,
  itemBoughtLogs,
  members,
  children,
}: PosDataProviderProps) {
  return (
    <PosDataContext.Provider value={{ items, itemBoughtLogs, members }}>
      {children}
    </PosDataContext.Provider>
  )
}

export function usePosDataContext() {
  const ctx = useContext(PosDataContext)

  if (!ctx) {
    throw new Error('usePosDataContext must be inside PosDataProvider')
  }

  return ctx
}
