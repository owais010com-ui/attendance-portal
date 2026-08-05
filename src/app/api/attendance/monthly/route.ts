import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

import { connectDB } from "@/lib/db";
import Attendance from "@/models/Attendance";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function GET(req: NextRequest) {
    try {
        await connectDB();

        const token = req.cookies.get("token")?.value;

        if (!token) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        const decoded = jwt.verify(token, JWT_SECRET) as {
            id: string;
            employeeId: string;
        };

        const { searchParams } = new URL(req.url);

        const month = searchParams.get("month");

        const year = searchParams.get("year");

        const attendance = await Attendance.find({
            employeeId: decoded.employeeId,
        }).sort({ createdAt: -1 });

        const filtered = attendance.filter((item) => {
            const d = new Date(item.date);

            return (
                d.getMonth() + 1 === Number(month) &&
                d.getFullYear() === Number(year)
            );
        });

        return NextResponse.json({
            success: true,
            attendance: filtered,
        });

    } catch (error) {
        console.log(error);

        return NextResponse.json(
            {
                success: false,
                message: "Something went wrong",
            },
            {
                status: 500,
            }
        );
    }
}