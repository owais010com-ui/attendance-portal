import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function GET() {
    try {
        await connectDB();

        const totalEmployees = await User.countDocuments();

        const activeEmployees = await User.countDocuments({
            isActive: true,
        });

        const inactiveEmployees = await User.countDocuments({
            isActive: false,
        });

        return NextResponse.json({
            success: true,
            stats: {
                totalEmployees,
                activeEmployees,
                inactiveEmployees,
                todayAttendance: 0, // Attendance module ke baad ye dynamic hoga
            },
        });
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch dashboard stats",
            },
            {
                status: 500,
            }
        );
    }
}