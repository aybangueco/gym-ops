'use client'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { useState } from 'react'

type DeleteDialogProps = {
  itemName: string
  deleteFn: () => Promise<void>
}

export default function DeleteDialog({
  itemName,
  deleteFn,
}: DeleteDialogProps) {
  const [isActive, setIsActive] = useState<boolean>(false)
  const [isDeletePending, setIsDeletePending] = useState<boolean>(false)

  return (
    <AlertDialog open={isActive}>
      <AlertDialogTrigger
        className="w-full text-start"
        onClick={() => setIsActive(true)}
      >
        Delete
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to delete {itemName}?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete{' '}
            {itemName} from our server.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={isDeletePending}
            onClick={() => setIsActive(false)}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              setIsDeletePending(true)
              deleteFn().finally(() => {
                setIsActive(false)
                setIsDeletePending(false)
              })
            }}
          >
            {isDeletePending ? 'Deleting...' : 'Confirm'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
