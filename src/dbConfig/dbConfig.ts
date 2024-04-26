import mongoose from "mongoose";

export async function  connection(){
            try{
                mongoose.connect(process.env.MONGO_URL!)

                const connection =  mongoose.connection

                connection.on('connected', () => {
                    console.log("Connection build")
                })

                connection.on('error', () =>{
                    console.log("Connection error")
                })

                process.exit()
            } catch(err){
                console.log(err);
                console.log("db connection issue: " );
            }
}