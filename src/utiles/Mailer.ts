import nodemailer from 'nodemailer';

export  async function sendEmail({email , emailType , userTd}){
        try{
            const transporter = nodemailer.createTransport({
                host: "smtp.ethereal.email",
                port: 587,
                secure: false, 
                auth: {
                  user: "maddison53@ethereal.email",
                  pass: "jn7jnAPss4f63QBp6D",
                },
              });

              const demoMail = {
                from: '"" <maddison53@ethereal.email>', 
                to: email, 
                subject: emailType === "VERIFY" ? "verify email" : "reset password" , 
                html: "<b>Hello world?</b>", 
              }

              const mailresponse = await transporter.sendEmail(demoMail);
                return mailresponse;

        } catch(e:any){
        throw new Error(e.message);
        }
}