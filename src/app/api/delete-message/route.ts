import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/options';
import { User } from 'next-auth';

export async function DELETE(req: Request) {
    const session = await getServerSession(authOptions);
    const prisma = new PrismaClient();

    if (!session || !session.user) {
        return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
    }

    const user = session.user as User;

    const url = new URL(req.url);
    const deleteMessageId = url.searchParams.get("deleteMessage");

    if (!deleteMessageId) {
        return new Response(JSON.stringify({ message: "Message ID is required" }), { status: 400 });
    }

    try {
        const id = parseInt(deleteMessageId, 10);
        if (isNaN(id)) {
            return new Response(JSON.stringify({ message: "Invalid Message ID" }), { status: 400 });
        }
        const deletedMessage = await prisma.message.delete({
            where: {
                id : id,
                // userId: user.id, // Ensure the user owns the message
            },
        });

        return new Response(JSON.stringify({ message: "Message deleted successfully", deletedMessage }), { status: 200 });
    } catch (error) {
        console.error("Error deleting message:", error);
        return new Response(JSON.stringify({ message: "Failed to delete message" }), { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}
