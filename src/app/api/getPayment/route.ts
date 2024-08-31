import connect from "@/lib/connect";
import Transaction from "@/models/Transaction";
import { NextResponse } from "next/server";

export async function GET(req){
    try{
        await connect();
        const email = req.nextUrl.searchParams.get('email');
        if(!email){
            return NextResponse.json({message:"Unauthorized"},{status:401});
        }
        const transactions = await Transaction.find({email});
        if(transactions.length>0){
            return NextResponse.json(transactions);
        }
        else{
            return NextResponse.json({message:"No transaction found"},{status:404});
        }
        
    }catch(e){
        console.log(e);
        return NextResponse.json({message:"Internal Server Error"},{status:500});
    }
}