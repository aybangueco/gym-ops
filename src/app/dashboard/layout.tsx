import { SidebarNav } from '@/modules/dashboard'

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <main className="grid grid-cols-[auto_1fr]">
      <SidebarNav />
      <section className="h-full">{children}</section>
    </main>
  )
}
