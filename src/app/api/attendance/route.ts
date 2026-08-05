import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Attendance from "@/models/Attendance";

export async function POST(req: Request) {
    try {
        await connectDB();

        const {
            employeeId,
            employeeName,
            email,
            photo,
            latitude,
            longitude,
            locationLink,
            checkIn,
            date,
        } = await req.json();

        if (
            !employeeId ||
            !employeeName ||
            !email ||
            !photo ||
            latitude == null ||
            longitude == null ||
            !locationLink ||
            !checkIn ||
            !date
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: "All fields are required.",
                },
                { status: 400 }
            );
        }

        const alreadyMarked = await Attendance.findOne({
            employeeId,
            date,
        });

        if (alreadyMarked) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Attendance already marked for today.",
                },
                { status: 400 }
            );
        }

        // ===== Attendance Status Logic =====
        // Abhi 9:30 AM hardcoded hai
        // Baad me admin settings se ye time aayega

        const lateHour = 9;
        const lateMinute = 30;

        const now = new Date();

        const currentMinutes =
            now.getHours() * 60 + now.getMinutes();

        const lateMinutes =
            lateHour * 60 + lateMinute;

        const status =
            currentMinutes > lateMinutes
                ? "Late"
                : "Present";

        await Attendance.create({
            employeeId,
            employeeName,
            email,
            photo,
            latitude,
            longitude,
            locationLink,
            checkIn,
            date,
            status,
        });

        return NextResponse.json({
            success: true,
            message: "Attendance marked successfully.",
            status,
        });

    } catch (error) {

        console.log(error);

        return NextResponse.json(
            {
                success: false,
                message: "Internal Server Error",
            },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        await connectDB();

        const attendance = await Attendance.find()
            .sort({ createdAt: -1 })
            .limit(50);

        return NextResponse.json({
            success: true,
            attendance,
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