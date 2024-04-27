import { Resend } from 'resend';
import type { NextApiRequest, NextApiResponse } from 'next';

export const resend = new Resend(process.env.RESEND_API_KEY);