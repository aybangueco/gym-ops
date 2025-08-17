import { SidebarNav } from '@/modules/dashboard'

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <main className="grid grid-cols-[auto_1fr]">
      <SidebarNav />
      <section className="max-h-screen min-h-screen overflow-scroll">
        {children}
      </section>
    </main>
  )
}
