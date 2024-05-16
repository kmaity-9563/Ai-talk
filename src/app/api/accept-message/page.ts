import { getServerSession } from "next-auth";
import { authOptions } from '../auth/[...nextauth]/options'
import { PrismaClient } from "@prisma/client";
import { User } from "next-auth";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions)
    const prisma = new PrismaClient()

    try {
        const user: User = session?.user
        const userID = user._id
        if (!user || !session?.user) {
            return Response.json({
                message: 'user checking error',
                success: false
            }, {
                status: 500
            })
        }
        const isacceptingmessage = await req.json()
        const updateduser = await prisma.user.update({
            where: {
                id: userID,
            },
            data: {
                isAcceptingMessage: isacceptingmessage
            }
        })
        if (!updateduser) {
            return Response.json({
                message: 'user is not updating',
                success: false
            }, {
                status: 500
            })
        }
        return Response.json({
            message: 'user updated to accept message',
            success: true
        }, {
            status: 200
        })


    } catch (error: any) {
        return Response.json({
            message: 'user checking error',
            success: false
        }, {
            status: 500
        })
    }
}

export async function GET(req: Request) {
    const session = await getServerSession(authOptions)
    const prisma = new PrismaClient()

    try {
        const user: User = session?.user
        const userID = user._id
        if (!user || !session?.user) {
            return Response.json({
                message: 'user checking error',
                success: false
            }, {
                status: 500
            })
        }
        const findUser = await prisma.user.findFirst({
            where: {
                id: userID,
            }
        })
        if (!findUser) {
            return Response.json({
                message: 'user is not found',
                success: false
            }, {
                status: 500
            })
        }
        return Response.json({
            isAcceptingMessage : findUser.isAcceptingMessage,
            success: true
        }, {
            status: 200
        })


    } catch (error: any) {
        return Response.json({
            message: 'user checking error',
            success: false
        }, {
            status: 500
        })
    }
}