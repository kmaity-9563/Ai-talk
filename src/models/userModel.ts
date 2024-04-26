// import { Schema } from "mongoose";
import mongoose , {Schema , Document} from "mongoose";

export interface Message extends Document{
    content : string,
    createdAt : Date
}

export interface User extends Document{
    username : string,
    password : string,
    email : string,
    token  : string,
    tokenDateExpiry : Date,
    isVerfied : boolean,
    isAcceptingMessage : boolean,
    message : Message[]
}
const MessageSchema : Schema<Message> = new Schema ({
        content : {
            type : String ,
            required : true
        },
        createdAt : {
            type : Date ,
            required : true,
            default : new Date
        }
})


const userSchema : Schema<User> = new mongoose.Schema({
    username : {
        type : 'string',
        required : [true , "Please enter a username "],
        unique : true 
    },
            email : {
                type : 'string',
                required : [true , "Please enter a email "],
                unique : true ,
                match :
                 [/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g , 
                'please use valid email']
            },
            password : {
                type : 'string',
                required : [true , "Please enter email"],
            } ,
            token : {
                type : 'string',
                required : [true , "token is required"],
            },
            tokenDateExpiry : {
                type : Date,
                required : [true , "token is required"],
            },
            isVerfied : {
                type : Boolean,
                default : false,
            },
            message : [MessageSchema]
            // forgotPasswordToken : String,
            // forgotPasswordTokenExpiry : Date,
            // VerifyToken : String,
            // VerifyTokenExpiry : Date
})

const UserModel = (mongoose.models.User as mongoose.Model<User> || mongoose.model<User>("User", userSchema))

export default UserModel