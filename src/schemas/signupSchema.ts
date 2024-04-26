import {z} from 'zod'

export const usernameValidation = z
      .string()
      .min(2, "must have atleast 2 character")
      .max(20, "must have atleast 20 characters")
      .regex(/^[a-zA-Z0-9_]+$/,"dont allow special charecter")

export const emailValidation = z
.string()
.email({message : "invalid email address"})


      export const signupSchema = z.object({
        username : usernameValidation,
        email : emailValidation,
        password: z.string().min(2, "must have atleast 2 characters").max(20, "must have atleast 20 characters ").regex(/^[a-zA-Z0-9]+$/,"dont allow special"),
      })