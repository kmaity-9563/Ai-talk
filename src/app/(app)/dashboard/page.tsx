"use client"
import React, { useCallback, useEffect, useRef, useState } from 'react'
import axios, { AxiosError } from 'axios';
import { useForm } from 'react-hook-form';
import { ApiResponse } from '@/types/ApiResponse';
import { Message } from '@prisma/client';
import { toast } from '@/components/ui/use-toast';
import { useSession } from 'next-auth/react';
import MessageCard from '@/components/MessageCard';
import { Separator } from "@/components/ui/separator"
import { User } from 'next-auth';
import { Button } from '@/components/ui/button';
import { Switch } from "@/components/ui/switch"
import { Loader2, RefreshCcw } from 'lucide-react';

const Page = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const { watch, register, setValue } = useForm();
  const acceptMessages = watch('acceptMessages');
  const { data: session } = useSession();
  const urlRef = useRef(null)

  const isAcceptingMessage = useCallback(async () => {
    setIsSwitchLoading(true);
    setLoading(true);
    try {
      const res = await axios.get<ApiResponse>('/api/accept-message');
      console.log("data ", res.data);
      setValue('acceptMessages', res.data.isAccepted);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description: axiosError?.message || "Error during checking if accepting messages",
        variant: "destructive"
      });
    } finally {
      setIsSwitchLoading(false);
      setLoading(false);
    }
  }, [setValue]);

  const getMessages = useCallback(async (refresh : boolean = false) => {
    setLoading(true);
    try {
      const res = await axios.get<ApiResponse>('/api/get-message');
      console.log("res data", res.data.messages);
      setMessages(res.data?.messages || []);
      if(refresh){
        toast({
          title: res.data.message,
          variant: 'default',
        });
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description: axiosError?.message || "Error during fetching messages",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [setMessages]);

  useEffect(() => {
    if (!session || !session?.user) return;
    isAcceptingMessage();
    getMessages();
  }, [session, isAcceptingMessage, getMessages]);

  const handleDeleteMessage = async (messageId: string) => {
    setMessages(messages.filter((message) => message.id !== messageId));
  }

  const handleSwitchChange = async () => {
    try {
      const res = await axios.post<ApiResponse>('/api/accept-message', {
        acceptMessages: !acceptMessages
      });
      console.log("data ", res.data);
      setValue('acceptMessages', res.data.isAccepted);
      toast({
        title: res.data.message,
        variant: 'default',
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description: axiosError?.message || "Error during updating message acceptance",
        variant: "destructive"
      });
    }
  }

  const {username} = session?.user as User

  const baseurl = `${window.location.protocol}//${window.location.host}`
  const profileUrl = `${baseurl}/undefined/${username}`

  const copyToClipboard = async () => {
    urlRef.current?.select()
    navigator.clipboard.writeText(profileUrl)
  }

  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
    <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

    <div className="mb-4">
      <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{' '}
      <div className="flex items-center">
        <input
          type="text"
          ref={urlRef}
          value={profileUrl}
          disabled
          className="input input-bordered w-full p-2 mr-2"
        />
        <Button onClick={copyToClipboard}>Copy</Button>
      </div>
    </div>

    <div className="mb-4">
      <Switch
        {...register('acceptMessages')}
        checked={acceptMessages}
        onCheckedChange={handleSwitchChange}
        disabled={isSwitchLoading}
      />
      <span className="ml-2">
        Accept Messages: {acceptMessages ? 'On' : 'Off'}
      </span>
    </div>
    <Separator />

    <Button
      className="mt-4"
      variant="outline"
      onClick={(e) => {
        e.preventDefault();
        getMessages(true);
      }}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <RefreshCcw className="h-4 w-4" />
      )}
    </Button>
    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
      {messages.length > 0 ? (
        messages.map((message, index) => (
          <MessageCard
            key={message.id}
            message={message}
            onMessagDelete={handleDeleteMessage}
          />
        ))
      ) : (
        <p>No messages to display.</p>
      )}
    </div>
  </div>
  )
}

export default Page;
