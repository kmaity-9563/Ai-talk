"use server";
import { getServerSession } from "next-auth";
import { authOptions } from '../auth/[...nextauth]/options';
import { PrismaClient } from "@prisma/client";
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        const user = session?.user;
        
        if (!user) {
            return NextResponse.json({
                message: 'Unauthorized',
                success: false
            }, { status: 401 });
        }

        // Find the user in the database by email, as session user object may not have id directly
        const findUser = await prisma.user.findUnique({
            where: { email: user.email }
        });

        if (!findUser) {
            return NextResponse.json({
                message: 'User not found',
                success: false
            }, { status: 404 });
        }

        const findMessage = await prisma.message.findMany({
            where: { userId: findUser.id },
            orderBy: { createdAt: 'desc' } 
        });


        if (!findMessage) {
            return NextResponse.json({
                message: 'No messages found for the user',
                success: false
            }, { status: 404 });
        }

        return NextResponse.json({
            message: findMessage,
            success: true
        }, { status: 200 });
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({
            message: 'Internal server error',
            success: false
        }, { status: 500 });
    }
}
