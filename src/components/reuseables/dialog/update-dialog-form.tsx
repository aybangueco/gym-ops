import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { ReactNode } from 'react'

type UpdateDialogFormProps = {
  title: string
  description: string
  children: ReactNode
}

export default function UpdateDialogForm({
  title,
  description,
  children,
}: UpdateDialogFormProps) {
  return (
    <Dialog>
      <DialogTrigger className="w-full text-start">Edit</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">{title}</DialogTitle>
          <DialogDescription className="mb-5 text-center">
            {description}
          </DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  )
}
