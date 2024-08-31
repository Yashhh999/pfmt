import connect from "@/lib/connect";
import { NextResponse } from "next/server";
import budgetSchema from "@/models/Budget";

export async function GET(req) {
    try {
        await connect();

        const email = req.nextUrl.searchParams.get("email");

        if (!email) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const budgetObject = await budgetSchema.find({ email });

        if (budgetObject.length > 0) {
            return NextResponse.json(budgetObject);
        } else {
            return NextResponse.json({ message: "No budget found" }, { status: 404 });
        }
    } catch (error) {
        console.error("Error fetching budget:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
