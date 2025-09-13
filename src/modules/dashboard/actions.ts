'use server'

import { Errors, handleActionStateError } from '@/lib/errors'
import { ActionState } from '../types'
import prisma from '@/lib/prisma'
import { actionGetSession } from '../auth'

export async function actionCountActiveSession(): Promise<ActionState<number>> {
  try {
    const session = await actionGetSession()

    if (!session) {
      throw Errors.InvalidSession()
    }

    const totalActiveSession = await prisma.attendance.count({
      where: {
        activeSession: true,
        createdBy: session.user.id,
      },
    })

    return { data: totalActiveSession, ok: true, error: null }
  } catch (error) {
    return handleActionStateError(error)
  }
}

export async function actionCountMembers(): Promise<ActionState<number>> {
  try {
    const session = await actionGetSession()

    if (!session) {
      throw Errors.InvalidSession()
    }

    const totalMembers = await prisma.member.count({
      where: {
        createdBy: session.user.id,
      },
    })

    return { data: totalMembers, ok: true, error: null }
  } catch (error) {
    return handleActionStateError(error)
  }
}

export async function actionCountActiveMembers(): Promise<ActionState<number>> {
  try {
    const session = await actionGetSession()

    if (!session) {
      throw Errors.InvalidSession()
    }

    const totalActiveMembers = await prisma.member.count({
      where: {
        memberStatus: 'ACTIVE',
        createdBy: session.user.id,
      },
    })

    return { data: totalActiveMembers, ok: true, error: null }
  } catch (error) {
    return handleActionStateError(error)
  }
}

export async function actionCountExpiringMembers(): Promise<
  ActionState<number>
> {
  try {
    const session = await actionGetSession()

    if (!session) {
      throw Errors.InvalidSession()
    }

    const now = new Date()
    const sevenDaysFromNow = new Date()
    sevenDaysFromNow.setDate(now.getDate() + 7)

    const totalExpiringMembers = await prisma.member.count({
      where: {
        membershipEnd: {
          gte: now, // membership hasn't expired yet
          lte: sevenDaysFromNow, // expiring within the next 7 days
        },
      },
    })

    return { data: totalExpiringMembers, ok: true, error: null }
  } catch (error) {
    return handleActionStateError(error)
  }
}
