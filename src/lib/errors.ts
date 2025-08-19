import { ActionState } from '@/modules/types'

// Error definitions
export const Errors = {
  InvalidSession: () => new Error('Invalid user session'),
  MemberNotFound: () => new Error('Member not found'),
  MembershipNotFound: () => new Error('Membership not found'),
}

// Error helpers
export function handleActionStateError<T>(error: unknown): ActionState<T> {
  console.error(error)

  if (error instanceof Error) {
    return { data: null, ok: false, error }
  }

  return { data: null, ok: false, error: new Error('Unknown error occured') }
}
