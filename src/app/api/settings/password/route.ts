import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import { connectDB } from "@/lib/db";
import User from "@/models/User";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function PUT(req: NextRequest) {
    try {
        await connectDB();

        const token = req.cookies.get("token")?.value;

        if (!token) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Unauthorized",
                },
                {
                    status: 401,
                }
            );
        }

        const decoded = jwt.verify(token, JWT_SECRET) as {
            id: string;
            role: string;
        };

        console.log("Decoded Token:", decoded);

        const { currentPassword, newPassword } = await req.json();

        if (!currentPassword || !newPassword) {
            return NextResponse.json(
                {
                    success: false,
                    message: "All fields are required.",
                },
                {
                    status: 400,
                }
            );
        }

        const user = await User.findById(decoded.id);

        console.log("User Found:", user);

        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    message: "User not found.",
                },
                {
                    status: 404,
                }
            );
        }

        console.log("Database Role:", user.role);

        if (user.role !== "admin") {
            return NextResponse.json(
                {
                    success: false,
                    message: `User role is ${user.role}, not admin.`,
                },
                {
                    status: 403,
                }
            );
        }

        const isMatch = await bcrypt.compare(
            currentPassword,
            user.password
        );

        if (!isMatch) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Current password is incorrect.",
                },
                {
                    status: 400,
                }
            );
        }

        user.password = await bcrypt.hash(newPassword, 10);

        await user.save();

        return NextResponse.json({
            success: true,
            message: "Password updated successfully.",
        });

    } catch (error) {
        console.log("ERROR:", error);

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