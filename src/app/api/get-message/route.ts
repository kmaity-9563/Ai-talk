import { getServerSession } from "next-auth";
import { authOptions } from '../auth/[...nextauth]/options';
import { PrismaClient } from "@prisma/client";
// import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: Request) {
    try {
        const prisma = new PrismaClient();
        const session = await getServerSession(authOptions);
        const user = session?.user;

        if (!user) {
            return Response.json({
                message: 'Unauthorized',
                success: false
            }, {
                status: 401,
            });
        }

        const findUser = await prisma.user.findUnique({
            where: {
                id: user._id,
            },
            include: {
                messages: {
                    orderBy: {
                        createdAt: 'desc'
                    }
                }
            }
        });

        if (!findUser) {
            return Response.json({
                message: 'User not found',
                success: false
            }, {
                status: 401,
            });
        }

        if (!findUser.messages || findUser.messages.length === 0) {
            return Response.json({
                message: 'No messages found for the user',
                success: false
            }, {
                status: 401,
            });
        }

        return Response.json({
            message: findUser.messages,
            success: true
        }, {
            status: 200,
        });
    } catch (error: any) {
        console.error(error);
        return Response.json({
            message: 'Internal server error',
            success: false
        }, {
            status: 401,
        });
    }
}
