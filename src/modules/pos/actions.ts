'use server'

import { Errors, handleActionStateError } from '@/lib/errors'
import { ActionState } from '../types'
import { Item, ItemBoughtLog } from '@/generated/prisma'
import prisma from '@/lib/prisma'
import { actionGetSession } from '../auth'
import { PosItemSchema, posItemSchema } from './schemas'
import { actionGetMemberByID } from '../members'
import { revalidatePath } from 'next/cache'

// Item actions
export async function actionGetItems(): Promise<ActionState<Item[]>> {
  try {
    const session = await actionGetSession()

    if (!session) {
      throw Errors.InvalidSession()
    }

    const items = await prisma.item.findMany({
      where: {
        createdBy: session.user.id,
      },
      orderBy: { id: 'asc' },
    })

    return { data: items, ok: true, error: null }
  } catch (error) {
    return handleActionStateError(error)
  }
}

export async function actionGetItemByID(
  itemId: number
): Promise<ActionState<Item | null>> {
  try {
    const session = await actionGetSession()

    if (!session) {
      throw Errors.InvalidSession()
    }

    const item = await prisma.item.findUnique({
      where: {
        id: itemId,
        createdBy: session.user.id,
      },
    })

    return { data: item, ok: true, error: null }
  } catch (error) {
    return handleActionStateError(error)
  }
}

export async function actionCreateItem(
  data: PosItemSchema
): Promise<ActionState<Item>> {
  try {
    const session = await actionGetSession()

    if (!session) {
      throw Errors.InvalidSession()
    }

    const validatedData = posItemSchema.parse(data)

    const newItem = await prisma.item.create({
      data: {
        ...validatedData,
        price: Number(validatedData.price),
        stocks: Number(validatedData.stocks),
        createdBy: session.user.id,
      },
    })

    revalidatePath('/point-of-sale')

    return { data: newItem, ok: true, error: null }
  } catch (error) {
    return handleActionStateError(error)
  }
}

export async function actionUpdateItem({
  itemID,
  data,
}: {
  itemID: number
  data: PosItemSchema
}): Promise<ActionState<Item>> {
  try {
    const session = await actionGetSession()

    if (!session) {
      throw Errors.InvalidSession()
    }

    const validatedData = posItemSchema.parse(data)

    const existingItem = await actionGetItemByID(itemID)

    if (!existingItem) {
      throw Errors.ItemNotFound()
    }

    const updatedItem = await prisma.item.update({
      data: {
        ...validatedData,
      },
      where: {
        id: existingItem.data?.id,
        createdBy: session.user.id,
      },
    })

    revalidatePath('/point-of-sale')

    return { data: updatedItem, ok: true, error: null }
  } catch (error) {
    return handleActionStateError(error)
  }
}

export async function actionDeleteItem(
  itemId: number
): Promise<ActionState<null>> {
  try {
    const session = await actionGetSession()

    if (!session) {
      throw Errors.InvalidSession()
    }

    const existingItem = await prisma.item.findUnique({
      where: {
        id: itemId,
        createdBy: session.user.id,
      },
    })

    if (!existingItem) {
      throw Errors.ItemNotFound()
    }

    await prisma.item.delete({
      where: {
        id: existingItem.id,
        createdBy: session.user.id,
      },
    })

    revalidatePath('/point-of-sale')

    return { data: null, ok: true, error: null }
  } catch (error) {
    return handleActionStateError(error)
  }
}

// ItemLog actions
export async function actionGetItemBoughtLogs(): Promise<
  ActionState<ItemBoughtLog[]>
> {
  try {
    const session = await actionGetSession()

    if (!session) {
      throw Errors.InvalidSession()
    }

    const itemBoughtLogs = await prisma.itemBoughtLog.findMany({
      where: {
        createdBy: session.user.id,
      },
      orderBy: { id: 'asc' },
    })

    return { data: itemBoughtLogs, ok: true, error: null }
  } catch (error) {
    return handleActionStateError(error)
  }
}

export async function actionGetItemBoughtById(
  itemId: number
): Promise<ActionState<ItemBoughtLog | null>> {
  try {
    const session = await actionGetSession()

    if (!session) {
      throw Errors.InvalidSession()
    }

    const existingMember = await actionGetMemberByID(itemId)

    if (existingMember.data === null && existingMember.ok) {
      throw Errors.MemberNotFound()
    }

    const itemBought = await prisma.itemBoughtLog.findUnique({
      where: { id: itemId, createdBy: session.user.id },
    })

    return { data: itemBought, ok: true, error: null }
  } catch (error) {
    return handleActionStateError(error)
  }
}
