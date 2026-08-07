import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

import { connectDB } from "@/lib/db";
import Attendance from "@/models/Attendance";
import User from "@/models/User";

const JWT_SECRET = process.env.JWT_SECRET!;

function getPakistanDate(date: Date) {
    return new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Karachi",
    }).format(date);
}

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
                {
                    status: 401,
                }
            );
        }

        const decoded = jwt.verify(
            token,
            JWT_SECRET
        ) as {
            id: string;
            employeeId: string;
        };

        const { searchParams } = new URL(req.url);

        const month = Number(
            searchParams.get("month")
        );

        const year = Number(
            searchParams.get("year")
        );

        if (
            !month ||
            !year ||
            month < 1 ||
            month > 12
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid month or year.",
                },
                {
                    status: 400,
                }
            );
        }

        /*
         * Get current employee
         */
        const employee = await User.findById(
            decoded.id
        );

        if (!employee) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Employee not found.",
                },
                {
                    status: 404,
                }
            );
        }

        /*
         * Employee creation date
         *
         * Example:
         * Employee added on 2026-08-08
         * Attendance starts from 2026-08-08
         */
        const employeeCreatedDate =
            getPakistanDate(
                employee.createdAt
            );

        /*
         * Today's Pakistan date
         */
        const today =
            getPakistanDate(new Date());

        /*
         * Get attendance records
         */
        const attendance =
            await Attendance.find({
                employeeId:
                    decoded.employeeId,
            }).sort({
                createdAt: -1,
            });

        /*
         * Attendance map
         */
        const attendanceMap = new Map<
            string,
            (typeof attendance)[number]
        >();

        attendance.forEach((item) => {
            attendanceMap.set(
                item.date,
                item
            );
        });

        /*
         * Days in selected month
         */
        const daysInMonth =
            new Date(
                year,
                month,
                0
            ).getDate();

        const finalAttendance = [];

        for (
            let day = 1;
            day <= daysInMonth;
            day++
        ) {
            const dateObject =
                new Date(
                    year,
                    month - 1,
                    day
                );

            const dateString =
                `${year}-${String(
                    month
                ).padStart(
                    2,
                    "0"
                )}-${String(day).padStart(
                    2,
                    "0"
                )}`;

            /*
             * 0 = Sunday
             */
            const dayOfWeek =
                dateObject.getDay();

            /*
             * Sunday = OFF
             */
            if (dayOfWeek === 0) {
                continue;
            }

            /*
             * Future date
             */
            if (dateString > today) {
                continue;
            }

            /*
             * Employee was not created yet
             *
             * Don't show Absent before
             * employee joined.
             */
            if (
                dateString <
                employeeCreatedDate
            ) {
                continue;
            }

            /*
             * Existing attendance
             */
            const record =
                attendanceMap.get(
                    dateString
                );

            if (record) {
                finalAttendance.push({
                    _id:
                        record._id.toString(),

                    employeeId:
                        record.employeeId,

                    employeeName:
                        record.employeeName,

                    email:
                        record.email,

                    photo:
                        record.photo,

                    latitude:
                        record.latitude,

                    longitude:
                        record.longitude,

                    locationLink:
                        record.locationLink,

                    date:
                        record.date,

                    checkIn:
                        record.checkIn,

                    status:
                        record.status,

                    createdAt:
                        record.createdAt,

                    updatedAt:
                        record.updatedAt,
                });
            } else {
                /*
                 * No attendance =
                 * Absent
                 */
                finalAttendance.push({
                    _id:
                        `absent-${dateString}`,

                    employeeId:
                        decoded.employeeId,

                    employeeName:
                        employee.name,

                    email:
                        employee.email,

                    photo:
                        employee.profileImage || "",

                    latitude: null,

                    longitude: null,

                    locationLink: "",

                    date:
                        dateString,

                    checkIn: "--",

                    status: "Absent",

                    createdAt:
                        new Date(
                            `${dateString}T00:00:00`
                        ),

                    updatedAt:
                        new Date(
                            `${dateString}T00:00:00`
                        ),
                });
            }
        }

        /*
         * Latest date first
         */
        finalAttendance.sort(
            (a, b) =>
                new Date(
                    b.date
                ).getTime() -
                new Date(
                    a.date
                ).getTime()
        );

        return NextResponse.json({
            success: true,
            attendance:
                finalAttendance,
        });
    } catch (error) {
        console.log(
            "Monthly Attendance Error:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message:
                    "Something went wrong",
            },
            {
                status: 500,
            }
        );
    }
}