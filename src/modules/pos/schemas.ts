import z from 'zod'

export const posItemSchema = z.object({
  name: z.string().nonempty({ error: 'Item name is required' }),
  price: z.string().nonempty({ error: 'Price is required' }),
  stocks: z.string().nonempty({ error: 'Stocks is required' }),
})

export type PosItemSchema = z.infer<typeof posItemSchema>

export const posSelectMemberSchema = z.object({
  itemId: z
    .string()
    .nonempty({ error: 'Item is required' })
    .superRefine((id, ctx) => {
      const idTrim = id.trim()
      if (idTrim && Number.isNaN(Number(idTrim))) {
        ctx.addIssue({
          code: 'custom',
          message: 'Item id is invalid',
          path: ['itemID'],
        })
      }
    }),
  memberId: z.string().superRefine((id, ctx) => {
    const idTrim = id.trim()
    if (idTrim && Number.isNaN(Number(idTrim))) {
      ctx.addIssue({
        code: 'custom',
        message: 'Member id is invalid',
        path: ['memberId'],
      })
    }
  }),
  stocksBought: z
    .string()
    .superRefine((stocks, ctx) => {
      const stocksTrim = stocks.trim()
      if (stocksTrim && Number.isNaN(Number(stocksTrim))) {
        ctx.addIssue({
          code: 'custom',
          message: 'Member id is invalid',
          path: ['stocksBought'],
        })
      }

      if (Number(stocksTrim) < 1) {
        ctx.addIssue({
          code: 'custom',
          message: 'Stocks must be greater than 0',
          path: ['stocksBought'],
        })
      }
    })
    .nonempty({ error: 'Stocks Bought is required' }),
})

export type PosSelectMemberSchema = z.infer<typeof posSelectMemberSchema>
