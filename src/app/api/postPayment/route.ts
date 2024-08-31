import connect from "@/lib/connect";
import Transaction from "@/models/Transaction";
import { NextResponse } from "next/server";

export async function POST(req) {
    try{
        await connect();
        const {session,message,currency,amount,category} = await req.json();
        if(!session || !session.user?.email){
            return NextResponse.json({message:"Unauthorized"},{status:401});
        }
        const form = {
            email:session.user.email,
            message,
            currency,
            amount,
            category
        }
        const transaction = new Transaction(form);
        await transaction.save();
        return NextResponse.json({message:"Transaction created successfully"},{status:201});
    }catch(e){
        console.log(e);
        return NextResponse.json({message:"Internal Server Error"},{status:500});
    }
}