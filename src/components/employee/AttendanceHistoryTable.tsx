"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
    Search,
    CalendarDays,
    MapPinned,
    Eye,
    CircleCheckBig,
} from "lucide-react";

interface Attendance {
    _id: string;
    employeeId: string;
    employeeName: string;
    email: string;
    photo: string;
    locationLink: string;
    date: string;
    checkIn: string;
    status: string;
}

interface User {
    employeeId: string;
}

export default function AttendanceHistoryTable() {

    const [attendance, setAttendance] = useState<Attendance[]>([]);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [selectedDate, setSelectedDate] = useState("");

    useEffect(() => {

        async function loadData() {
            try {

                const userRes = await fetch("/api/auth/me", {
                    cache: "no-store",
                });

                const userData = await userRes.json();

                if (!userData.success) return;

                setUser(userData.user);

                const attendanceRes = await fetch("/api/attendance", {
                    cache: "no-store",
                });

                const attendanceData = await attendanceRes.json();

                if (attendanceData.success) {

                    const records = attendanceData.attendance.filter(
                        (item: Attendance) =>
                            item.employeeId === userData.user.employeeId
                    );

                    setAttendance(records);
                }

            } finally {
                setLoading(false);
            }
        }

        loadData();

    }, []);

    const filteredAttendance = attendance.filter((item) => {

        const matchSearch =
            item.employeeName.toLowerCase().includes(search.toLowerCase()) ||
            item.employeeId.toLowerCase().includes(search.toLowerCase());

        const matchDate =
            selectedDate === "" || item.date === selectedDate;

        return matchSearch && matchDate;

    });

    if (loading) {
        return (
            <div className="rounded-2xl bg-white p-10 text-center">
                Loading...
            </div>
        );
    }

    return (
        <div className="space-y-6">

            {/* Stats */}

            <div className="rounded-2xl bg-white p-5 shadow-sm">

                <div className="flex items-center justify-between">

                    <div>

                        <p className="text-sm text-slate-500">
                            Total Present
                        </p>

                        <h2 className="mt-1 text-3xl font-bold">
                            {attendance.length}
                        </h2>

                    </div>

                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100">
                        <CircleCheckBig className="text-green-600" />
                    </div>

                </div>

            </div>

            {/* Filters */}

            <div className="flex flex-col gap-4 md:flex-row md:justify-between">

                <div className="relative w-full md:w-80">

                    <Search
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                        type="text"
                        placeholder="Search..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="h-11 w-full rounded-xl border pl-11 pr-4"
                    />

                </div>

                <div className="relative">

                    <CalendarDays
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="h-11 rounded-xl border pl-11 pr-4"
                    />

                </div>

            </div>

            {/* Table */}

            <div className="overflow-hidden rounded-2xl border bg-white">

                <div className="overflow-x-auto">

                    <table className="w-full">

                        <thead className="border-b bg-slate-50">

                            <tr>

                                <th className="px-6 py-4 text-left">
                                    Date
                                </th>

                                <th className="px-6 py-4 text-left">
                                    Check In
                                </th>

                                <th className="px-6 py-4 text-left">
                                    Status
                                </th>

                                <th className="px-6 py-4 text-left">
                                    Location
                                </th>

                                <th className="px-6 py-4 text-left">
                                    Photo
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {filteredAttendance.map((item) => (

                                <tr
                                    key={item._id}
                                    className="border-b"
                                >

                                    <td className="px-6 py-4">
                                        {item.date}
                                    </td>

                                    <td className="px-6 py-4">
                                        {item.checkIn}
                                    </td>

                                    <td className="px-6 py-4">

                                        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                                            {item.status}
                                        </span>

                                    </td>

                                    <td className="px-6 py-4">

                                        <a
                                            href={item.locationLink}
                                            target="_blank"
                                            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white"
                                        >
                                            <MapPinned size={16} />
                                            View
                                        </a>

                                    </td>

                                    <td className="px-6 py-4">

                                        <button
                                            onClick={() => window.open(item.photo, "_blank")}
                                            className="rounded-lg bg-blue-600 p-3 text-white"
                                        >
                                            <Eye size={18} />
                                        </button>

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>
    );
}