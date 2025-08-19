'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { AttendanceType } from '@/generated/prisma'

interface AttendanceLog {
  id: number
  memberName: string
  type: AttendanceType
  timestamp: string
}

const logs: AttendanceLog[] = [
  {
    id: 1,
    memberName: 'John Doe',
    type: 'SESSION_STARTED',
    timestamp: '2025-08-19T09:30:00',
  },
  {
    id: 2,
    memberName: 'John Doe',
    type: 'SESSION_ENDED',
    timestamp: '2025-08-19T11:45:00',
  },
  {
    id: 3,
    memberName: 'Jane Smith',
    type: 'SESSION_STARTED',
    timestamp: '2025-08-19T14:00:00',
  },
]

export default function AttendanceLogs() {
  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-bold">Attendance Logs</h1>
      <div className="space-y-4">
        {logs.map((log) => {
          return (
            <Card key={log.id} className="shadow-md">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>{log.memberName}</CardTitle>
                <Badge
                  variant={
                    log.type === 'SESSION_STARTED' ? 'default' : 'secondary'
                  }
                >
                  {log.type === 'SESSION_STARTED' ? 'Started' : 'Ended'}
                </Badge>
              </CardHeader>
              <Separator />
              <CardContent className="pt-4">
                {log.type === 'SESSION_STARTED' ? (
                  <p className="font-medium text-green-600">
                    ✅ {log.memberName} has started session at
                  </p>
                ) : (
                  <p className="font-medium text-red-600">
                    🛑 {log.memberName} has ended session at
                  </p>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
