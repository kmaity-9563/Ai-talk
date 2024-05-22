import React from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "./ui/card"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "./ui/alert-dialog"
import { Button } from "./ui/button"
import { X } from 'lucide-react';
import axios , {AxiosError} from "axios"
import {ApiResponse} from '../types/ApiResponse'
import { useToast } from './ui/use-toast';
import {Message} from '@prisma/client'

type mesageProps = {
    message: Message ,
    onMessagDelete : ( messageId :string ) => void
}

const MessageCard = ({message , onMessagDelete} : mesageProps) => {
    const { toast } = useToast();


    const handleDeleteConfirm = async (  ) => {
        try {
            const response = await axios.delete<ApiResponse>(
                `/api/delete-message/${message}`
            )
            toast({
                tittle : response.data.message
            })
            onMessagDelete(message?.id)
        } catch (error) {
                const AxiosError = error as AxiosError<ApiResponse>
                toast({
                    title: 'Error',
                    description:
                    AxiosError.response?.data.message ?? 'Failed to delete message',
                    variant: 'destructive',
                  });
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Card Title</CardTitle>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive"><X /></Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete your
                                account and remove your data from our servers.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction  onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
                <CardDescription>Card Description</CardDescription>
            </CardHeader>
            <CardContent>
                <p>Card Content</p>
            </CardContent>

        </Card>

    )
}

export default MessageCard
