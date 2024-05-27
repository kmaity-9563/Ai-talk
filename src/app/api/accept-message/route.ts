import { getServerSession } from "next-auth";
import { authOptions}  from '../auth/[...nextauth]/options';
import { PrismaClient } from "@prisma/client";
import { User } from "next-auth";

const prisma = new PrismaClient();

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return new Response(JSON.stringify({ message: 'User not authenticated', success: false }), { status: 410 });
        }

        const user = session.user as User;
        const userID = user.id; 

        const body = await req.json();
        const isAcceptingMessage = body.acceptMessages;
        const updatedUser = await prisma.user.update({
            where: { id: userID },
            data: { isAcceptingMessage }
        });

        return new Response(JSON.stringify({ message: 'User updated to accept messages', success: true }), { status: 200 });
    } catch (error: any) {
        console.error("Error in POST /api/accept-message:", error);
        return new Response(JSON.stringify({ message: 'Error updating user', success: false }), { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return new Response(JSON.stringify({ message: 'User not authenticated', success: false }), { status: 401 });
        }

        const user = session.user as User;
        const userID = user.id;

        const findUser = await prisma.user.findUnique({
            where: { id: userID }
        });

        if (!findUser) {
            return new Response(JSON.stringify({ message: 'User not found', success: false }), { status: 404 });
        }
        console.log("findUser.isAcceptingMessage in server", findUser.isAcceptingMessage)
        return new Response(JSON.stringify({ isAcceptingMessage: findUser.isAcceptingMessage, success: true }), { status: 200 });
    } catch (error: any) {
        console.error("Error in GET /api/accept-message:", error);
        return new Response(JSON.stringify({ message: 'Error retrieving user', success: false }), { status: 500 });
    }
}

