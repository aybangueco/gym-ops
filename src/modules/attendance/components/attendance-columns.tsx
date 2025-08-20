'use client'

import { ColumnDef } from '@tanstack/react-table'
import { AttendanceWithMember } from '../types'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { actionUpdateMemberAttendance } from '..'
import { toast } from 'sonner'

const AttendanceColumns: ColumnDef<AttendanceWithMember>[] = [
  {
    id: 'member.name',
    header: 'Name',
    cell: ({ row }) => {
      const attendance = row.original

      return (
        <p>{`${attendance.member.firstName} ${attendance.member.lastName}`}</p>
      )
    },
  },
  {
    id: 'member.email',
    header: 'Email',
    cell: ({ row }) => {
      const attendance = row.original

      return <p>{attendance.member.email}</p>
    },
  },
  {
    accessorKey: 'lastActive',
    header: 'Last session',
    cell: ({ row }) => {
      const date = new Date(row.getValue('lastActive'))

      if (!row.getValue('lastActive')) {
        return 'N/A'
      }

      const month = date.getMonth() + 1
      const day = date.getDate()
      const year = date.getFullYear()

      let hours = date.getHours()
      const minutes = String(date.getMinutes()).padStart(2, '0')
      const ampm = hours >= 12 ? 'PM' : 'AM'
      hours = hours % 12 || 12

      return `${month}-${day}-${year} - ${hours}:${minutes} ${ampm}`
    },
  },
  {
    accessorKey: 'activeSession',
    header: 'Status',
    cell: ({ row }) => {
      const attendance = row.original

      return (
        <p
          className={`${attendance.activeSession ? 'text-green-400' : 'text-destructive'}`}
        >
          {attendance.activeSession ? 'Active' : 'Inactive'}
        </p>
      )
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const attendance = row.original

      const onClickToggleSession = async () => {
        const { ok, error } = await actionUpdateMemberAttendance({
          memberId: attendance.memberId,
          activeSession: !attendance.activeSession,
        })

        if (!ok && error !== null) {
          toast.error(error.message)
          return
        }

        toast.success('Success')
      }

      return (
        <DropdownMenu>
          <DropdownMenuTrigger>...</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <AlertDialog>
                <AlertDialogTrigger className="w-full text-left">
                  {attendance.activeSession ? 'Make Inactive' : 'Make Active'}
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action will make {attendance.member.firstName} have
                      an {attendance.activeSession ? 'Inactive' : 'Active'}{' '}
                      session status.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={onClickToggleSession}>
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuItem>
            <DropdownMenuItem>Generate QR Code Attendance</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export default AttendanceColumns
