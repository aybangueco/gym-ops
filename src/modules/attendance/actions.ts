'use server'

import { Attendance } from '@/generated/prisma'
import { ActionState } from '../types'
import {
  AttendanceLogSchema,
  attendanceLogSchema,
  AttendanceLogsWithAttendance,
  attendanceSchema,
  AttendanceSchema,
  AttendanceWithMember,
} from './'
import { actionGetSession } from '../auth'
import prisma from '@/lib/prisma'
import { Errors, handleActionStateError } from '@/lib/errors'
import { actionGetMemberByID } from '../members'
import { revalidatePath } from 'next/cache'

// Attendance server actions
export async function actionGetAttendances(): Promise<
  ActionState<AttendanceWithMember[]>
> {
  try {
    const session = await actionGetSession()

    if (!session) {
      throw Errors.InvalidSession()
    }

    const attendances = await prisma.attendance.findMany({
      where: {
        createdBy: session.user.id,
      },
      orderBy: {
        id: 'desc',
      },
      include: {
        member: true,
      },
    })

    return { data: attendances, ok: true, error: null }
  } catch (error) {
    return handleActionStateError(error)
  }
}

export async function actionGetAttendanceByMemberID(
  memberId: number
): Promise<ActionState<AttendanceWithMember | null>> {
  try {
    const session = await actionGetSession()

    if (!session) {
      throw Errors.InvalidSession()
    }

    const attendance = await prisma.attendance.findUnique({
      where: {
        memberId,
        createdBy: session.user.id,
      },
      include: {
        member: true,
      },
    })

    return { data: attendance, ok: true, error: null }
  } catch (error) {
    return handleActionStateError(error)
  }
}

export async function actionCreateAttendance(
  values: AttendanceSchema
): Promise<ActionState<Attendance>> {
  try {
    const session = await actionGetSession()

    if (!session) {
      throw Errors.InvalidSession()
    }

    const validatedData = attendanceSchema.parse(values)

    const createdAttendance = await prisma.attendance.create({
      data: {
        memberId: Number(validatedData.memberId),
        createdBy: session.user.id,
      },
    })

    return { data: createdAttendance, ok: true, error: null }
  } catch (error) {
    return handleActionStateError(error)
  }
}

export async function actionUpdateMemberAttendance({
  memberId,
  activeSession,
}: {
  memberId: number
  activeSession: boolean
}): Promise<ActionState<boolean>> {
  try {
    const session = await actionGetSession()

    if (!session) {
      throw Errors.InvalidSession()
    }

    const existingMember = await actionGetMemberByID(memberId)
    const memberAttendance = await actionGetAttendanceByMemberID(memberId)

    if (existingMember.ok && existingMember.data === null) {
      throw Errors.MemberNotFound()
    }

    if (
      memberAttendance.ok &&
      memberAttendance.data?.activeSession &&
      activeSession
    ) {
      throw Errors.MemberCurrentlyActive()
    }

    let lastActive: Date | null = null

    if (!activeSession) {
      lastActive = new Date()
    }

    const createdAttendance = await prisma.attendance.update({
      data: {
        activeSession,
        lastActive,
      },
      where: {
        memberId,
      },
    })

    await actionCreateAttendanceLog({
      attendanceId: createdAttendance.id,
      attendanceType: activeSession ? 'SESSION_STARTED' : 'SESSION_ENDED',
    })

    revalidatePath('/attendance')

    return { data: true, ok: true, error: null }
  } catch (error) {
    return handleActionStateError(error)
  }
}

// Attendance logs server actions
export async function actionGetAttendanceLogs(): Promise<
  ActionState<AttendanceLogsWithAttendance[]>
> {
  try {
    const session = await actionGetSession()

    if (!session) {
      throw Errors.InvalidSession()
    }

    const attendanceLogs = await prisma.attendanceLog.findMany({
      where: {
        createdBy: session.user.id,
      },
      orderBy: {
        id: 'desc',
      },
      include: {
        attendance: true,
      },
    })

    return { data: attendanceLogs, ok: true, error: null }
  } catch (error) {
    return handleActionStateError(error)
  }
}

export async function actionCreateAttendanceLog(
  values: AttendanceLogSchema
): Promise<ActionState<null>> {
  try {
    const session = await actionGetSession()

    if (!session) {
      throw Errors.InvalidSession()
    }

    const validatedData = attendanceLogSchema.parse(values)

    await prisma.attendanceLog.create({
      data: {
        ...validatedData,
        createdBy: session.user.id,
      },
    })

    revalidatePath('/attendance')

    return { data: null, ok: true, error: null }
  } catch (error) {
    return handleActionStateError(error)
  }
}
