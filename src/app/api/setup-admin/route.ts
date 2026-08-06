import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function GET() {
    try {
        await connectDB();

        const admin = await User.findOne({
            role: "admin",
        });

        if (admin) {
            return NextResponse.json({
                success: false,
                message: "Admin already exists.",
            });
        }

        const hashedPassword = await bcrypt.hash(
            "admin123",
            10
        );

        const newAdmin = await User.create({
            name: "Admin",
            email: "admin@gmail.com",
            password: hashedPassword,
            employeeId: "ADMIN001",
            role: "admin",
            isActive: true,
        });

        return NextResponse.json({
            success: true,
            message: "Admin created successfully.",
            admin: {
                email: newAdmin.email,
                password: "admin123",
            },
        });

    } catch (error) {

        console.log(error);

        return NextResponse.json(
            {
                success: false,
                message: "Internal Server Error",
            },
            {
                status: 500,
            }
        );

    }
}