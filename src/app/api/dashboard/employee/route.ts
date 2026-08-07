import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Attendance from "@/models/Attendance";
import Settings from "@/models/Settings";

const JWT_SECRET = process.env.JWT_SECRET!;

/* =========================
   Pakistan Date
========================= */

function getPakistanDate(date = new Date()) {
    return new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Karachi",
    }).format(date);
}

/* =========================
   Pakistan Current Time
========================= */

function getPakistanTimeInMinutes() {
    const parts = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Karachi",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    }).formatToParts(new Date());

    const hour = Number(
        parts.find((part) => part.type === "hour")?.value || 0
    );

    const minute = Number(
        parts.find((part) => part.type === "minute")?.value || 0
    );

    return hour * 60 + minute;
}

/* =========================
   HH:mm -> Minutes
========================= */

function timeToMinutes(time: string) {
    const [hour, minute] = time.split(":").map(Number);

    return hour * 60 + minute;
}

/* =========================
   Get Working Days
   Sunday = Off
========================= */

function getWorkingDays(
    startDate: string,
    endDate: string
) {
    const start = new Date(`${startDate}T00:00:00`);
    const end = new Date(`${endDate}T00:00:00`);

    let count = 0;

    const current = new Date(start);

    while (current <= end) {
        const day = current.getDay();

        // Sunday = 0
        if (day !== 0) {
            count++;
        }

        current.setDate(current.getDate() + 1);
    }

    return count;
}

/* =========================
   Employee Dashboard
========================= */

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

        const decoded = jwt.verify(
            token,
            JWT_SECRET
        ) as {
            id: string;
        };

        const user = await User.findById(
            decoded.id
        ).select("-password");

        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    message: "User not found.",
                },
                { status: 404 }
            );
        }

        /* =========================
           Pakistan Today
        ========================= */

        const today = getPakistanDate();

        /* =========================
           Today's Attendance
        ========================= */

        const todayAttendance =
            await Attendance.findOne({
                employeeId: user.employeeId,
                date: today,
            });

        /* =========================
           Recent Attendance
        ========================= */

        const recentAttendance =
            await Attendance.find({
                employeeId: user.employeeId,
            })
                .sort({ createdAt: -1 })
                .limit(5);

        /* =========================
           Overall Present
        ========================= */

        const totalPresent =
            await Attendance.countDocuments({
                employeeId: user.employeeId,
                status: "Present",
            });

        /* =========================
           Overall Late
        ========================= */

        const totalLate =
            await Attendance.countDocuments({
                employeeId: user.employeeId,
                status: "Late",
            });

        /* =========================
           Get Office Settings
        ========================= */

        const settings =
            await Settings.findOne();

        const officeStart =
            settings?.officeStart || "09:00";

        const officeEnd =
            settings?.officeEnd || "18:00";

        /* =========================
           Employee Joining Date
        ========================= */

        const employeeStartDate =
            getPakistanDate(
                new Date(user.createdAt)
            );

        /* =========================
           Determine If Today
           Should Count As Absent
        ========================= */

        const currentMinutes =
            getPakistanTimeInMinutes();

        const officeStartMinutes =
            timeToMinutes(officeStart);

        const officeEndMinutes =
            timeToMinutes(officeEnd);

        const isOvernight =
            officeEndMinutes <= officeStartMinutes;

        let officeEnded = false;

        if (isOvernight) {
            /*
              Example:
              21:00 -> 01:00

              After 01:00 and before 21:00
              office period has ended.
            */

            officeEnded =
                currentMinutes >= officeEndMinutes &&
                currentMinutes < officeStartMinutes;
        } else {
            officeEnded =
                currentMinutes >= officeEndMinutes;
        }

        /* =========================
           Last Date For Absent
        ========================= */

        let absentEndDate = today;

        /*
          If today's office hasn't ended,
          don't count today as absent yet.
        */

        if (!officeEnded) {
            const yesterday = new Date(
                `${today}T00:00:00`
            );

            yesterday.setDate(
                yesterday.getDate() - 1
            );

            absentEndDate =
                getPakistanDate(yesterday);
        }

        /* =========================
           Expected Working Days
        ========================= */

        let expectedWorkingDays = 0;

        if (
            employeeStartDate <=
            absentEndDate
        ) {
            expectedWorkingDays =
                getWorkingDays(
                    employeeStartDate,
                    absentEndDate
                );
        }

        /* =========================
           Marked Attendance
        ========================= */

        const markedAttendance =
            await Attendance.find({
                employeeId: user.employeeId,
            }).select("date status");

        /*
          Only count attendance records
          from employee joining date.
        */

        const validMarkedDays =
            new Set<string>();

        markedAttendance.forEach(
            (item) => {
                if (
                    item.date >=
                    employeeStartDate &&
                    item.date <=
                    absentEndDate
                ) {
                    validMarkedDays.add(
                        item.date
                    );
                }
            }
        );

        /* =========================
           Total Absent
        ========================= */

        const totalAbsent = Math.max(
            0,
            expectedWorkingDays -
            validMarkedDays.size
        );

        /* =========================
           Overall Attendance
        ========================= */

        const totalAttendanceDays =
            totalPresent +
            totalLate +
            totalAbsent;

        const attendancePercentage =
            totalAttendanceDays === 0
                ? 0
                : Math.round(
                    ((totalPresent +
                        totalLate) /
                        totalAttendanceDays) *
                    100
                );

        /* =========================
           This Month
        ========================= */

        const currentDate = new Date();

        const thisMonth =
            currentDate.getMonth() + 1;

        const thisYear =
            currentDate.getFullYear();

        const monthlyAttendance =
            markedAttendance.filter(
                (item) => {
                    const d = new Date(
                        `${item.date}T00:00:00`
                    );

                    return (
                        d.getMonth() + 1 ===
                        thisMonth &&
                        d.getFullYear() ===
                        thisYear
                    );
                }
            ).length;

        /* =========================
           Response
        ========================= */

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
        console.log(
            "Employee Dashboard Error:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message:
                    "Internal Server Error",
            },
            {
                status: 500,
            }
        );
    }
}