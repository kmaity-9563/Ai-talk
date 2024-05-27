'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import axios, { AxiosError } from 'axios';
import { useForm } from 'react-hook-form';
import { ApiResponse } from '@/types/ApiResponse';
import { Message } from '@prisma/client';
import { toast } from '@/components/ui/use-toast';
import { useSession } from 'next-auth/react';
import MessageCard from '@/components/MessageCard';
import { Separator } from "@/components/ui/separator";
import { User } from 'next-auth';
import { Button } from '@/components/ui/button';
import { Switch } from "@/components/ui/switch";
import { Loader2, RefreshCcw } from 'lucide-react';

const Page = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const { watch, register, setValue } = useForm();
  const acceptMessages = watch('acceptMessages');
  const { data: session } = useSession();
  const urlRef = useRef(null);
  const [profileUrl, setProfileUrl] = useState<string | null>(null);

  const username = (session && session.user) ? (session.user as User).username : '';

  const isAcceptingMessage = useCallback(async () => {
    setIsSwitchLoading(true);
    setLoading(true);
    try {
      const res = await axios.get<ApiResponse>('/api/accept-message');
      setValue('acceptMessages', res.data.isAcceptingMessage);
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
  }, [setValue, setIsSwitchLoading, setLoading]);

  const getMessages = useCallback(async (refresh: boolean = false) => {
    setLoading(true);
    try {
      const res = await axios.get<ApiResponse>('/api/get-message');
      setMessages(res?.data?.message);
      if (refresh) {
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
    if (!session || !session.user) return;
    isAcceptingMessage();
    getMessages();
  }, [session, isAcceptingMessage, getMessages,setIsSwitchLoading]);

  const handleDeleteMessage = (messageId: string) => {
    setMessages((prevMessages) => prevMessages.filter((msg) => msg.id !== messageId));
  };


  const handleSwitchChange = async () => {
    try {
      const res = await axios.post<ApiResponse>('/api/accept-message', {
        acceptMessages: !acceptMessages
      });

      setValue('acceptMessages', res.data.isAcceptingMessage);
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
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const baseurl = `${window.location.protocol}//${window.location.host}`;
      setProfileUrl(`${baseurl}/undefined/${username}`);
    }
  }, [username]);

  if (!profileUrl) {
    return null; 
  }
  const copyToClipboard = async () => {
    urlRef.current;
    navigator.clipboard.writeText(profileUrl);
  };

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
        onClick={() => {
          // e.preventDefault();
          getMessages(true);
        }}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>
      <div className="mt-4">
      

        {messages.length > 0 ? (
           
          messages.map((message, index) => (
            <MessageCard
              key={index} // Make sure to provide a unique key when mapping over an array
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <p>No messages to display.</p>
        )}
      </div>
    </div>
  );
};

export default Page;
