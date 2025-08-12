'use server'

import { Member, Membership } from '@/generated/prisma'
import prisma from '@/lib/prisma'
import { getSession } from '../auth'
import { MemberSchema } from './schemas'
import { actionGetMembershipByID } from '../memberships'
import { revalidatePath } from 'next/cache'

export async function actionGetMembers(): Promise<{
  data: (Member & { membership: Membership })[] | null
  ok: boolean
  error: unknown | null
}> {
  try {
    const session = await getSession()

    if (!session) {
      return {
        data: null,
        error: new Error('Unauthorized user session'),
        ok: false
      }
    }

    const members = await prisma.member.findMany({
      where: { createdBy: session.user.id },
      orderBy: { id: 'asc' },
      include: { membership: true }
    })

    return { data: members, error: null, ok: true }
  } catch (error) {
    return { data: null, error, ok: false }
  }
}

export async function actionGetMemberByID(
  id: number
): Promise<{ data: Member | null; ok: boolean; error: unknown | null }> {
  try {
    const session = await getSession()

    if (!session) {
      return {
        data: null,
        error: new Error('Unauthorized user session'),
        ok: false
      }
    }

    const member = await prisma.member.findUnique({
      where: { createdBy: session.user.id, id }
    })

    return { data: member, error: null, ok: true }
  } catch (error) {
    return { data: null, error, ok: false }
  }
}

export async function actionCreateMember(inputData: MemberSchema): Promise<{
  data: Member | null
  ok: boolean
  error: unknown | null
}> {
  try {
    const session = await getSession()

    if (!session) {
      throw new Error('Unauthorized user session')
    }

    const { name, email, membershipId } = inputData

    const existingMembership = await actionGetMembershipByID(
      Number(membershipId)
    )

    if (!existingMembership.data) {
      throw new Error('Existing membership not found')
    }

    const membershipStart = new Date()
    const membershipEnd = new Date()
    membershipEnd.setDate(
      membershipEnd.getDate() + existingMembership.data.length
    )

    const member = await prisma.member.create({
      data: {
        name,
        email,
        membershipId: existingMembership.data.id,
        status: 'ACTIVE',
        membershipStart,
        membershipEnd,
        createdBy: session.user.id
      }
    })

    revalidatePath('/members')

    return { data: member, error: null, ok: true }
  } catch (error) {
    return { data: null, error, ok: false }
  }
}

export async function actionUpdateMember({
  id,
  inputData
}: {
  id: number
  inputData: MemberSchema
}): Promise<{
  data: Member | null
  ok: boolean
  error: unknown | null
}> {
  try {
    const session = await getSession()

    if (!session) {
      throw new Error('Unauthorized user session')
    }

    const { name, email, membershipId } = inputData

    const existingMember = await actionGetMemberByID(32)
    const existingMembership = await actionGetMembershipByID(
      Number(membershipId)
    )

    if (existingMember.data === null) {
      throw new Error('Member not found')
    }

    if (!existingMembership.data && !existingMembership.ok) {
      throw new Error('Membership not found')
    }

    const member = await prisma.member.update({
      data: {
        name,
        email,
        membershipId: Number(membershipId)
      },
      where: {
        id,
        createdBy: session.user.id
      }
    })

    revalidatePath('/members')

    return { data: member, error: null, ok: true }
  } catch (error) {
    return { data: null, error, ok: false }
  }
}

export async function actionDeleteMember(
  id: number
): Promise<{ ok: boolean; error: unknown }> {
  try {
    const session = await getSession()

    if (!session) {
      throw new Error('Unauthorized user session')
    }

    await prisma.member.delete({
      where: {
        id,
        createdBy: session.user.id
      }
    })

    revalidatePath('/members')

    return { ok: false, error: null }
  } catch (error) {
    return { ok: false, error }
  }
}
