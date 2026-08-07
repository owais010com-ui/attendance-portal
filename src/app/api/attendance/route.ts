import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Attendance from "@/models/Attendance";
import User from "@/models/User";
import Settings from "@/models/Settings";
import { getCurrentUser } from "@/lib/auth";

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

/* =========================
   Pakistan Date
========================= */

function getPakistanDate() {
    return new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Karachi",
    }).format(new Date());
}

/* =========================
   Pakistan Current Time
   HH:mm -> minutes
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
   Convert HH:mm -> minutes
========================= */

function timeToMinutes(time: string) {
    const [hour, minute] = time.split(":").map(Number);

    return hour * 60 + minute;
}

/* =========================
   Normalize Late Time
========================= */

function getLateAfterMinutes(lateAfter: unknown) {
    if (
        lateAfter === null ||
        lateAfter === undefined ||
        lateAfter === ""
    ) {
        return 0;
    }

    /*
     * New format:
     * "03:50" = 3 hours 50 minutes
     */
    if (typeof lateAfter === "string") {
        if (lateAfter.includes(":")) {
            const [hours, minutes] = lateAfter
                .split(":")
                .map(Number);

            if (
                Number.isFinite(hours) &&
                Number.isFinite(minutes)
            ) {
                return hours * 60 + minutes;
            }
        }

        /*
         * Old format:
         * "10" = 10 minutes
         */
        const numericValue = Number(lateAfter);

        if (Number.isFinite(numericValue)) {
            return numericValue;
        }

        return 0;
    }

    /*
     * If old database has Number:
     * 10 = 10 minutes
     */
    if (typeof lateAfter === "number") {
        return Number.isFinite(lateAfter)
            ? lateAfter
            : 0;
    }

    return 0;
}

/* =========================
   Employee Marks Attendance
========================= */

export async function POST(req: Request) {
    try {
        const currentUser = await getCurrentUser();

        if (!currentUser) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Unauthorized",
                },
                { status: 401 }
            );
        }

        if (currentUser.role !== "employee") {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Only employees can mark attendance.",
                },
                { status: 403 }
            );
        }

        await connectDB();

        const {
            employeeId,
            employeeName,
            email,
            photo,
            latitude,
            longitude,
            locationLink,
        } = await req.json();

        /* =========================
           Required Fields
        ========================= */

        if (
            !employeeId ||
            !employeeName ||
            !email ||
            !photo ||
            latitude == null ||
            longitude == null ||
            !locationLink
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: "All fields are required.",
                },
                { status: 400 }
            );
        }

        /* =========================
           Get Logged-in Employee
        ========================= */

        const employee = await User.findById(
            currentUser.id
        );

        if (!employee) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Employee not found.",
                },
                { status: 404 }
            );
        }

        if (employee.role !== "employee") {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Only employees can mark attendance.",
                },
                { status: 403 }
            );
        }

        /* =========================
           Prevent Fake Employee Data
        ========================= */

        if (
            employee.employeeId !== employeeId ||
            employee.email !== email
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Invalid employee information.",
                },
                { status: 403 }
            );
        }

        /* =========================
           Get Admin Settings
        ========================= */

        const settings = await Settings.findOne();

        const officeStart =
            settings?.officeStart || "09:00";

        const officeEnd =
            settings?.officeEnd || "18:00";

        const lateAfterMinutes =
            getLateAfterMinutes(
                settings?.lateAfter
            );

        const officeStartMinutes =
            timeToMinutes(officeStart);

        const officeEndMinutes =
            timeToMinutes(officeEnd);

        /* =========================
           Calculate Late Time

           Example:

           Start = 09:00
           Late = 03:50

           09:00 + 03:50
           = 12:50

           After 12:50 = Late
        ========================= */

        let lateMinutes =
            officeStartMinutes +
            lateAfterMinutes;

        /*
         * Keep time inside 24 hours.
         */
        if (lateMinutes >= 24 * 60) {
            lateMinutes =
                lateMinutes % (24 * 60);
        }

        const currentMinutes =
            getPakistanTimeInMinutes();

        /* =========================
           Office Overnight Check
           
           Example:
           21:00 -> 01:00
        ========================= */

        const isOvernight =
            officeEndMinutes <=
            officeStartMinutes;

        let attendanceAllowed = false;

        if (isOvernight) {
            attendanceAllowed =
                currentMinutes >=
                officeStartMinutes ||
                currentMinutes <
                officeEndMinutes;
        } else {
            attendanceAllowed =
                currentMinutes >=
                officeStartMinutes &&
                currentMinutes <
                officeEndMinutes;
        }

        /* =========================
           Before Office Start
        ========================= */

        if (
            !isOvernight &&
            currentMinutes <
            officeStartMinutes
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: `Attendance starts at ${officeStart}.`,
                },
                { status: 400 }
            );
        }

        /* =========================
           Attendance Closed
        ========================= */

        if (!attendanceAllowed) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        `Attendance time has ended. ` +
                        `Office ended at ${officeEnd}.`,
                },
                { status: 400 }
            );
        }

        /* =========================
           Pakistan Date
        ========================= */

        const date = getPakistanDate();

        /* =========================
           Already Marked
        ========================= */

        const alreadyMarked =
            await Attendance.findOne({
                employeeId:
                    employee.employeeId,
                date,
            });

        if (alreadyMarked) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Attendance already marked.",
                },
                { status: 400 }
            );
        }

        /* =========================
           Present / Late

           00:00 = No Late
        ========================= */

        let status:
            | "Present"
            | "Late" = "Present";

        if (
            lateAfterMinutes > 0 &&
            currentMinutes > lateMinutes
        ) {
            status = "Late";
        }

        /* =========================
           Server Check-in Time
        ========================= */

        const checkIn =
            new Intl.DateTimeFormat(
                "en-US",
                {
                    timeZone: "Asia/Karachi",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                }
            ).format(new Date());

        /* =========================
           Create Attendance
        ========================= */

        await Attendance.create({
            employeeId:
                employee.employeeId,

            employeeName:
                employee.name,

            email:
                employee.email,

            photo,

            latitude,

            longitude,

            locationLink,

            date,

            checkIn,

            status,
        });

        return NextResponse.json({
            success: true,

            message:
                "Attendance marked successfully.",

            status,

            date,

            checkIn,
        });
    } catch (error) {
        console.log(
            "Mark Attendance Error:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message:
                    "Internal Server Error",
            },
            { status: 500 }
        );
    }
}

/* =========================
   Admin Attendance List
========================= */

export async function GET(
    req: NextRequest
) {
    try {
        const currentUser =
            await getCurrentUser();

        if (!currentUser) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Unauthorized",
                },
                { status: 401 }
            );
        }

        if (
            currentUser.role !== "admin"
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Access denied. Admin only.",
                },
                { status: 403 }
            );
        }

        await connectDB();

        const searchParams =
            req.nextUrl.searchParams;

        const selectedDate =
            searchParams.get("date") ||
            getPakistanDate();

        /* =========================
           All Employees
        ========================= */

        const employees =
            await User.find({
                role: "employee",
            }).sort({
                name: 1,
            });

        /* =========================
           Attendance
        ========================= */

        const attendance =
            await Attendance.find({
                date: selectedDate,
            });

        const attendanceMap =
            new Map<
                string,
                typeof attendance[number]
            >();

        attendance.forEach((item) => {
            attendanceMap.set(
                item.employeeId,
                item
            );
        });

        const finalAttendance:
            AttendanceResponse[] = [];

        /* =========================
           Build List
        ========================= */

        employees.forEach(
            (employee) => {
                const record =
                    attendanceMap.get(
                        employee.employeeId
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
                    /* =========================
                       No Record = Absent
                    ========================= */

                    finalAttendance.push({
                        _id:
                            employee._id.toString(),

                        employeeId:
                            employee.employeeId,

                        employeeName:
                            employee.name,

                        email:
                            employee.email,

                        photo:
                            employee.profileImage ||
                            "",

                        latitude: null,

                        longitude: null,

                        locationLink: "",

                        date:
                            selectedDate,

                        checkIn: "--",

                        status: "Absent",

                        createdAt:
                            new Date(0),

                        updatedAt:
                            new Date(0),
                    });
                }
            }
        );

        /* =========================
           Search
        ========================= */

        const search =
            searchParams
                .get("search")
                ?.toLowerCase() || "";

        const filteredAttendance =
            finalAttendance.filter(
                (item) => {
                    if (!search) {
                        return true;
                    }

                    return (
                        item.employeeName
                            .toLowerCase()
                            .includes(
                                search
                            ) ||
                        item.employeeId
                            .toLowerCase()
                            .includes(
                                search
                            ) ||
                        item.email
                            .toLowerCase()
                            .includes(
                                search
                            )
                    );
                }
            );

        /* =========================
           Sort
        ========================= */

        filteredAttendance.sort(
            (a, b) => {
                if (
                    a.status === "Absent" &&
                    b.status !== "Absent"
                ) {
                    return 1;
                }

                if (
                    a.status !== "Absent" &&
                    b.status === "Absent"
                ) {
                    return -1;
                }

                return (
                    new Date(
                        b.createdAt
                    ).getTime() -
                    new Date(
                        a.createdAt
                    ).getTime()
                );
            }
        );

        return NextResponse.json({
            success: true,
            attendance:
                filteredAttendance,
        });
    } catch (error) {
        console.log(
            "Get Attendance Error:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message:
                    "Something went wrong.",
            },
            {
                status: 500,
            }
        );
    }
}