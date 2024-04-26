import {z} from 'zod'

export const messageSchema = z.object({
    content : z.string()
    .min(1,{message : "required minimum one char"})
    .max(300, {message : "maximum 300 char"}),
    cretedAt : z.date()
})