'use client'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import {
  actionCreateItem,
  actionUpdateItem,
  posItemSchema,
  PosItemSchema,
} from '../'
import { toast } from 'sonner'

type PosItemFormProps = {
  itemID?: number
  data?: PosItemSchema
  action: 'CREATE' | 'UPDATE'
}

export default function PosItemForm({
  itemID,
  data,
  action,
}: PosItemFormProps) {
  const form = useForm<PosItemSchema>({
    resolver: zodResolver(posItemSchema),
    defaultValues: {
      name: data?.name ?? '',
      price: data?.price ?? '0',
      stocks: data?.stocks ?? '0',
    },
  })

  async function onSubmit(values: PosItemSchema) {
    if (action === 'CREATE') {
      const { ok, error } = await actionCreateItem(values)

      if (!ok && error !== null) {
        toast.error(error.message)
        return
      }

      form.reset()
      toast.success('Item created successfully')
    }

    if (action === 'UPDATE' && itemID && data) {
      const { ok, error } = await actionUpdateItem({ itemID, data: values })

      if (!ok && error !== null) {
        toast.error(error.message)
      }

      toast.success('Item updated successfully')
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Item Name</FormLabel>
              <FormControl>
                <Input placeholder="Juice" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Item Price</FormLabel>
              <FormControl>
                <Input type="number" placeholder="30" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="stocks"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Stocks</FormLabel>
              <FormControl>
                <Input type="number" placeholder="150" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
