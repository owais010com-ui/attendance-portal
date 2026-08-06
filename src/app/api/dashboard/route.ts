import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Attendance from "@/models/Attendance";

export async function GET() {
    try {
        await connectDB();

        const today = new Date();
        const yesterday = new Date();

        yesterday.setDate(today.getDate() - 1);

        const todayDate = today.toLocaleDateString("en-CA");
        const yesterdayDate = yesterday.toLocaleDateString("en-CA");

        // Total Employees
        const totalEmployees = await User.countDocuments({
            role: "employee",
        });

        // Today's Check-ins
        const todayAttendance = await Attendance.countDocuments({
            date: todayDate,
        });

        // Sirf Aaj aur Yesterday ki Attendance
        const recentAttendance = await Attendance.find({
            date: {
                $in: [todayDate, yesterdayDate],
            },
        }).sort({ createdAt: -1 });

        // Employee Images
        const employees = await User.find(
            { role: "employee" },
            "employeeId profileImage"
        );

        const employeeMap = new Map<string, string>(
            employees.map((emp) => [
                emp.employeeId,
                emp.profileImage || "",
            ])
        );

        const formattedAttendance = recentAttendance.map((item) => ({
            _id: item._id,
            employeeName: item.employeeName,
            employeeId: item.employeeId,
            profileImage:
                employeeMap.get(item.employeeId) || "",
            checkIn: item.checkIn,
            locationLink: item.locationLink,
            status: item.status,

            day:
                item.date === todayDate
                    ? "Today"
                    : item.date === yesterdayDate
                        ? "Yesterday"
                        : item.date,

            date: item.date,
        }));

        return NextResponse.json({
            success: true,

            stats: {
                totalEmployees,
                todayAttendance,
            },

            recentAttendance: formattedAttendance,
        });

    } catch (error) {

        console.log(error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to load dashboard",
            },
            {
                status: 500,
            }
        );
    }
}