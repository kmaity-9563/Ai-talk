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
    onMessageDelete : ( messageId :string ) => void
}

const MessageCard = ({ message, onMessageDelete } : mesageProps) => {
    const { toast } = useToast();

    console.log("message",message)
    const handleDeleteConfirm = async () => {
        try {
            
            const response = await axios.delete<ApiResponse>(
                `/api/delete-message?deleteMessage=${message.id}`
            );
            toast({
                title: "Message deleted successfully",
               
            });
            let messageId = message.id.toString()
            onMessageDelete(messageId);
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast({
                title: 'Error',
                description: axiosError.response?.data.message ?? 'Failed to delete message',
                variant: 'destructive',
            });
        }
    };

    return (
        <Card className='mx-5 my-4'>
            <CardHeader className='flex justify-between items-center'>
                <CardTitle>{message.content}</CardTitle>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive">Delete</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Delete Message</AlertDialogTitle>
                        </AlertDialogHeader>
                        <AlertDialogDescription>
                            Are you sure you want to delete this message?
                        </AlertDialogDescription>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDeleteConfirm}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </CardHeader>
        </Card>
    );
};

export default MessageCard;