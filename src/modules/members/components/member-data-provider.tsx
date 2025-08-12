'use client'

import { Membership } from '@/generated/prisma'
import { createContext, useContext } from 'react'

type MemberDataContextProps = {
  memberships: Membership[]
}

const memberDataContext = createContext<MemberDataContextProps | null>(null)

type MemberDataProviderProps = {
  memberships: Membership[]
  children: React.ReactNode
}

export default function MemberDataProvider({
  memberships,
  children
}: MemberDataProviderProps) {
  return (
    <memberDataContext.Provider value={{ memberships }}>
      {children}
    </memberDataContext.Provider>
  )
}

export function useMemberDataContext() {
  const ctx = useContext(memberDataContext)

  if (!ctx) {
    throw new Error('useMemberDataContext must be inside MemberDataProvider')
  }

  return ctx
}
