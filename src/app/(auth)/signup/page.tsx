'use client';

import React, { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useDebounceCallback } from 'usehooks-ts';
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/types/ApiResponse';
import { signupSchema } from '@/schemas/signupSchema';
import { z } from 'zod';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

const SignupForm = () => {
  const [username, setUsername] = useState('');
  const [usernamemessage, setUsernamemessage] = useState('');
  const [loading, setLoading] = useState(false);
  const debounce = useDebounceCallback(setUsername, 500);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (username) {
        setLoading(true);
        setUsernamemessage('');
        try {
          const response = await axios.get<ApiResponse>(
            `/api/check-unique-user?username=${username}`
          );
          console.log(response.data);
          setUsernamemessage(response.data.message);
        } catch (error) {
          const Axioserror = error as AxiosError<ApiResponse>;
          setUsernamemessage(
            Axioserror.response?.data.message ?? 'axios error'
          );
        } finally {
          setLoading(false);
        }
      }
    };
    checkUsernameUnique();
  }, [username]);

  const onSubmit = async (value: z.infer<typeof signupSchema>) => {
    setIsSubmitting(true);
    try {
      console.log('value', value);
      const response = await axios.post<ApiResponse>('/api/signup', value);
      console.log('response ', response.data);
      toast({
        title: 'Signup successful',
        description: response.data.message,
      });
      router.replace(`/verify/${value.username}`);
    } catch (error) {
      const Axioserror = error as AxiosError<ApiResponse>;
      toast({
        title: 'Signup failed',
        description: Axioserror.response?.data.message || 'axios error',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
                      placeholder="username"
                      {...field}
                      onChange={(event) => {
                        field.onChange(event);
                        debounce(event.target.value);
                      }}
                    />
                  </FormControl>
                  {loading && <Loader2 className="animate-spin" />}
                  {!loading && usernamemessage && (
                    <p
                      className={`text-sm ${usernamemessage === 'Username is unique'
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
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="email" {...field} />
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
                    <Input type="password" placeholder="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="animate-spin" /> : 'Sign up'}
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
  );
};

export default SignupForm;
