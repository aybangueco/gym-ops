import { Loader2 } from 'lucide-react'

export default function PageLoading() {
  return (
    <div className="bg-background flex h-screen w-full flex-col items-center justify-center">
      <Loader2 className="text-primary h-12 w-12 animate-spin" />
      <p className="text-foreground mt-4 text-lg font-medium">Loading...</p>
    </div>
  )
}
