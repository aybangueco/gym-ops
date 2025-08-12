export default async function AuthLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <main className="flex min-h-screen items-center justify-center p-3">
      {children}
    </main>
  )
}
