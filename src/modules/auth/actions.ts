'use server'

import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { SignInSchema, SignUpSchema } from './'
import { ActionState } from '../types'
import { handleActionStateError } from '@/lib/errors'

export async function actionGetSession() {
  return await auth.api.getSession({
    headers: await headers(),
  })
}

export async function actionSignInUser(
  inputData: SignInSchema
): Promise<ActionState<null>> {
  try {
    await auth.api.signInEmail({
      body: { ...inputData },
      headers: await headers(),
    })

    return { data: null, ok: true, error: null }
  } catch (error) {
    return handleActionStateError(error)
  }
}

export async function actionSignUpUser(
  inputData: SignUpSchema
): Promise<ActionState<null>> {
  try {
    await auth.api.signUpEmail({
      body: { ...inputData },
      headers: await headers(),
    })

    return { data: null, ok: true, error: null }
  } catch (error) {
    return handleActionStateError(error)
  }
}

export async function actionSignOutUser() {
  return await auth.api.signOut({
    headers: await headers(),
  })
}
