import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Attendance from "@/models/Attendance";
import User from "@/models/User";
import Settings from "@/models/Settings";
interface AttendanceResponse {
    _id: string;
    employeeId: string;
    employeeName: string;
    email: string;
    photo: string;
    latitude: number | null;
    longitude: number | null;
    locationLink: string;
    date: string;
    checkIn: string;
    status: "Present" | "Late" | "Absent";
    createdAt: Date;
    updatedAt: Date;
}

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
                    message: "Attendance already marked.",
                },
                { status: 400 }
            );
        }

        const settings = await Settings.findOne();

        const officeStart = settings?.officeStart || "09:00";
        const lateAfter = settings?.lateAfter || 10;

        const [hour, minute] = officeStart
            .split(":")
            .map(Number);

        const lateMinutes =
            hour * 60 + minute + lateAfter;

        const now = new Date();

        const currentMinutes =
            now.getHours() * 60 + now.getMinutes();

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

export async function GET(req: NextRequest) {

    try {

        await connectDB();

        const searchParams = req.nextUrl.searchParams;

        const selectedDate =
            searchParams.get("date") ||
            new Date().toLocaleDateString("en-CA");

        const employees = await User.find({
            role: "employee",
        }).sort({
            employeeName: 1,
        });

        const attendance = await Attendance.find({
            date: selectedDate,
        });
        const attendanceMap = new Map<string, typeof attendance[number]>();

        attendance.forEach((item) => {
            attendanceMap.set(item.employeeId, item);
        });

        const finalAttendance: AttendanceResponse[] = [];

        employees.forEach((employee) => {

            const record = attendanceMap.get(employee.employeeId);

            if (record) {

                finalAttendance.push({
                    _id: record._id.toString(),
                    employeeId: record.employeeId,
                    employeeName: record.employeeName,
                    email: record.email,
                    photo: record.photo,
                    latitude: record.latitude,
                    longitude: record.longitude,
                    locationLink: record.locationLink,
                    date: record.date,
                    checkIn: record.checkIn,
                    status: record.status,
                    createdAt: record.createdAt,
                    updatedAt: record.updatedAt,
                });

            } else {

                finalAttendance.push({
                    _id: employee._id.toString(),
                    employeeId: employee.employeeId,
                    employeeName: employee.name,
                    email: employee.email,
                    photo: employee.profileImage,
                    latitude: null,
                    longitude: null,
                    locationLink: "",
                    date: selectedDate,
                    checkIn: "--",
                    status: "Absent",
                    createdAt: new Date(0),
                    updatedAt: new Date(0),
                });

            }

        });

        const search =
            searchParams.get("search")?.toLowerCase() || "";

        const filteredAttendance = finalAttendance.filter((item) => {

            if (!search) return true;

            return (
                item.employeeName.toLowerCase().includes(search) ||
                item.employeeId.toLowerCase().includes(search) ||
                item.email.toLowerCase().includes(search)
            );

        });

        filteredAttendance.sort((a, b) => {

            if (a.status === "Absent" && b.status !== "Absent") {
                return 1;
            }

            if (a.status !== "Absent" && b.status === "Absent") {
                return -1;
            }

            return (
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            );

        });

        return NextResponse.json({
            success: true,
            attendance: filteredAttendance,
        });

    } catch (error) {

        console.log(error);

        return NextResponse.json(
            {
                success: false,
                message: "Something went wrong.",
            },
            {
                status: 500,
            }
        );

    }

}