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
            !latitude ||
            !longitude ||
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

        // Save attendance
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
            status: "Present",
        });

        return NextResponse.json({
            success: true,
            message: "Attendance marked successfully.",
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

        const attendance = await Attendance.find().sort({
            createdAt: -1,
        });

        return Response.json({
            success: true,
            attendance,
        });

    } catch (error) {
        console.log(error);

        return Response.json({
            success: false,
            message: "Something went wrong.",
        });
    }
}