import { Resend } from 'resend';
const resend = new Resend('re_123456789');

export async function sendSimpleEmail(email: string): Promise<void> {
  try {
    await resend.emails.send({
      from: 'koushik@gmail.com',
      to: email,
      subject: 'Test Email',
      text: 'This is a test email.',
    });
    console.log('Test email sent successfully');
  } catch (err) {
    console.error('Error sending test email:', err);
  }
}
