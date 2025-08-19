'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { useForm } from 'react-hook-form'
import { attendanceSchema, AttendanceSchema } from '../schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAttendanceDataContext } from './'
import { actionUpdateMemberAttendance } from '..'
import { toast } from 'sonner'

export default function ManualAttendanceForm() {
  const { attendances } = useAttendanceDataContext()

  const form = useForm<AttendanceSchema>({
    resolver: zodResolver(attendanceSchema),
    defaultValues: {
      memberId: '',
    },
  })

  async function onSubmit(values: AttendanceSchema) {
    const { ok, error } = await actionUpdateMemberAttendance({
      memberId: Number(values.memberId),
      activeSession: true,
    })

    if (!ok && error !== null) {
      toast.error(error.message)
      return
    }

    toast.success('Member marked as active')
  }

  return (
    <div className="bg-card flex max-w-[100%] min-w-[100%] flex-col items-center justify-center gap-5 rounded-lg border p-3">
      <div>
        <h1 className="text-2xl font-bold">Manual Attendance</h1>
      </div>

      <div className="w-full">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col items-center gap-3"
          >
            <FormField
              control={form.control}
              name="memberId"
              render={({ field }) => (
                <FormItem>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select members to mark as present" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="max-h-72 overflow-scroll">
                      {attendances
                        .filter((a) => a.member.memberStatus === 'ACTIVE')
                        .map((a) => (
                          <SelectItem
                            key={a.id}
                            value={a.memberId.toString()}
                          >{`${a.member.firstName} ${a.member.lastName} - ${a.activeSession ? 'Present' : 'Not Present'}`}</SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full" type="submit">
              Mark as active
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}
