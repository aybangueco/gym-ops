'use server'

import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { SignInSchema, SignUpSchema } from './'

export async function actionGetSession() {
  return await auth.api.getSession({
    headers: await headers(),
  })
}

export async function actionSignInUser(
  inputData: SignInSchema
): Promise<{ ok: boolean; error: Error | null }> {
  try {
    await auth.api.signInEmail({
      body: { ...inputData },
      headers: await headers(),
    })

    return { ok: true, error: null }
  } catch (error) {
    console.error(error)

    if (error instanceof Error) {
      return { ok: false, error }
    }

    return { ok: false, error: new Error('Unknown error occured') }
  }
}

export async function actionSignUpUser(
  inputData: SignUpSchema
): Promise<{ ok: boolean; error: Error | null }> {
  try {
    await auth.api.signUpEmail({
      body: { ...inputData },
      headers: await headers(),
    })

    return { ok: true, error: null }
  } catch (error) {
    console.error(error)

    if (error instanceof Error) {
      return { ok: false, error }
    }

    return { ok: false, error: new Error('Unknown error occured') }
  }
}

export async function actionSignOutUser() {
  return await auth.api.signOut({
    headers: await headers(),
  })
}
