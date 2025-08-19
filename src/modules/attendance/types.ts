import { Prisma } from '@/generated/prisma'

export type AttendanceWithMember = Prisma.AttendanceGetPayload<{
  include: { member: true }
}>
