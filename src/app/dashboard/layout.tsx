import { DashboardSidebar } from '@/modules/dashboard'

export default async function DashboardLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="grid min-h-screen grid-cols-[auto_1fr] gap-3">
      <DashboardSidebar />
      <main>{children}</main>
    </div>
  )
}
