import {resend} from '@/lib/resend';
import VerificationEmail from '../../Emails/VerificationEmail';
import { ApiResponse } from '@/types/ApiResponse';


export  async function sendVerificationEmail(
    email : string,
    username : string,
    verificationCode : string
) : Promise<ApiResponse> {
    try {
        await resend.emails.send({
            from: 'dev@hiteshchoudhary.com',
            to: email,
            subject: 'Mystery Message Verification Code',
            react: VerificationEmail({ username, otp: verificationCode }),
          });
            return  {
                message : " verification done",
                success : true,
                isAccepted : true
            }
    } catch (err) {
        // console.error(err) ,
        return {
            message: 'Verification failed: ' ,
            success : false,
            isAccepted : false,

        }
    }
}