"use server"
import { PrismaClient } from '@prisma/client';
import bcrypt from "bcrypt";
import { sendVerificationEmail } from '@/helpers/sendVerificationEmail';
import {sendEmail} from '../../../utiles/Mailer'
import { User } from 'lucide-react';

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
    const tokenExpiryDate = new Date(Date.now() + 3600000); // 1 hour expiry
    let userData ;

    if (userExistByEmail) {
      if (!userExistByEmail.isVerified) {
       const useres =  await prisma.user.update({
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
      userData = await prisma.user.create({
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

    let emailResponse;

      emailResponse = await sendEmail({ email, emailType: "VERIFY", token });
  
    if (emailResponse.response) {
      return new Response(
        JSON.stringify({
          message: 'Email sent!',
          success: true,
        }),
        { status: 200 }
      );
    }
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Error during registration process',
      }),
      { status: 500 }
    );
  }
}
