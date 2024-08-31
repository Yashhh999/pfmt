import connect from "@/lib/connect";
import budgetSchema from "@/models/Budget";
import { NextResponse } from "next/server";

export default async function POST(req) {
    try {
        await connect();

        const { session, Budget } = await req.json();

        if (!session || !session.user?.email) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const form = {
            email: session.user.email,
            budget: Budget,
        };

        const existingBudget = await budgetSchema.findOne({ email: session.user.email });

        if (existingBudget) {
            return NextResponse.json({ message: "Budget already exists" }, { status: 400 });
        }

        const budget = new budgetSchema(form);
        await budget.save();

        return NextResponse.json({ message: "Budget created successfully" }, { status: 201 });
    } catch (e) {
        console.error("Error creating budget:", e);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
