'use server'

import prisma from '@/lib/prisma'
import { actionGetSession } from '../auth'
import {
  MembershipResponse,
  membershipSchema,
  MembershipSchema,
  MembershipsResponse,
} from './'
import { revalidatePath } from 'next/cache'
import { ActionState } from '../types'

export async function actionGetMemberships(): Promise<MembershipsResponse> {
  try {
    const session = await actionGetSession()

    if (!session) {
      return {
        data: [],
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
    console.error(error)

    if (error instanceof Error) {
      return { data: [], ok: false, error }
    }

    return {
      data: [],
      ok: false,
      error: new Error('Unknown error occured'),
    }
  }
}

export async function actionGetMembershipByID(
  membershipID: number
): Promise<MembershipResponse> {
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
    console.error(error)

    if (error instanceof Error) {
      return { data: null, ok: false, error }
    }

    return {
      data: null,
      ok: false,
      error: new Error('Unknown error occured'),
    }
  }
}

export async function actionCreateMembership(
  values: MembershipSchema
): Promise<ActionState> {
  try {
    const session = await actionGetSession()

    if (!session) {
      return {
        ok: false,
        error: new Error('Invalid user session'),
      }
    }

    const validatedData = membershipSchema.parse(values)

    await prisma.membership.create({
      data: {
        ...validatedData,
        length: Number(validatedData.length),
        cost: Number(validatedData.cost),
        createdBy: session.user.id,
      },
    })

    revalidatePath('/memberships')

    return { ok: true, error: null }
  } catch (error) {
    console.error(error)

    if (error instanceof Error) {
      return { ok: false, error }
    }

    return {
      ok: false,
      error: new Error('Unknown error occured'),
    }
  }
}

export async function actionUpdateMembership({
  membershipID,
  values,
}: {
  membershipID: number
  values: MembershipSchema
}): Promise<ActionState> {
  try {
    const session = await actionGetSession()

    if (!session) {
      return {
        ok: false,
        error: new Error('Invalid user session'),
      }
    }

    const validatedData = membershipSchema.parse(values)

    const existingMembership = await actionGetMembershipByID(membershipID)

    if (!existingMembership.ok && existingMembership.error !== null) {
      return { ok: false, error: existingMembership.error }
    }

    if (existingMembership.data === null) {
      return {
        ok: false,
        error: new Error('Invalid membership'),
      }
    }

    await prisma.membership.update({
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

    return { ok: true, error: null }
  } catch (error) {
    console.error(error)

    if (error instanceof Error) {
      return { ok: false, error }
    }

    return {
      ok: false,
      error: new Error('Unknown error occured'),
    }
  }
}

export async function actionDeleteMembership(
  membershipID: number
): Promise<ActionState> {
  try {
    const session = await actionGetSession()

    if (!session) {
      return {
        ok: false,
        error: new Error('Invalid user session'),
      }
    }

    const existingMembership = await actionGetMembershipByID(membershipID)

    if (!existingMembership.ok && existingMembership.error !== null) {
      return { ok: false, error: existingMembership.error }
    }

    if (existingMembership.data === null) {
      return {
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

    return { ok: false, error: null }
  } catch (error) {
    console.error(error)

    if (error instanceof Error) {
      return { ok: false, error }
    }

    return {
      ok: false,
      error: new Error('Unknown error occured'),
    }
  }
}
