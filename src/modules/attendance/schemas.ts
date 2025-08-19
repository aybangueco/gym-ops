import { AttendanceType } from '@/generated/prisma'
import z from 'zod'

export const attendanceSchema = z.object({
  memberId: z.string().nonempty({ error: 'Please select a member' }),
})

export type AttendanceSchema = z.infer<typeof attendanceSchema>

export const attendanceLogSchema = z.object({
  attendanceId: z.number().nonoptional({ error: 'Attendance id is required' }),
  attendanceType: z
    .enum(AttendanceType)
    .nonoptional({ error: 'Attendance type is required' }),
})

export type AttendanceLogSchema = z.infer<typeof attendanceLogSchema>
