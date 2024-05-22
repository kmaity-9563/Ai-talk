"use server"
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
    console.log("userVerifiedByUsername", userVerifiedByUsername);

    if (userVerifiedByUsername) {
      return new Response(
        JSON.stringify({
          message: 'Verified user already exists',
          success: false,
        }),
        { status: 400 }
      );
    }

    const userExistByEmail = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    const hashedPassword = await bcrypt.hash(password, 10);
    let token = Math.floor(100000 + Math.random() * 900000).toString();
    const tokenExpiryDate = new Date(Date.now() + 360000); // 1 hour expiry

    if (userExistByEmail) {
      if (!userExistByEmail.isVerified) {
        await prisma.user.update({
          where: {
            id: userExistByEmail.id,
          },
          data: {
            password: hashedPassword,
            token: token,
            tokenDateExpiry: tokenExpiryDate,
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
            tokenDateExpiry: tokenExpiryDate,
          },
        });
      }
    } else {
      await prisma.user.create({
        data: {
          username: username,
          password: hashedPassword,
          email: email,
          token: token,
          tokenDateExpiry: tokenExpiryDate,
          isVerified: false,
          isAcceptingMessage: true,
        },
      });
    }
            console.log("email, username, token" ,email, username, token)
    const emailResponse = await sendVerificationEmail(email, username, token);

    if (emailResponse.success) {
      return new Response(
        JSON.stringify({
          message: 'Email sent!',
          success: true,
        }),
        { status: 200 }
      );
    }
  } catch (error) {
    console.log('error', error);
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Error during registration process',
      }),
      { status: 500 }
    );
  }
}
