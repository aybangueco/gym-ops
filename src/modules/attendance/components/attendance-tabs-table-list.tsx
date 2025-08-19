'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAttendanceDataContext } from './attendance-data-provider'
import { DataTable } from '@/components/ui/data-table'
import AttendanceColumns from './attendance-columns'

export default function AttendanceTabsTableList() {
  const { attendances } = useAttendanceDataContext()

  return (
    <Tabs defaultValue="active" className="w-full">
      <TabsList>
        <TabsTrigger value="active">
          Active Sessions (
          {
            attendances.filter(
              (a) => a.activeSession && a.member.memberStatus === 'ACTIVE'
            ).length
          }
          )
        </TabsTrigger>
        <TabsTrigger value="inactive">
          Inactive Sessions (
          {
            attendances.filter(
              (a) => !a.activeSession && a.member.memberStatus === 'ACTIVE'
            ).length
          }
          )
        </TabsTrigger>
      </TabsList>
      <TabsContent value="active">
        <DataTable
          columns={AttendanceColumns}
          data={attendances.filter(
            (a) => a.activeSession && a.member.memberStatus === 'ACTIVE'
          )}
        />
      </TabsContent>
      <TabsContent value="inactive">
        <DataTable
          columns={AttendanceColumns}
          data={attendances.filter(
            (a) => !a.activeSession && a.member.memberStatus === 'ACTIVE'
          )}
        />
      </TabsContent>
    </Tabs>
  )
}
