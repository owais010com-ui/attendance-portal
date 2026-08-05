import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Attendance from "@/models/Attendance";

export async function GET() {
    try {
        await connectDB();

        const today = new Date().toLocaleDateString("en-CA");

        // Employees
        const totalEmployees = await User.countDocuments({
            role: "employee",
        });

        // Today's Attendance
        const todayAttendance = await Attendance.countDocuments({
            date: today,
        });

        // Present
        const presentToday = await Attendance.countDocuments({
            date: today,
            status: "Present",
        });

        // Late
        const lateToday = await Attendance.countDocuments({
            date: today,
            status: "Late",
        });

        // Absent
        const absentToday = totalEmployees - todayAttendance;

        // Recent Attendance
        const recentAttendance = await Attendance.find()
            .sort({ createdAt: -1 })
            .limit(10);

        const formattedAttendance = await Promise.all(
            recentAttendance.map(async (item) => {
                const employee = await User.findOne({
                    employeeId: item.employeeId,
                });

                return {
                    _id: item._id,
                    employeeName: item.employeeName,
                    employeeId: item.employeeId,
                    profileImage: employee?.profileImage || "",
                    checkIn: item.checkIn,
                    locationLink: item.locationLink,
                    status: item.status,
                    date: item.date,
                };
            })
        );

        return NextResponse.json({
            success: true,
            stats: {
                totalEmployees,
                presentToday,
                lateToday,
                absentToday,
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