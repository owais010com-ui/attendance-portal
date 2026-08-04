import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

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
                { status: 401 }
            );
        }

        const decoded = jwt.verify(token, JWT_SECRET) as {
            id: string;
        };

        const {
            name,
            email,
            phone,
            address,
        } = await req.json();

        if (
            !name ||
            !email ||
            !phone ||
            !address
        ) {
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

        const emailExists = await User.findOne({
            email,
            _id: { $ne: decoded.id },
        });

        if (emailExists) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Email already exists.",
                },
                { status: 400 }
            );
        }

        const user = await User.findByIdAndUpdate(
            decoded.id,
            {
                name,
                email,
                phone,
                address,
            },
            {
                new: true,
            }
        ).select("-password");

        return NextResponse.json({
            success: true,
            message: "Profile updated successfully.",
            user,
        });

    } catch (error) {
        console.log(error);

        return NextResponse.json(
            {
                success: false,
                message: "Something went wrong.",
            },
            { status: 500 }
        );
    }
}