import { ActionState } from '@/modules/types'

export function handleActionStateError<T>(error: unknown): ActionState<T> {
  console.error(error)

  if (error instanceof Error) {
    return { data: null, ok: false, error }
  }

  return { data: null, ok: false, error: new Error('Unknown error occured') }
}
