import prisma from '@/lib/prisma'
import { actionGetSession } from '../auth'
import { MemberResponse, memberSchema, MemberSchema, MembersResponse } from './'
import { ActionState } from '../types'
import { revalidatePath } from 'next/cache'
import { actionGetMembershipByID } from '../memberships'

export async function actionGetMembers(): Promise<MembersResponse> {
  try {
    const session = await actionGetSession()

    if (!session) {
      return {
        data: [],
        ok: false,
        error: new Error('Invalid user session'),
      }
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

export async function actionGetMemberByID(
  memberID: number
): Promise<MemberResponse> {
  try {
    const session = await actionGetSession()

    if (!session) {
      return {
        data: null,
        ok: false,
        error: new Error('Invalid user session'),
      }
    }

    const member = await prisma.member.findUnique({
      where: {
        id: memberID,
        createdBy: session.user.id,
      },
    })

    return { data: member, ok: true, error: null }
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

export async function actionCreateMember(
  values: MemberSchema
): Promise<ActionState> {
  try {
    const session = await actionGetSession()

    if (!session) {
      return {
        ok: false,
        error: new Error('Invalid user session'),
      }
    }

    const validatedData = memberSchema.parse(values)

    const existingMembership = await actionGetMembershipByID(
      Number(validatedData.membershipId)
    )

    if (existingMembership.data === null) {
      return {
        ok: false,
        error: new Error('Invalid membership'),
      }
    }

    await prisma.member.create({
      data: {
        ...validatedData,
        membershipId: existingMembership.data.id,
        createdBy: session.user.id,
      },
    })

    revalidatePath('/members')

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

export async function actionUpdateMember({
  memberID,
  values,
}: {
  memberID: number
  values: MemberSchema
}): Promise<ActionState> {
  try {
    const session = await actionGetSession()

    if (!session) {
      return {
        ok: false,
        error: new Error('Invalid user session'),
      }
    }

    const validatedData = memberSchema.parse(values)

    const existingMember = await actionGetMemberByID(memberID)

    if (existingMember.ok && existingMember.data === null) {
      return {
        ok: false,
        error: new Error('Invalid member'),
      }
    }

    const existingMembership = await actionGetMembershipByID(
      Number(validatedData.membershipId)
    )

    if (existingMembership.ok && existingMember.data === null) {
      return {
        ok: false,
        error: new Error('Invalid membership'),
      }
    }

    await prisma.member.update({
      data: {
        ...validatedData,
        membershipId: Number(validatedData.membershipId),
      },
      where: {
        id: memberID,
        createdBy: session.user.id,
        updatedAt: existingMember.data?.updatedAt,
      },
    })

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

export async function actionDeleteMember(
  memberID: number
): Promise<ActionState> {
  try {
    const session = await actionGetSession()

    if (!session) {
      return {
        ok: false,
        error: new Error('Invalid user session'),
      }
    }

    const existingMember = await actionGetMemberByID(memberID)

    if (existingMember.ok && existingMember.data === null) {
      return {
        ok: false,
        error: new Error('Invalid member'),
      }
    }

    await prisma.member.delete({
      where: {
        id: memberID,
        createdBy: session.user.id,
      },
    })

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
