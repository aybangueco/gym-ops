'use server'

import { Errors, handleActionStateError } from '@/lib/errors'
import { ActionState } from '../types'
import { Item, ItemBoughtLog } from '@/generated/prisma'
import prisma from '@/lib/prisma'
import { actionGetSession } from '../auth'
import {
  PosItemSchema,
  posItemSchema,
  posSelectMemberSchema,
  PosSelectMemberSchema,
} from './schemas'
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

    if (!existingItem.data) {
      throw Errors.ItemNotFound()
    }

    existingItem.data.name = validatedData.name
    existingItem.data.stocks = Number(validatedData.stocks)
    existingItem.data.price = Number(validatedData.price)

    const updatedItem = await prisma.item.update({
      data: {
        name: existingItem.data.name,
        stocks: existingItem.data.stocks,
        price: existingItem.data.price,
      },
      where: {
        id: existingItem.data.id,
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

export async function actionCreateItemBought(
  data: PosSelectMemberSchema
): Promise<ActionState<null>> {
  try {
    const session = await actionGetSession()

    if (!session) {
      throw Errors.InvalidSession()
    }

    const validatedData = posSelectMemberSchema.parse(data)

    const isMemberIdEmpty =
      validatedData.memberId === '0' || validatedData.memberId === ''

    const existingMember = await actionGetMemberByID(
      Number(validatedData.memberId)
    )

    if (existingMember.data === null && !isMemberIdEmpty) {
      throw Errors.MemberNotFound()
    }

    await prisma.$transaction(async (tx) => {
      // Create item log
      await tx.itemBoughtLog.create({
        data: {
          itemId: Number(validatedData.itemId),
          boughtBy: isMemberIdEmpty ? null : Number(validatedData.memberId),
          stocksBought: Number(validatedData.stocksBought),
          createdBy: session.user.id,
        },
      })

      await tx.item.update({
        data: {
          stocks: { decrement: Number(validatedData.stocksBought) },
        },
        where: {
          id: Number(validatedData.itemId),
        },
      })
    })

    revalidatePath('/point-of-sale')

    return { data: null, ok: true, error: null }
  } catch (error) {
    return handleActionStateError(error)
  } finally {
    await prisma.$disconnect()
  }
}

export async function actionUpdateItemBought({
  itemBoughtId,
  data,
}: {
  itemBoughtId: number
  data: PosSelectMemberSchema
}): Promise<ActionState<ItemBoughtLog>> {
  try {
    const session = await actionGetSession()

    if (!session) {
      throw Errors.InvalidSession()
    }

    const existingItemBought = await actionGetItemBoughtById(itemBoughtId)

    if (existingItemBought.data === null) {
      throw Errors.ItemNotFound()
    }

    const validatedData = posSelectMemberSchema.parse(data)

    existingItemBought.data.itemId = Number(validatedData.itemId)
    existingItemBought.data.boughtBy = Number(validatedData.memberId)
    existingItemBought.data.stocksBought = Number(validatedData.stocksBought)

    const updatedItemBoughtLog = await prisma.itemBoughtLog.update({
      data: {
        itemId: existingItemBought.data.itemId,
        boughtBy: existingItemBought.data.boughtBy,
        stocksBought: existingItemBought.data.stocksBought,
      },
      where: {
        id: itemBoughtId,
      },
    })

    revalidatePath('/point-of-sale')

    return { data: updatedItemBoughtLog, ok: true, error: null }
  } catch (error) {
    return handleActionStateError(error)
  }
}

export async function actionDeleteItemBought(
  itemBoughtId: number
): Promise<ActionState<null>> {
  try {
    const session = await actionGetSession()

    if (!session) {
      throw Errors.InvalidSession()
    }

    const existingItemBought = await actionGetItemBoughtById(itemBoughtId)

    if (existingItemBought.data === null) {
      throw Errors.ItemNotFound()
    }

    await prisma.itemBoughtLog.delete({
      where: {
        id: itemBoughtId,
      },
    })

    return { data: null, ok: true, error: null }
  } catch (error) {
    return handleActionStateError(error)
  }
}
