'use client'

import { AttendanceLog, Member } from '@/generated/prisma'
import { createContext, ReactNode, useContext } from 'react'
import { AttendanceWithMember } from '../types'

type AttendanceDataContextProps = {
  members: Member[]
  attendances: AttendanceWithMember[]
  attendanceLogs: AttendanceLog[]
}

const AttendanceDataContext = createContext<AttendanceDataContextProps | null>(
  null
)

type AttendanceDataProviderProps = AttendanceDataContextProps & {
  children: ReactNode
}

export default function AttendanceDataProvider({
  members,
  attendanceLogs,
  attendances,
  children,
}: AttendanceDataProviderProps) {
  return (
    <AttendanceDataContext.Provider
      value={{ members, attendances, attendanceLogs }}
    >
      {children}
    </AttendanceDataContext.Provider>
  )
}

export function useAttendanceDataContext() {
  const ctx = useContext(AttendanceDataContext)

  if (!ctx) {
    throw new Error(
      'useAttendanceDataContext must be inside AttendanceDataProvider'
    )
  }

  return ctx
}
