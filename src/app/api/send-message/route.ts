"use server"
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { username, content } = await req.json();
    const user = await prisma.user.findFirst({
      where: {
        username: username,
      },
    });

    if (!user) {
      return new Response(
        JSON.stringify({
          message: 'User not found',
          success: false,
        }),
        { status: 404 }
      );
    }

    if (!user.isAcceptingMessage) {
      return new Response(
        JSON.stringify({
          message: 'User is not accepting messages',
          success: false,
        }),
        { status: 403 }
      );
    }

    const newMessage = {
      content: content,
      createdAt: new Date(),
    };

    await prisma.message.create({
      data: {
        content: newMessage.content,
        createdAt: newMessage.createdAt,
        userId: user.id,
      },
    });

    return new Response(
      JSON.stringify({
        message: 'Message sent successfully',
        success: true,
      }),
      { status: 201 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: 'Internal server error',
        success: false,
      }),
      { status: 500 }
    );
  }
}
