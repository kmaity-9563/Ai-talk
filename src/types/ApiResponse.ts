import {  Message } from "@prisma/client";


export interface ApiResponse {
  success: boolean;
  message: string;
  isAccepted: boolean;
  messages?: Array<Message>;
}
