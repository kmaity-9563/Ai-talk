import { resend } from '@/lib/resend';
import VerificationEmail from '../../Emails/VerificationEmail';
import { ApiResponse } from '@/types/ApiResponse';

export async function sendVerificationEmail(
  email: string,
  username: string,
  verificationCode: string
): Promise<ApiResponse> {
  try {
   
    console.log("Sending email to:", email);
    console.log("Verification code:", verificationCode);
    await resend.emails.send({
      from: 'koushik@gmail.com',
      to: email,
      subject: 'Mystery Message Verification Code',
      react: VerificationEmail({ username, otp: verificationCode }),
    });

    return {
      message: "Verification email sent",
      success: true,
      isAccepted: true,
    };
  } catch (err) {
    console.error("Error sending verification email: ", err);
    return {
      message: 'Verification failed: ' + (err as Error).message,
      success: false,
      isAccepted: false,
    };
  }
}
