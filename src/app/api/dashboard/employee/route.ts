import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Attendance from "@/models/Attendance";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function GET(req: NextRequest) {
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

        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    message: "User not found.",
                },
                { status: 404 }
            );
        }

        const today = new Date().toLocaleDateString("en-CA");

        const todayAttendance = await Attendance.findOne({
            employeeId: user.employeeId,
            date: today,
        });

        const recentAttendance = await Attendance.find({
            employeeId: user.employeeId,
        })
            .sort({ createdAt: -1 })
            .limit(5);

        const totalPresent = await Attendance.countDocuments({
            employeeId: user.employeeId,
            status: "Present",
        });

        const totalAbsent = await Attendance.countDocuments({
            employeeId: user.employeeId,
            status: "Absent",
        });

        const totalLate = await Attendance.countDocuments({
            employeeId: user.employeeId,
            status: "Late",
        });

        const thisMonth = new Date().getMonth() + 1;
        const thisYear = new Date().getFullYear();

        const monthlyAttendance = (
            await Attendance.find({
                employeeId: user.employeeId,
            })
        ).filter((item) => {
            const d = new Date(item.createdAt);

            return (
                d.getMonth() + 1 === thisMonth &&
                d.getFullYear() === thisYear
            );
        }).length;

        const total =
            totalPresent +
            totalAbsent +
            totalLate;

        const attendancePercentage =
            total === 0
                ? 0
                : Math.round((totalPresent / total) * 100);

        return NextResponse.json({
            success: true,

            user,

            todayAttendance,

            recentAttendance,

            stats: {
                totalPresent,
                totalAbsent,
                totalLate,
                monthlyAttendance,
                attendancePercentage,
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