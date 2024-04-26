import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number
}

const connection: ConnectionObject = {}

export  async function dbConnect(): Promise<void>{
        if(connection.isConnected){
            console.log("data base connected");
            return ;
        }

        try {
            const db = await mongoose.connect(process.env.MONGO_URL || '')
            connection.isConnected = db.connections[0].readyState
        } catch (err) {
            console.log("connection error", err)
            process.exit(1)
        }
}

export default dbConnect;