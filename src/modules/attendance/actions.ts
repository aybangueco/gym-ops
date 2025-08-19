'use server'

import { Attendance } from '@/generated/prisma'
import { ActionState } from '../types'
import { attendanceSchema, AttendanceSchema, AttendanceWithMember } from './'
import { actionGetSession } from '../auth'
import prisma from '@/lib/prisma'
import { Errors, handleActionStateError } from '@/lib/errors'
import { actionGetMemberByID } from '../members'
import { revalidatePath } from 'next/cache'

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

    await prisma.attendance.update({
      data: {
        activeSession,
        lastActive,
      },
      where: {
        memberId,
      },
    })

    revalidatePath('/attendance')

    return { data: true, ok: true, error: null }
  } catch (error) {
    return handleActionStateError(error)
  }
}
