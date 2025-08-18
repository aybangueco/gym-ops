'use server'

import prisma from '@/lib/prisma'
import { actionGetSession } from '../auth'
import { membershipSchema, MembershipSchema } from './'
import { revalidatePath } from 'next/cache'
import { ActionState } from '../types'
import { Membership } from '@/generated/prisma'
import { handleActionStateError } from '@/lib/errors'

export async function actionGetMemberships(): Promise<
  ActionState<Membership[]>
> {
  try {
    const session = await actionGetSession()

    if (!session) {
      return {
        data: null,
        ok: false,
        error: new Error('Invalid user session'),
      }
    }

    const memberships = await prisma.membership.findMany({
      where: {
        createdBy: session.user.id,
      },
      orderBy: {
        id: 'asc',
      },
    })

    return { data: memberships, ok: true, error: null }
  } catch (error) {
    return handleActionStateError(error)
  }
}

export async function actionGetMembershipByID(
  membershipID: number
): Promise<ActionState<Membership | null>> {
  try {
    const session = await actionGetSession()

    if (!session) {
      return {
        data: null,
        ok: false,
        error: new Error('Invalid user session'),
      }
    }

    const membership = await prisma.membership.findUnique({
      where: {
        id: membershipID,
        createdBy: session.user.id,
      },
    })

    return { data: membership, ok: true, error: null }
  } catch (error) {
    return handleActionStateError(error)
  }
}

export async function actionCreateMembership(
  values: MembershipSchema
): Promise<ActionState<Membership>> {
  try {
    const session = await actionGetSession()

    if (!session) {
      return {
        data: null,
        ok: false,
        error: new Error('Invalid user session'),
      }
    }

    const validatedData = membershipSchema.parse(values)

    const createdMembership = await prisma.membership.create({
      data: {
        ...validatedData,
        length: Number(validatedData.length),
        cost: Number(validatedData.cost),
        createdBy: session.user.id,
      },
    })

    revalidatePath('/memberships')

    return { data: createdMembership, ok: true, error: null }
  } catch (error) {
    return handleActionStateError(error)
  }
}

export async function actionUpdateMembership({
  membershipID,
  values,
}: {
  membershipID: number
  values: MembershipSchema
}): Promise<ActionState<Membership>> {
  try {
    const session = await actionGetSession()

    if (!session) {
      return {
        data: null,
        ok: false,
        error: new Error('Invalid user session'),
      }
    }

    const validatedData = membershipSchema.parse(values)

    const existingMembership = await actionGetMembershipByID(membershipID)

    if (!existingMembership.ok && existingMembership.error !== null) {
      return { data: null, ok: false, error: existingMembership.error }
    }

    if (existingMembership.data === null) {
      return {
        data: null,
        ok: false,
        error: new Error('Invalid membership'),
      }
    }

    const updatedMember = await prisma.membership.update({
      data: {
        ...validatedData,
        length: Number(validatedData.length),
        cost: Number(validatedData.cost),
      },
      where: {
        id: existingMembership.data.id,
        createdBy: session.user.id,
        updatedAt: existingMembership.data.updatedAt,
      },
    })

    revalidatePath('/memberships')

    return { data: updatedMember, ok: true, error: null }
  } catch (error) {
    return handleActionStateError(error)
  }
}

export async function actionDeleteMembership(
  membershipID: number
): Promise<ActionState<boolean>> {
  try {
    const session = await actionGetSession()

    if (!session) {
      return {
        data: null,
        ok: false,
        error: new Error('Invalid user session'),
      }
    }

    const existingMembership = await actionGetMembershipByID(membershipID)

    if (!existingMembership.ok && existingMembership.error !== null) {
      return { data: null, ok: false, error: existingMembership.error }
    }

    if (existingMembership.data === null) {
      return {
        data: null,
        ok: false,
        error: new Error('Invalid membership'),
      }
    }

    await prisma.membership.delete({
      where: {
        id: membershipID,
        createdBy: session.user.id,
      },
    })

    revalidatePath('/memberships')

    return { data: true, ok: true, error: null }
  } catch (error) {
    return handleActionStateError(error)
  }
}
