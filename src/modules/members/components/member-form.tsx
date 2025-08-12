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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import {
  actionCreateMember,
  actionUpdateMember,
  memberSchema,
  MemberSchema
} from '../'
import toast from 'react-hot-toast'
import { useMemberDataContext } from './member-data-provider'

type MemberFormProps = {
  id?: number
  data?: MemberSchema
  state: 'CREATE' | 'UPDATE'
}

export default function MemberForm({ id, data, state }: MemberFormProps) {
  const { memberships } = useMemberDataContext()

  const form = useForm<MemberSchema>({
    resolver: zodResolver(memberSchema),
    defaultValues: {
      name: data?.name ?? '',
      email: data?.email ?? '',
      membershipId: data?.membershipId ?? ''
    }
  })

  async function onSubmit(values: MemberSchema) {
    if (state === 'CREATE') {
      try {
        await actionCreateMember(values)
        toast.success('Member created successfully')
      } catch (error) {
        toast.error('Error creating member')
      }
    }

    if (state === 'UPDATE' && id) {
      const { ok, error } = await actionUpdateMember({ id, inputData: values })

      if (!ok && error) {
        toast.error('Error updating member')
        return
      }

      toast.success('Member updated successfully')
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
              <FormLabel>Member Name</FormLabel>
              <FormControl>
                <Input placeholder="Juan Tamad" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Member Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="juantamad@gmail.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="membershipId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Membership</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select membership" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {memberships.map((m, i) => (
                    <SelectItem key={i} value={m.id.toString()}>
                      {m.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
