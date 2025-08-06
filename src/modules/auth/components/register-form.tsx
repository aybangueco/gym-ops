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
import { RegisterSchema, registerSchema, signUpUser } from '..'
import toast from 'react-hot-toast'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function RegisterForm() {
  const [isRegisterLoading, setIsRegisterLoading] = useState<boolean>(false)
  const router = useRouter()
  const form = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  })

  const onSubmit = async (inputData: RegisterSchema) => {
    const { name, email, password } = inputData

    try {
      setIsRegisterLoading(true)
      await signUpUser({ name, email, password })
    } catch (_) {
      toast.error('Unknown error occured')
    } finally {
      setIsRegisterLoading(false)
    }
  }

  return (
    <div className="bg-card w-md rounded-lg p-6 shadow-md">
      <h2 className="text-primary mb-6 text-center text-2xl font-bold">
        Register
      </h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Juan Tamad" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Confirm your password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-col gap-2">
            <Button
              disabled={isRegisterLoading}
              type="submit"
              className="w-full"
            >
              {isRegisterLoading ? 'Submitting...' : 'Register'}
            </Button>
            <Button
              disabled={isRegisterLoading}
              onClick={() => router.push('/login')}
              variant="link"
              className="w-full"
              type="button"
            >
              Already have account? Login here.
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
