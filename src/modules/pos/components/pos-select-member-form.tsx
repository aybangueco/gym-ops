'use client'

import { usePosDataContext } from './pos-data-provider'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  actionCreateItemBought,
  posSelectMemberSchema,
  PosSelectMemberSchema,
} from '../'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

export default function PosSelectMemberForm() {
  const { members, items } = usePosDataContext()

  const form = useForm<PosSelectMemberSchema>({
    resolver: zodResolver(posSelectMemberSchema),
    defaultValues: {
      itemId: '',
      memberId: '0',
      stocksBought: '0',
    },
  })

  async function onSubmit(values: PosSelectMemberSchema) {
    const { ok, error } = await actionCreateItemBought(values)

    if (!ok && error !== null) {
      toast.error(error.message)
      return
    }

    form.reset()
    toast.success('Item Bought Log Added Successfully')
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex gap-3 space-x-0">
          <FormField
            control={form.control}
            name="itemId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Item</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select item" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {items.map((i) => (
                      <SelectItem key={i.id} value={i.id.toString()}>
                        {i.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="memberId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Member</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select item" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="0">Non Member</SelectItem>
                    {members.map((m) => (
                      <SelectItem key={m.id} value={m.id.toString()}>
                        {`${m.firstName} ${m.lastName}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="stocksBought"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Stocks bought</FormLabel>
              <FormControl>
                <Input placeholder="Enter stocks" type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={form.formState.isSubmitting} type="submit">
          {form.formState.isSubmitting ? 'Submitting...' : 'Submit'}
        </Button>
      </form>
    </Form>
  )
}
