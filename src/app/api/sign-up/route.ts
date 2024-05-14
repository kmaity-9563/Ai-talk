import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { sendVerificationEmail } from '@/helpers/sendVerificationEmail';

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        const { username, email, password } = await request.json();

        const userVerifiedByUsername = await prisma.user.findFirst({
            where: {
                username: username,
                isVerified: true,
            },
        });

        if (userVerifiedByUsername) {
            return {
                status: 400,
                body: {
                    message: 'Verified user already exists',
                    success: false,
                },
            };
        }

        const userExistByEmail = await prisma.user.findFirst({
            where: {
                email: email,
            },
        });

        const hashedPassword = await bcrypt.hash(password, 10);
        let token = Math.floor(100000 + Math.random() * 900000).toString();

        if (userExistByEmail) {
            if (!userExistByEmail.isVerified) {
                await prisma.user.update({
                    where: {
                        id: userExistByEmail.id,
                    },
                    data: {
                        password: hashedPassword,
                        token: token,
                        tokenDateExpiry: new Date(Date.now() + 360000),
                    },
                });
            } else {
                await prisma.user.update({
                    where: {
                        id: userExistByEmail.id,
                    },
                    data: {
                        password: hashedPassword,
                        token: token,
                        tokenDateExpiry: new Date(Date.now() + 360000),
                    },
                });
            }
        } else {
            const expirydate = new Date();
            expirydate.setDate(expirydate.getHours() + 60);

            await prisma.user.create({
                data: {
                    username: username,
                    password: hashedPassword,
                    email: email,
                    token: token,
                    tokenDateExpiry: expirydate,
                    isVerified: false,
                    isAcceptingMessage: true,
                },
            });
        }

        const emailResponse = await sendVerificationEmail(email, username, token);

        if (emailResponse.success) {
            return {
                status: 200,
                body: {
                    message: 'Email sent!',
                    success: true,
                },
            };
        }
    } catch (error) {
        console.log('error', error);
        return {
            status: 500,
            body: {
                success: false,
                message: 'Error during registration process',
            },
        };
    }
}
