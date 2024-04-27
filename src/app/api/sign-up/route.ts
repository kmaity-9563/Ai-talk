import dbConnect from "@/lib/dbConnect";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import UserModel from "@/models/userModel";
import bcrypt from 'bcryptjs'
import { response } from "express";

export async function POST(request : Request){
    await dbConnect()
    try{
        const {username,email ,password } = await request.json()

        const userVerifiedByUsername = await UserModel.findOne({
            username: username,
            isVerfied : true
        })
        if(userVerifiedByUsername) {
            return  Response.json(
                {
                    message : "Verified user already exists",
                    succes : false,
                } , {
                    status : 400
                }
            )
        }

        const userExistByEmail = await UserModel.findOne({
            email : email,
        })
        const hashedPassword = await bcrypt.hash(password,10)
        let token = Math.floor(100000 + Math.random() * 900000).toString() 
        if(userExistByEmail) {
            if(!userExistByEmail.isVerfied){
                return Response.json(
                    {
                        message : "User already exists by email",
                        success : false
                    } , {
                        status : 400
                    }
                )
            } else {
                userExistByEmail.password = hashedPassword,
                userExistByEmail.token = token,
                userExistByEmail.tokenDateExpiry = new Date(Date.now() + 360000)
                await userExistByEmail.save()
            }
            
        } else {
           
            const expirydate = new Date
            expirydate.setDate(expirydate.getHours() + 60)
        const newUser = await UserModel.create({
            username : username,
            password : hashedPassword,
            email : email,
            token : token  ,
            tokenDateExpiry : expirydate,
            isVerfied : false,
            isAcceptingMessage : true,
            message : []
        })
        await newUser.save()
    }
        const emailResponse = await  sendVerificationEmail(
            email , username , token
        )
 
        if(emailResponse.success){
            return Response.json({
                message : "email sent!",
                success : true
            } , { status : 200})
        }
   

    } catch (error) {
        console.log("error",error);
        return   Response.json({
                success : false,
                message  : 'error during registration process'
            },{
                status : 500
            })
        
    }
}