'use client'

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'

type FormDialogProps = {
  children: React.ReactNode
}

export default function FormDialog({ children }: FormDialogProps) {
  return (
    <Dialog>
      <DialogTrigger className="w-full text-left">Edit</DialogTrigger>
      <DialogContent
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
        onPointerMove={(e) => e.stopPropagation()}
      >
        <DialogTitle />
        {children}
      </DialogContent>
    </Dialog>
  )
}
