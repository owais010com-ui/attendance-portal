import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Attendance from "@/models/Attendance";

interface ReportAttendance {
    _id: string;
    employeeId: string;
    employeeName: string;
    email: string;
    photo: string;
    date: string;
    checkIn: string;
    status: "Present" | "Late" | "Absent";
    latitude: number | null;
    longitude: number | null;
    locationLink: string;
    createdAt: Date;
    updatedAt: Date;
}
export async function GET(req: NextRequest) {
    try {
        await connectDB();

        const { searchParams } = new URL(req.url);

        const filter =
            searchParams.get("filter") || "today";

        const fromDate =
            searchParams.get("fromDate") || "";

        const toDate =
            searchParams.get("toDate") || "";

        const today = new Date();

        let startDate = "";
        let endDate = "";

        // Today
        if (filter === "today") {

            startDate = today.toLocaleDateString("en-CA");
            endDate = startDate;

        }

        // Week
        else if (filter === "week") {

            const firstDay = new Date(today);

            firstDay.setDate(
                today.getDate() - today.getDay()
            );

            const lastDay = new Date(firstDay);

            lastDay.setDate(firstDay.getDate() + 6);

            startDate = firstDay
                .toLocaleDateString("en-CA");

            endDate = lastDay
                .toLocaleDateString("en-CA");

        }

        // Month
        else if (filter === "month") {

            const firstDay = new Date(
                today.getFullYear(),
                today.getMonth(),
                1
            );

            const lastDay = new Date(
                today.getFullYear(),
                today.getMonth() + 1,
                0
            );

            startDate = firstDay
                .toLocaleDateString("en-CA");

            endDate = lastDay
                .toLocaleDateString("en-CA");

        }

        // Custom
        else {

            startDate = fromDate;
            endDate = toDate;

        }
        const employees = await User.find(
            { role: "employee" },
            "name email employeeId profileImage"
        );

        const attendance = await Attendance.find({
            date: {
                $gte: startDate,
                $lte: endDate,
            },
        }).sort({ date: -1, createdAt: -1 });

        const finalReport: ReportAttendance[] = [];

        if (filter === "today") {

            attendance.forEach((record) => {

                finalReport.push({
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

            });

            employees.forEach((employee) => {

                const exists = attendance.find(
                    (item) =>
                        item.employeeId === employee.employeeId
                );

                if (!exists) {

                    finalReport.push({
                        _id: employee._id.toString(),
                        employeeId: employee.employeeId,
                        employeeName: employee.name,
                        email: employee.email,
                        photo: employee.profileImage || "",
                        latitude: null,
                        longitude: null,
                        locationLink: "",
                        date: startDate,
                        checkIn: "--",
                        status: "Absent",
                        createdAt: new Date(0),
                        updatedAt: new Date(0),
                    });

                }

            });

        } else {

            attendance.forEach((record) => {

                finalReport.push({
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

            });

        }
        const totalEmployees = employees.length;

        const present = finalReport.filter(
            (item) => item.status === "Present"
        ).length;

        const late = finalReport.filter(
            (item) => item.status === "Late"
        ).length;

        const absent = finalReport.filter(
            (item) => item.status === "Absent"
        ).length;

        const attendancePercentage =
            totalEmployees === 0
                ? 0
                : Math.round(((present + late) / totalEmployees) * 100);

        return NextResponse.json({
            success: true,

            attendance: finalReport,

            stats: {
                totalEmployees,
                present,
                late,
                absent,
                attendancePercentage,
            },
        });

    } catch (error) {

        console.log(error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to load reports.",
            },
            {
                status: 500,
            }
        );

    }
}