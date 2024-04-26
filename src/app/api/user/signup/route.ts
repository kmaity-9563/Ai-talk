import { connection } from "@dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import User from '@models/userModel';

connection()

export async function POST(req:NextRequest) {
    try {
        const {username ,email,password} = req.json();
        
    }
    } catch (err) {

    }
}