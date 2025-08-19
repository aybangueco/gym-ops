'use server'

import prisma from '@/lib/prisma'
import { actionGetSession } from '../auth'
import { memberSchema, MemberSchema } from './'
import { ActionState } from '../types'
import { revalidatePath } from 'next/cache'
import { actionGetMembershipByID } from '../memberships'
import { Member } from '@/generated/prisma'
import { Errors, handleActionStateError } from '@/lib/errors'
import { actionCreateAttendance } from '../attendance'

export async function actionGetMembers(): Promise<ActionState<Member[]>> {
  try {
    const session = await actionGetSession()

    if (!session) {
      throw Errors.InvalidSession()
    }

    const members = await prisma.member.findMany({
      where: {
        createdBy: session.user.id,
      },
      orderBy: {
        id: 'desc',
      },
    })

    return { data: members, ok: true, error: null }
  } catch (error) {
    return handleActionStateError(error)
  }
}

export async function actionGetMemberByID(
  memberID: number
): Promise<ActionState<Member | null>> {
  try {
    const session = await actionGetSession()

    if (!session) {
      throw Errors.InvalidSession()
    }

    const member = await prisma.member.findUnique({
      where: {
        id: memberID,
        createdBy: session.user.id,
      },
    })

    return { data: member, ok: true, error: null }
  } catch (error) {
    return handleActionStateError(error)
  }
}

export async function actionCreateMember(
  values: MemberSchema
): Promise<ActionState<Member>> {
  try {
    const session = await actionGetSession()

    if (!session) {
      throw Errors.InvalidSession()
    }

    const validatedData = memberSchema.parse(values)

    const existingMembership = await actionGetMembershipByID(
      Number(validatedData.membershipId)
    )

    const isMembershipEmpty =
      validatedData.membershipId === '0' || validatedData.membershipId === ''

    if (!isMembershipEmpty && existingMembership.data === null) {
      throw Errors.MembershipNotFound()
    }

    const membershipStart = isMembershipEmpty ? null : new Date()

    const membershipEnd: Date | null =
      membershipStart !== null ? new Date() : null

    if (
      membershipStart !== null &&
      membershipEnd !== null &&
      existingMembership.data
    ) {
      membershipEnd.setDate(
        membershipEnd.getDate() + existingMembership.data.length
      )
    }

    const createdMember = await prisma.member.create({
      data: {
        ...validatedData,
        membershipId:
          validatedData.membershipId === '0'
            ? null
            : existingMembership.data?.id,
        membershipStart,
        membershipEnd,
        createdBy: session.user.id,
      },
    })

    await actionCreateAttendance({ memberId: createdMember.id.toString() })

    revalidatePath('/members')

    return { data: createdMember, ok: true, error: null }
  } catch (error) {
    return handleActionStateError(error)
  }
}

export async function actionUpdateMember({
  memberID,
  values,
}: {
  memberID: number
  values: MemberSchema
}): Promise<ActionState<Member>> {
  try {
    const session = await actionGetSession()

    if (!session) {
      throw Errors.InvalidSession()
    }

    const validatedData = memberSchema.parse(values)

    const existingMember = await actionGetMemberByID(memberID)

    if (existingMember.ok && existingMember.data === null) {
      throw Errors.MemberNotFound()
    }

    const existingMembership = await actionGetMembershipByID(
      Number(validatedData.membershipId)
    )

    const isMembershipEmpty =
      validatedData.membershipId === '0' || validatedData.membershipId === ''

    if (!isMembershipEmpty && existingMembership.data === null) {
      throw Errors.MembershipNotFound()
    }

    const membershipDidNotChange =
      existingMembership.data?.id === existingMember.data?.membershipId

    let membershipStart: Date | null = null
    let membershipEnd: Date | null = null

    if (membershipDidNotChange && existingMember.data) {
      membershipStart = existingMember.data.membershipStart
      membershipEnd = existingMember.data.membershipEnd
    }

    if (
      !membershipDidNotChange &&
      existingMember.data &&
      existingMembership.data
    ) {
      membershipStart = new Date()
      membershipEnd = new Date()

      membershipEnd.setDate(
        membershipEnd.getDate() + existingMembership.data.length
      )
    }

    const updatedMember = await prisma.member.update({
      data: {
        ...validatedData,
        membershipStart,
        membershipEnd,
        membershipId:
          existingMembership.data !== null ? existingMembership.data.id : null,
      },
      where: {
        id: memberID,
        createdBy: session.user.id,
        updatedAt: existingMember.data?.updatedAt,
      },
    })

    revalidatePath('/members')

    return { data: updatedMember, ok: true, error: null }
  } catch (error) {
    return handleActionStateError(error)
  }
}

export async function actionDeleteMember(
  memberID: number
): Promise<ActionState<boolean>> {
  try {
    const session = await actionGetSession()

    if (!session) {
      throw Errors.InvalidSession()
    }

    const existingMember = await actionGetMemberByID(memberID)

    if (existingMember.ok && existingMember.data === null) {
      throw Errors.MemberNotFound()
    }

    await prisma.member.delete({
      where: {
        id: memberID,
        createdBy: session.user.id,
      },
    })

    revalidatePath('/members')

    return { data: true, ok: true, error: null }
  } catch (error) {
    return handleActionStateError(error)
  }
}
