import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function POST(req: Request) {
    try {
        await connectDB();

        const body = await req.json();

        const {
            name,
            email,
            password,
            employeeId,
            designation,
            role,
        } = body;

        const existingUser = await User.findOne({
            $or: [{ email }, { employeeId }],
        });

        if (existingUser) {
            return NextResponse.json(
                {
                    message: "Email or Employee ID already exists",
                },
                { status: 400 }
            );
        }

        // Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create User
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            employeeId,
            designation,
            role: role || "employee",
        });

        // Remove password from response
        const { password: _, ...userWithoutPassword } = user.toObject();

        return NextResponse.json(
            {
                success: true,
                message: "User created successfully",
                user: userWithoutPassword,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Register Error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Internal Server Error",
            },
            { status: 500 }
        );
    }
}