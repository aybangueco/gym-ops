import { Member } from '@/generated/prisma'
import { AttendanceLogsWithAttendance } from '../types'
import { ScrollArea } from '@/components/ui/scroll-area'
import { LogIn, LogOut } from 'lucide-react'

type AttendanceLogContentProps = {
  attendanceLogs: AttendanceLogsWithAttendance[]
  members: Member[]
}

export default function AttendanceLogContent({
  attendanceLogs,
  members,
}: AttendanceLogContentProps) {
  return (
    <ScrollArea className="h-72 max-h-72">
      {attendanceLogs.length > 0 ? (
        <div className="flex flex-col gap-3">
          {attendanceLogs.map((log, idx) => {
            const isStart = log.attendanceType === 'SESSION_STARTED'
            return (
              <div
                key={idx}
                className="hover:bg-muted/50 flex items-center gap-2 rounded-lg border p-2 transition-colors"
              >
                {isStart ? (
                  <LogIn className="h-5 w-5 text-green-500" />
                ) : (
                  <LogOut className="h-5 w-5 text-red-500" />
                )}
                <p className="text-muted-foreground text-sm">
                  <span className="font-medium">
                    {
                      members.find((m) => m.id === log.attendance.memberId)
                        ?.firstName
                    }{' '}
                    {
                      members.find((m) => m.id === log.attendance.memberId)
                        ?.lastName
                    }
                  </span>{' '}
                  {isStart ? 'timed in' : 'timed out'} at{' '}
                  {log.createdAt.toLocaleString()}
                </p>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="text-center">
          <p className="text-sm">No results found.</p>
        </div>
      )}
    </ScrollArea>
  )
}
