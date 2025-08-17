'use client'

import { Membership } from '@/generated/prisma'
import { createContext, ReactNode, useContext } from 'react'

type MemberDataContext = {
  memberships: Membership[]
}

const MemberDataContext = createContext<MemberDataContext | null>(null)

type MemberDataProviderProps = {
  memberships: Membership[]
  children: ReactNode
}

export default function MemberDataProvider({
  memberships,
  children,
}: MemberDataProviderProps) {
  return (
    <MemberDataContext.Provider value={{ memberships }}>
      {children}
    </MemberDataContext.Provider>
  )
}

export function useMemberDataContext() {
  const ctx = useContext(MemberDataContext)

  if (!ctx) {
    throw new Error(
      'useMemberDataContext must be inside of MemberDataProvider component'
    )
  }

  return ctx
}
