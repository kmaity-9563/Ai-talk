import nodemailer from 'nodemailer';
import {PrismaClient} from '@prisma/client'

const prisma = new PrismaClient()

export async function sendEmail({ email, emailType, token}: any) {
   
    try {
      var transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "243cc581fa373f",
          pass: "722d10a1abdbb4"
        }
      });

        const demoMail = {
            from: 'koushikmaity9563.com',
            // to : "koushikmaity9563@gmail.com",
            to: email,
            subject: emailType === "VERIFY" ? "verify email" : "reset password",
            html: `your verification code ${token}`,
        }

        const mailresponse = await transport.sendMail(demoMail);
        return mailresponse;

    } catch (e: any) {
        throw new Error("error at mailer",e.message);
    }
}
