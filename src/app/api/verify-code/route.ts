import { z } from 'zod'
import { PrismaClient } from '@prisma/client';
// import { Console } from 'console';

export async function POST(request: Request) {
    const prisma = new PrismaClient()
    try {
        const { username, code } = await request.json();
        console.log('username', username)
        console.log('code', code)
        const user = await prisma.user.findFirst({
            where: {
                username: username
            }
        })
        if (!user) {
            return Response.json({
                message: 'user checking error',
                success: false
            }, {
                status: 500
            })
        }
        console.log('user' , user)
        const isValidCode = user.token === code
        const isnotExpiredCode = user.tokenDateExpiry ? new Date(user.tokenDateExpiry) > new Date() : false;

        if (isValidCode && isnotExpiredCode) {
            await prisma.user.update({
                where: {
                    id: user.id
                },
                data: { isVerified: true }
            })
            return Response.json({
                message: 'Account verification done successfully',
                success: false
            }, {
                status: 200
            })
        } else if (!isValidCode) {
            return Response.json({
                message: 'invalid code!',
                success: false
            }, {
                status: 400
            })
        } else {
            return Response.json({
                message: 'Expired code!',
                success: false
            }, {
                status: 400
            })
        }


    } catch (error: any) {
        return Response.json({
            message: 'user checking error',
            success: false
        }, {
            status: 500
        })
    }
}