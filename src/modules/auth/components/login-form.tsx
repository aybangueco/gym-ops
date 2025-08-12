'use client'

import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoginSchema, loginSchema, signInUser } from '..'
import toast from 'react-hot-toast'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function LoginForm() {
  const [isLoginLoading, setIsLoginLoading] = useState<boolean>(false)
  const router = useRouter()
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const onSubmit = async (inputData: LoginSchema) => {
    const { email, password } = inputData

    try {
      setIsLoginLoading(true)
      await signInUser({ email, password })
    } catch (_) {
      toast.error('Unknown error occured')
    } finally {
      setIsLoginLoading(false)
    }
  }

  return (
    <div className="bg-card w-md rounded-lg p-6 shadow-md">
      <h2 className="text-primary mb-6 text-center text-2xl font-bold">
        Login
      </h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="juantamad@gmail.com.ph"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-col gap-2">
            <Button disabled={isLoginLoading} type="submit" className="w-full">
              {isLoginLoading ? 'Submitting...' : 'Login'}
            </Button>
            <Button
              disabled={isLoginLoading}
              onClick={() => router.push('/register')}
              variant="link"
              className="w-full"
              type="button"
            >
              Don&apos;t have account? Register here.
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
