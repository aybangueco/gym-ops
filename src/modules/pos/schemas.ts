import z from 'zod'

export const posItemSchema = z.object({
  name: z.string().nonempty({ error: 'Item name is required' }),
  price: z.string().nonempty({ error: 'Price is required' }),
  stocks: z.string().nonempty({ error: 'Stocks is required' }),
})

export type PosItemSchema = z.infer<typeof posItemSchema>
