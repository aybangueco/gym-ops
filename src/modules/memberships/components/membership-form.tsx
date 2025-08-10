'use client'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import {
  actionCreateMembership,
  actionUpdateMembership,
  membershipSchema,
  MembershipSchema
} from '../'
import { Membership } from '@/generated/prisma'
import toast from 'react-hot-toast'

type MembershipFormProps = {
  id?: number
  data?: Membership
  state: 'CREATE' | 'UPDATE'
}

export default function MembershipForm({
  id,
  data,
  state
}: MembershipFormProps) {
  const form = useForm<MembershipSchema>({
    resolver: zodResolver(membershipSchema),
    defaultValues: {
      name: data?.name ?? '',
      length: data?.length.toString() ?? '',
      price: data?.price.toString() ?? ''
    }
  })

  async function onSubmit(values: MembershipSchema) {
    if (state === 'CREATE') {
      try {
        await actionCreateMembership(values)
        toast.success('Membership created successfully')
        form.reset()
      } catch (_) {
        toast.error('Error ceating membership')
      }
    }

    if (state === 'UPDATE' && id) {
      try {
        await actionUpdateMembership({ id, inputData: values })
        toast.success('Membership updated successfully')
      } catch (_) {
        toast.error('Error updating membership')
      }
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mb-5 space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Membership Name</FormLabel>
              <FormControl>
                <Input placeholder="Monthly" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="length"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Membership Length</FormLabel>
              <FormControl>
                <Input type="number" placeholder="30" {...field} />
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
              <FormLabel>Membership Price</FormLabel>
              <FormControl>
                <Input type="number" placeholder="700" {...field} />
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
