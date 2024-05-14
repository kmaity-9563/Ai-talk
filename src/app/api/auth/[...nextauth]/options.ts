import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "credentials",
            credentials: {
                username: { label: "Username", type: "text", placeholder: "jsmith" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials: any): Promise<any> {
                const prisma = new PrismaClient()
                try {
                    const user = await prisma.user.findFirst({
                        where: {
                            OR: [
                                { email: credentials.email },
                                { username: credentials.username }
                            ]
                        }
                    })
                    if (!user) {
                        throw new Error("User not found: " + credentials.username)
                    }
                    if (!user.isVerified) {
                        throw new Error("User not verified: " + credentials.username)
                    }
                    if (user && user.password && (await bcrypt.compare(credentials.password, user.password))) {
                        return user
                    } else {
                        throw new Error("User passwrod wrong not verified: " + credentials.username)
                    }
                } catch (err: any) {
                    throw new Error(err)
                }

            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token._id = user._id?.toString();
                token.isverfied = user.isverfied
                token.isacceptingmessage = user.isacceptingmessage
                token.username = user.username
            }
            return token
        },
        async session({ session, token }) {
            if (token) {
                session.user._id = token._id
                session.user.isverfied = token.isverfied
                session.user.isacceptingmessage = token.isacceptingmessage
                session.user.username = token.username
            }
            return session
        }
    },
    pages: {
        signIn: '/signin',
    },
    session: {
        strategy: 'jwt'
    },
    secret: process.env.NEXTAUTH_SECRET,


}