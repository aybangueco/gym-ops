import { Membership } from '@/generated/prisma'
import { getSession } from '../auth'
import prisma from '@/lib/prisma'
import { MembershipSchema } from './'

export async function actionGetMemberships(): Promise<{
  data: Membership[] | null
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

    const memberships = await prisma.membership.findMany({
      where: { createdBy: session.user.id },
      orderBy: { id: 'asc' }
    })

    return { data: memberships, error: null, ok: true }
  } catch (error) {
    return { data: null, error, ok: false }
  }
}

export async function actionGetMembershipByID(id: number): Promise<{
  data: Membership | null
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

    const membership = await prisma.membership.findUnique({
      where: { id, createdBy: session.user.id }
    })

    return { data: membership, error: null, ok: true }
  } catch (error) {
    return { data: null, error, ok: false }
  }
}

export async function actionCreateMembership(
  inputData: MembershipSchema
): Promise<{
  data: Membership | null
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

    const { name, length, price } = inputData

    const membership = await prisma.membership.create({
      data: {
        name,
        length: Number(length),
        price: Number(price),
        createdBy: session.user.id
      }
    })

    return { data: membership, error: null, ok: true }
  } catch (error) {
    return { data: null, error, ok: false }
  }
}

export async function actionUpdateMembership({
  id,
  inputData
}: {
  id: number
  inputData: MembershipSchema
}): Promise<{
  data: Membership | null
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

    const { name, length, price } = inputData

    const membership = await prisma.membership.update({
      where: { id, createdBy: session.user.id },
      data: {
        name,
        length: Number(length),
        price: Number(price),
        createdBy: session.user.id
      }
    })

    return { data: membership, error: null, ok: true }
  } catch (error) {
    return { data: null, error, ok: false }
  }
}
