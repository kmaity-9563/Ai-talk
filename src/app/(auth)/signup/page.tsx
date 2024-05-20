"use client"
import React, { useEffect, useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useDebounceValue } from 'usehooks-ts'
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/ApiResponse'
import { signupSchema } from '@/schemas/signupSchema'
import { z } from "zod"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Loader2 } from 'lucide-react'
import Link from 'next/link';

const SignupForm = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [usernamemessage, setUsernamemessage] = useState('')
  const [loading, setLoading] = useState(false)
  const debouncedUsername = useDebounceValue(username, 500)
  const [isSubmiting, setIsSubmiting] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  })

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (debouncedUsername) {
        setLoading(true)
        setUsernamemessage('')
        try {
          const response = await axios.get<ApiResponse>(`/api/check-unique-user?username=${debouncedUsername}`)
          setUsernamemessage(response.data.message)
        } catch (error) {
          const Axioserror = error as AxiosError<ApiResponse>
          setUsernamemessage(Axioserror.response?.data.message ?? 'axios error')
        } finally {
          setLoading(false)
        }
      }
    }
    checkUsernameUnique()
  }, [debouncedUsername])

  const onSubmit = async (value: z.infer<typeof signupSchema>) => {
    setIsSubmiting(true)
    try {
      const response = await axios.post(`/api/sign-up`, value)
      toast({
        title: "signup successful",
        description: response.data.message,
      })
      router.replace(`/verify/${username}`)
    } catch (error) {
      const Axioserror = error as AxiosError<ApiResponse>
      toast({
        title: "signup successful",
        description: Axioserror.response?.data.message ?? 'axios error',
        variant: 'destructive'
      })
    } finally {
      setIsSubmiting(false)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join True Feedback
          </h1>
          <p className="mb-4">Sign up to start your anonymous adventure</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      //  onChange={(e) => {
                      //   field.onChange(e);
                      //   setUsername(e.target.value);
                      // }}
                      placeholder="username"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>email</FormLabel>
                  <FormControl>
                    <Input placeholder="email" {...field} />
                  </FormControl>
                  {loading && <Loader2 className="animate-spin" />}
                  {!loading && usernamemessage && (
                    <p
                      className={`text-sm ${
                        usernamemessage === 'Username is unique'
                          ? 'text-green-500'
                          : 'text-red-500'
                      }`}
                    >
                      {usernamemessage}
                    </p>
               )}
               <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>password</FormLabel>
                  <FormControl>
                    <Input placeholder="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmiting} >
              {
                isSubmiting ? (<>
                  <Loader2 className='animate-spin ' />
                </>) :
                  ('sign up')
              }
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            Already a member?{' '}
            <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default SignupForm
