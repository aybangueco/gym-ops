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
  actionCreateMembership,
  actionUpdateMembership,
  membershipSchema,
  MembershipSchema,
} from '../'
import { toast } from 'sonner'

type MembershipFormProps = {
  membershipID?: number
  data?: MembershipSchema
  action: 'CREATE' | 'UPDATE'
}

export default function MembershipForm({
  membershipID,
  data,
  action,
}: MembershipFormProps) {
  const form = useForm<MembershipSchema>({
    resolver: zodResolver(membershipSchema),
    defaultValues: {
      name: data?.name ?? '',
      cost: data?.cost ?? '',
      length: data?.length ?? '',
    },
  })

  async function onSubmit(values: MembershipSchema) {
    if (action === 'CREATE') {
      const { ok, error } = await actionCreateMembership(values)

      if (!ok && error != null) {
        toast.error('Error creating membership')
        return
      }

      form.reset()
      toast.success('Membership created successfully')
    }

    if (action === 'UPDATE' && membershipID && data) {
      const { ok, error } = await actionUpdateMembership({
        membershipID,
        values,
      })

      if (!ok && error != null) {
        toast.error('Error updating membership')
        return
      }

      toast.success('Membership updated successfully')
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(async (data) => await onSubmit(data))}
        className="space-y-8"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Membership Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter membership name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 items-center gap-2">
          <FormField
            control={form.control}
            name="length"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Membership Length</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter membership length"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="cost"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Membership Cost</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter membership cost"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button disabled={form.formState.isSubmitting} type="submit">
          Submit
        </Button>
      </form>
    </Form>
  )
}
