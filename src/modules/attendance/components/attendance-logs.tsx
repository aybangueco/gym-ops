'use client'

import { useAttendanceDataContext } from './attendance-data-provider'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import AttendanceLogContent from './attendance-log-content'

function isToday(date: Date) {
  const today = new Date()
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  )
}

function isThisWeek(date: Date) {
  const now = new Date()
  const firstDay = new Date(now)
  firstDay.setDate(now.getDate() - now.getDay())
  firstDay.setHours(0, 0, 0, 0)

  const lastDay = new Date(firstDay)
  lastDay.setDate(firstDay.getDate() + 6)
  lastDay.setHours(23, 59, 59, 999)

  return date >= firstDay && date <= lastDay
}

function isThisMonth(date: Date) {
  const now = new Date()
  return (
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()
  )
}

export default function AttendanceLogs() {
  const { attendanceLogs, members } = useAttendanceDataContext()

  return (
    <Card className="rounded-xl shadow-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Attendance Logs</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="today" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="this-week">This Week</TabsTrigger>
            <TabsTrigger value="this-month">This Month</TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            <AttendanceLogContent
              attendanceLogs={attendanceLogs}
              members={members}
            />
          </TabsContent>
          <TabsContent value="today">
            <AttendanceLogContent
              attendanceLogs={attendanceLogs.filter((log) =>
                isToday(new Date(log.createdAt))
              )}
              members={members}
            />
          </TabsContent>
          <TabsContent value="this-week">
            <AttendanceLogContent
              attendanceLogs={attendanceLogs.filter((log) =>
                isThisWeek(new Date(log.createdAt))
              )}
              members={members}
            />
          </TabsContent>
          <TabsContent value="this-month">
            <AttendanceLogContent
              attendanceLogs={attendanceLogs.filter((log) =>
                isThisMonth(new Date(log.createdAt))
              )}
              members={members}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
