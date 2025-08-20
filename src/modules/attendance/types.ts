import { Prisma } from '@/generated/prisma'

export type AttendanceWithMember = Prisma.AttendanceGetPayload<{
  include: { member: true }
}>

export type AttendanceLogsWithAttendance = Prisma.AttendanceLogGetPayload<{
  include: { attendance: true }
}>
