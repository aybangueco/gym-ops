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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import {
  actionCreateMember,
  actionUpdateMember,
  memberSchema,
  MemberSchema,
  useMemberDataContext,
} from '../'
import { toast } from 'sonner'
import MemberStatusSelect from './member-status-select'

type MemberFormProps = {
  memberID?: number
  data?: MemberSchema
  action: 'CREATE' | 'UPDATE'
}

export default function MemberForm({
  memberID,
  data,
  action,
}: MemberFormProps) {
  const { memberships } = useMemberDataContext()

  const form = useForm<MemberSchema>({
    resolver: zodResolver(memberSchema),
    defaultValues: {
      firstName: data?.firstName ?? '',
      lastName: data?.lastName ?? '',
      email: data?.email ?? '',
      mobileNumber: data?.mobileNumber ?? '',
      membershipId: data?.membershipId ?? '',
      memberStatus: data?.memberStatus ?? 'INACTIVE',
    },
  })

  async function onSubmit(values: MemberSchema) {
    if (action === 'CREATE') {
      const { ok, error } = await actionCreateMember(values)

      if (!ok && error != null) {
        toast.error(error.message)
        return
      }

      form.reset()
      toast.success('Member created successfully')
    }

    if (action === 'UPDATE' && memberID && data) {
      const { ok, error } = await actionUpdateMember({
        memberID,
        values,
      })

      if (!ok && error != null) {
        toast.error(error.message)
        return
      }

      toast.success('Member updated successfully')
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(async (data) => await onSubmit(data))}
        className="space-y-8"
      >
        <div className="grid grid-cols-2 gap-3">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter first name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter last name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Enter email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="mobileNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mobile number (optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Enter mobile number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex gap-3">
          <FormField
            control={form.control}
            name="membershipId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Membership</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select member status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">None</SelectItem>
                      {memberships.map((m, i) => (
                        <SelectItem key={i} value={m.id.toString()}>
                          {m.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="memberStatus"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Member Status</FormLabel>
                <FormControl>
                  <MemberStatusSelect field={field} />
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
