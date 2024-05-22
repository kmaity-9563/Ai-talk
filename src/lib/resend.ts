import { Resend } from 'resend';

const apiKey = process.env.RESEND_API_KEY;
if (!apiKey) {
  throw new Error('Missing API key. Set RESEND_API_KEY in your environment variables.');
}

export const resend = new Resend(apiKey);
