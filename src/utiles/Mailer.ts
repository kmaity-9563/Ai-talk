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
                from: '"Maddison Foo Koch 👻" <maddison53@ethereal.email>', 
                to: email, // list of receivers
                subject: emailType === "VERIFY" ? "verify email" : "reset password" , 
                html: "<b>Hello world?</b>", // html body
              }

              const mailresponse = await transporter.sendEmail(demoMail);
                return mailresponse;

        } catch(e:any){
        throw new Error(e.message);
        }
}