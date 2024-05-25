import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials : any) {
                try {
                    const user = await prisma.user.findFirst({
                        where :    
                                { username: credentials?.username }
                    });

                    if (!user) throw new Error("User not found");
                    if (!user.isVerified) throw new Error("User not verified");
                    console.log("user in authentication options", user)

                    const isValidPassword =  bcrypt.compare(credentials?.password, user.password);
                    console.log("isValidPassword checking",isValidPassword)

                    if (!isValidPassword) {
                        throw new Error("Incorrect password");
                    }

                    return user;
                } catch (error) {
                    throw new Error(error.message);
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.isVerified = user.isverfied;
                token.isAcceptingMessage = user.isacceptingmessage;
                token.username = user.username;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id;
                session.user.isVerified = token.isVerified;
                session.user.isAcceptingMessage = token.isAcceptingMessage;
                session.user.username = token.username;
            }
            return session;
        }
    },
    pages: {
        signIn: '/signin'
    },
    session: {
        strategy: 'jwt'
    },
    secret: process.env.NEXTAUTH_SECRET || "KOUSHIK"
};
