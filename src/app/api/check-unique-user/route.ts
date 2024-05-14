// import { response } from 'express'
import { usernameValidation } from '../../../schemas/signupSchema'
import { z } from 'zod'
import { PrismaClient } from '@prisma/client';

const userUniqueName = z.object({
    username: usernameValidation
})

export async function GET(request: Request) {
    const prisma = new PrismaClient()
    try {
        const searchparms = new URL(request.url)
        const queryparms = {
            username: searchparms.searchParams.get('username'),
        }
        const result = userUniqueName.safeParse(queryparms)
        if (!result.success) {
            const error = result.error.format().username?._errors || []
            return Response.json({
                message: 'errro during cathing result'
            }, {
                status: 400
            })
        }
        const { username } = result.data
        const existingVerifiedUser = await prisma.user.findFirst({
            where: {
                username: username,
                isVerified: true
            }
        })
        if (existingVerifiedUser) {
            return Response.json({
                success: false,
                message: 'username exists'
            }, {
                status: 400
            })
        } else {
            return Response.json({
                success: true,
                message: 'unique username'
            }, {
                status: 200
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