import PageLoading from '@/components/reuseables/loading/page-loading'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { actionGetSession } from '@/modules/auth'
import {
  actionCountActiveMembers,
  actionCountActiveSession,
  actionCountExpiringMembers,
  actionCountMembers,
} from '@/modules/dashboard'
import { Clock, TrendingUp, UserCheck, Users } from 'lucide-react'
import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'Gym Ops | Dashboard',
}

async function DashboardInner() {
  const session = await actionGetSession()

  if (!session) {
    redirect('/login')
  }

  const now = new Date()
  const sevenDaysFromNow = new Date()
  sevenDaysFromNow.setDate(now.getDate() + 7)

  const totalActiveSession = await actionCountActiveSession()
  const totalMembers = await actionCountMembers()
  const totalActiveMembers = await actionCountActiveMembers()
  const totalExpiringMembers = await actionCountExpiringMembers()

  return (
    <section className="space-y-6 p-6">
      <header className="flex flex-col items-center justify-center space-y-2">
        <div className="flex items-center space-x-2">
          <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
          <Badge variant="secondary" className="text-xs">
            {totalActiveSession.data} Members Online
          </Badge>
        </div>
        <h1 className="from-foreground to-muted-foreground bg-gradient-to-r bg-clip-text text-4xl font-bold tracking-tight text-transparent">
          Welcome, {session.user.name}!
        </h1>
        <p className="text-muted-foreground max-w-2xl text-center">
          Monitor your membership analytics and track key performance indicators
        </p>
      </header>

      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Total Members Card */}
        <Card className="from-background to-muted/20 relative overflow-hidden border-0 bg-gradient-to-br shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              Total Members
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20">
              <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalMembers.data?.toLocaleString()}
            </div>
            <p className="text-muted-foreground mt-1 text-xs">
              Total registered members
            </p>
          </CardContent>
          <div className="absolute top-0 right-0 -mt-8 -mr-8 h-16 w-16 rounded-full bg-blue-500/5" />
        </Card>

        {/* Active Members Card */}
        <Card className="from-background to-muted/20 relative overflow-hidden border-0 bg-gradient-to-br shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              Active Members
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
              <UserCheck className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalActiveMembers.data?.toLocaleString()}
            </div>
            <div className="mt-1 flex items-center space-x-2">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <p className="text-muted-foreground text-xs">
                Currently active subscriptions
              </p>
            </div>
          </CardContent>
          <div className="absolute top-0 right-0 -mt-8 -mr-8 h-16 w-16 rounded-full bg-green-500/5" />
        </Card>

        {/* Expiring Members Card */}
        <Card className="from-background to-muted/20 relative overflow-hidden border-0 bg-gradient-to-br shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              Expiring Soon
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/20">
              <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalExpiringMembers.data?.toLocaleString()}
            </div>
            <div className="mt-1 flex items-center space-x-2">
              <Badge
                variant="outline"
                className="border-amber-200 text-xs text-amber-700 dark:border-amber-800 dark:text-amber-300"
              >
                Needs Attention
              </Badge>
            </div>
            <p className="text-muted-foreground mt-1 text-xs">
              Memberships expiring this month
            </p>
          </CardContent>
          <div className="absolute top-0 right-0 -mt-8 -mr-8 h-16 w-16 rounded-full bg-amber-500/5" />
        </Card>
      </div>

      {/* Quick Actions Section */}
      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Quick Overview</h2>
          <Badge variant="secondary" className="text-xs">
            Last updated: {new Date().toLocaleTimeString()}
          </Badge>
        </div>

        <Card className="from-background to-muted/10 border-0 bg-gradient-to-r shadow-sm">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 gap-4 text-center md:grid-cols-3">
              <div className="space-y-1">
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {totalActiveMembers.data && totalMembers.data
                    ? Math.round(
                        (totalActiveMembers.data / totalMembers.data) * 100
                      )
                    : 0}
                  %
                </p>
                <p className="text-muted-foreground text-sm">Active Rate</p>
              </div>
              <div className="border-border/50 space-y-1 border-x px-4">
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {totalMembers.data || 0}
                </p>
                <p className="text-muted-foreground text-sm">Total Growth</p>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                  {totalExpiringMembers.data || 0}
                </p>
                <p className="text-muted-foreground text-sm">Action Required</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<PageLoading />}>
      <DashboardInner />
    </Suspense>
  )
}
