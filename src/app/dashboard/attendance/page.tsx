import PageLoading from '@/components/reuseables/loading/page-loading'
import {
  actionGetAttendanceLogs,
  actionGetAttendances,
  AttendanceDataProvider,
} from '@/modules/attendance'
import AttendanceLogs from '@/modules/attendance/components/attendance-logs'
import AttendanceTabsTableList from '@/modules/attendance/components/attendance-tabs-table-list'
import { actionGetSession } from '@/modules/auth'
import { actionGetMembers } from '@/modules/members'
import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'Gym Ops | Attendance',
}

async function AttendanceInner() {
  const session = actionGetSession()

  if (!session) {
    redirect('/login')
  }

  const members = await actionGetMembers()
  const attendances = await actionGetAttendances()
  const attendanceLogs = await actionGetAttendanceLogs()

  return (
    <div className="p-3">
      <AttendanceDataProvider
        members={members.data?.filter((m) => m.memberStatus === 'ACTIVE') ?? []}
        attendances={attendances.data ?? []}
        attendanceLogs={attendanceLogs.data ?? []}
      >
        <header className="flex flex-col items-center justify-center">
          <h1 className="text-4xl font-bold">Manage Attendance</h1>
          <p className="">
            Manage members attendance in your gym and see who is currently
            active
          </p>
        </header>

        <section className="mt-10 p-3">
          <div className="bg-card rounded-lg border p-3">
            <h1 className="mb-5 text-2xl font-bold">
              Attendance Session Management
            </h1>
            <AttendanceTabsTableList />
          </div>
        </section>

        <section className="mt-10 p-3">
          <AttendanceLogs />
        </section>
      </AttendanceDataProvider>
    </div>
  )
}

export default function AttendancePage() {
  return (
    <Suspense fallback={<PageLoading />}>
      <AttendanceInner />
    </Suspense>
  )
}
