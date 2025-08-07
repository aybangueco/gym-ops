'use server'

import { Member } from '@/generated/prisma'
import prisma from '@/lib/prisma'
import { getSession } from '../auth'

export async function actionGetMembers(): Promise<{
  data: Member[] | null
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
      orderBy: { id: 'asc' }
    })

    return { data: members, error: null, ok: true }
  } catch (error) {
    return { data: null, error, ok: false }
  }
}
