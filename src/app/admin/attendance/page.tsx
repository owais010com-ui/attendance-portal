"use client";

import {
    Users,
    CircleCheckBig,
    CircleX,
    Clock3,
    Search,
    CalendarDays,
    MapPinned,
    Eye,
} from "lucide-react";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function AdminAttendancePage() {
    const [attendance, setAttendance] = useState<Attendance[]>([]);
    const [search, setSearch] = useState("");

    interface Attendance {
        _id: string;
        employeeId: string;
        employeeName: string;
        email: string;
        photo: string;
        latitude: number;
        longitude: number;
        locationLink: string;
        date: string;
        checkIn: string;
        status: string;
        createdAt: string;
        updatedAt: string;
    }

    useEffect(() => {
        async function getAttendance() {
            const res = await fetch("/api/attendance");
            const data = await res.json();

            if (data.success) {
                setAttendance(data.attendance);
            }
        }

        getAttendance();
    }, []);

    const filteredAttendance = attendance.filter((employee) =>
        employee.employeeName
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    const totalEmployees = attendance.length;

    const presentEmployees = attendance.filter(
        (employee) => employee.status === "Present"
    ).length;

    // Temporary (jab tak employee collection nahi banta)
    const absentEmployees = 0;

    const lateEmployees = 0;

    return (
        <div className="w-full space-y-6">

            {/* Heading */}

            <div className="mb-8">

                <h1 className="text-2xl font-bold text-slate-800">
                    Attendance Dashboard
                </h1>

                <p className="mt-1 text-slate-500">
                    Manage all employee attendance records
                </p>

            </div>

            {/* Cards */}

            <div className="mt-8 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">

                {/* Total */}
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300">

                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                        <div>
                            <p className="text-gray-500">Total Records</p>

                            <h2 className="mt-1 text-3xl font-medium text-slate-900">
                                {totalEmployees}
                            </h2>
                        </div>

                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100">
                            <Users className="text-blue-600" size={26} />
                        </div>

                    </div>

                </div>

                {/* Present */}
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300">

                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                        <div>
                            <p className="text-gray-500">Present</p>

                            <h2 className="mt-1 text-3xl font-medium text-slate-900">
                                {presentEmployees}
                            </h2>
                        </div>

                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100">
                            <CircleCheckBig className="text-green-600" size={26} />
                        </div>

                    </div>

                </div>

                {/* Absent */}
                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300">

                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                        <div>
                            <p className="text-gray-500">Absent</p>

                            <h2 className="mt-1 text-3xl font-medium text-slate-900">
                                {absentEmployees}
                            </h2>
                        </div>

                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100">
                            <CircleX className="text-red-600" size={26} />
                        </div>

                    </div>

                </div>

                {/* Late */}
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300">

                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                        <div>
                            <p className="text-gray-500">Late</p>

                            <h2 className="mt-1 text-3xl font-medium text-slate-900">
                                {lateEmployees}
                            </h2>
                        </div>

                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100">
                            <Clock3 className="text-orange-600" size={26} />
                        </div>

                    </div>

                </div>

            </div>
            {/* Search */}

            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                <h2 className="text-xl font-semibold text-slate-800">
                    Attendance Records
                </h2>

                <div className="relative w-full md:w-80">

                    <Search
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                        type="text"
                        placeholder="Search employee..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="h-12 w-full rounded-xl border border-gray-200 bg-white pl-11 pr-4 shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    />

                </div>

            </div>

            {/* Table */}

            <div className="mt-8 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

                <div className="w-full overflow-x-auto">

                    <table className="min-w-[950px] w-full">

                        <thead className="border-b bg-slate-50">

                            <tr>

                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                                    Employee
                                </th>

                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                                    Date
                                </th>

                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                                    Check In
                                </th>

                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                                    Status
                                </th>

                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                                    Location
                                </th>

                                <th className="px-6 py-4 text-center text-sm font-semibold text-slate-600">
                                    Photo
                                </th>

                            </tr>

                        </thead>
                        <tbody>

                            {filteredAttendance.map((employee) => (

                                <tr
                                    key={employee._id}
                                    className="border-b last:border-0 transition hover:bg-slate-50"
                                >

                                    <td className="px-6 py-5">

                                        <div className="flex items-center gap-4">

                                            <Image
                                                src={employee.photo}
                                                alt={employee.employeeName}
                                                width={55}
                                                height={55}
                                                className="rounded-full border object-cover"
                                            />

                                            <div>

                                                <h3 className="font-semibold text-slate-800">
                                                    {employee.employeeName}
                                                </h3>

                                                <p className="text-sm text-gray-500">
                                                    {employee.email}
                                                </p>

                                                <p className="text-xs text-blue-600">
                                                    #{employee.employeeId}
                                                </p>

                                            </div>

                                        </div>

                                    </td>

                                    <td className="px-6 py-5">

                                        <div className="flex items-center gap-2 text-gray-700">

                                            <CalendarDays size={16} />

                                            {employee.date}

                                        </div>

                                    </td>

                                    <td className="px-6 py-5 font-medium text-slate-700">

                                        {employee.checkIn}

                                    </td>

                                    <td className="px-6 py-5">

                                        <span
                                            className={`rounded-full px-4 py-2 text-xs font-semibold
                                                    ${employee.status === "Present"
                                                    ? "bg-green-100 text-green-700"
                                                    : employee.status === "Late"
                                                        ? "bg-orange-100 text-orange-700"
                                                        : "bg-red-100 text-red-700"
                                                }`}
                                        >

                                            {employee.status}

                                        </span>

                                    </td>

                                    <td className="px-6 py-5">

                                        <a
                                            href={employee.locationLink}
                                            target="_blank"
                                            className="inline-flex items-center gap-2 rounded-lg bg-blue-50 px-4 py-2 font-medium text-blue-600 transition hover:bg-blue-100"
                                        >

                                            <MapPinned size={16} />

                                            View Map

                                        </a>

                                    </td>

                                    <td className="px-6 py-5 text-center">

                                        <button
                                            className="rounded-lg bg-slate-100 p-3 transition hover:bg-slate-200"
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