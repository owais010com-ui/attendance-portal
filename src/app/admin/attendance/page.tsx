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

export default function AdminAttendancePage() {
    const [attendance, setAttendance] = useState<Attendance[]>([]);
    const [search, setSearch] = useState("");

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

    const absentEmployees = 0;
    const lateEmployees = 0;

    return (
        <div className="space-y-6">

            {/* Heading */}

            <div>
                <h1 className="text-3xl font-medium text-slate-800">
                    Attendance Dashboard
                </h1>

                <p className="mt-1 text-slate-500">
                    Manage all employee attendance records
                </p>
            </div>

            {/* Cards */}

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">

                {/* Total */}

                <div className="rounded-2xl bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">

                        <div>
                            <p className="text-sm text-slate-500">
                                Total Records
                            </p>

                            <h2 className="mt-1 text-3xl font-medium text-gray-900">
                                {totalEmployees}
                            </h2>
                        </div>

                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100">
                            <Users size={26} className="text-blue-600" />
                        </div>

                    </div>
                </div>

                {/* Present */}

                <div className="rounded-2xl bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">

                        <div>
                            <p className="text-sm text-slate-500">
                                Present
                            </p>

                            <h2 className="mt-1 text-3xl font-medium text-gray-900">
                                {presentEmployees}
                            </h2>
                        </div>

                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100">
                            <CircleCheckBig size={26} className="text-green-600" />
                        </div>

                    </div>
                </div>

                {/* Absent */}

                <div className="rounded-2xl bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">

                        <div>
                            <p className="text-sm text-slate-500">
                                Absent
                            </p>

                            <h2 className="mt-1 text-3xl font-medium text-gray-900">
                                {absentEmployees}
                            </h2>
                        </div>

                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100">
                            <CircleX size={26} className="text-red-600" />
                        </div>

                    </div>
                </div>

                {/* Late */}

                <div className="rounded-2xl bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">

                        <div>
                            <p className="text-sm text-slate-500">
                                Late
                            </p>

                            <h2 className="mt-1 text-3xl font-medium text-gray-900">
                                {lateEmployees}
                            </h2>
                        </div>

                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100">
                            <Clock3 size={26} className="text-orange-600" />
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
                        className="h-11 w-full rounded-xl border border-gray-200 bg-white pl-11 pr-4 shadow-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    />

                </div>

            </div>

            {/* Desktop Table */}

            <div className="hidden md:block overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

                <div className="overflow-x-auto">
                    <div className="min-w-[900px]">
                        <table className="w-full">

                            <thead className="bg-slate-50 border-b">

                                <tr>

                                    <th className="px-4 md:px-6 py-4 text-left text-sm font-semibold text-gray-600 whitespace-nowrap">
                                        Employee
                                    </th>

                                    <th className="px-4 md:px-6 py-4 text-left text-sm font-semibold text-gray-600 whitespace-nowrap">
                                        Date
                                    </th>

                                    <th className="px-4 md:px-6 py-4 text-left text-sm font-semibold text-gray-600 whitespace-nowrap">
                                        Check In
                                    </th>

                                    <th className="px-4 md:px-6 py-4 text-left text-sm font-semibold text-gray-600 whitespace-nowrap">
                                        Status
                                    </th>

                                    <th className="px-4 md:px-6 py-4 text-left text-sm font-semibold text-gray-600 whitespace-nowrap">
                                        Location
                                    </th>

                                    <th className="px-4 py-4 text-left text-sm font-semibold text-gray-600 whitespace-nowrap">
                                        Photo
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {filteredAttendance.map((employee) => (

                                    <tr
                                        key={employee._id}
                                        className="border-b last:border-0 hover:bg-slate-50 transition"
                                    >

                                        {/* Employee */}

                                        <td className="px-4 py-4 whitespace-nowrap">

                                            <div className="flex items-center gap-4">

                                                <Image
                                                    src={employee.photo}
                                                    alt={employee.employeeName}
                                                    width={55}
                                                    height={55}
                                                    className="rounded-full border object-cover"
                                                />

                                                <div className="max-w-[220px]">

                                                    <h3 className="font-semibold text-slate-800">
                                                        {employee.employeeName}
                                                    </h3>

                                                    <p className="truncate text-sm text-slate-500">
                                                        {employee.email}
                                                    </p>

                                                    <p className="text-xs font-medium text-blue-600">
                                                        {employee.employeeId}
                                                    </p>

                                                </div>

                                            </div>

                                        </td>

                                        {/* Date */}

                                        <td className="px-4 py-4 whitespace-nowrap">

                                            <div className="flex items-center gap-2 text-slate-700">

                                                <CalendarDays size={16} />

                                                {employee.date}

                                            </div>

                                        </td>

                                        {/* Check In */}

                                        <td className="px-4 py-4 whitespace-nowrap">
                                            {employee.checkIn}
                                        </td>

                                        {/* Status */}

                                        <td className="px-4 py-4 whitespace-nowrap">

                                            <span
                                                className={`rounded-full px-4 py-2 text-xs font-semibold ${employee.status === "Present"
                                                    ? "bg-green-100 text-green-700"
                                                    : employee.status === "Late"
                                                        ? "bg-orange-100 text-orange-700"
                                                        : "bg-red-100 text-red-700"
                                                    }`}
                                            >
                                                {employee.status}
                                            </span>

                                        </td>

                                        {/* Location */}

                                        <td className="px-4 py-4 whitespace-nowrap">

                                            <a
                                                href={employee.locationLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 whitespace-nowrap rounded-lg bg-blue-600 px-4 py-2 font-medium  hover:bg-blue-300 transition" 
                                            >

                                                <MapPinned size={16} />

                                                View Map

                                            </a>

                                        </td>

                                        {/* Photo */}

                                        <td className="px-4 py-4 whitespace-nowrap">

                                            <button
                                                onClick={() => window.open(employee.photo)}
                                                className="cursor-pointer inline-flex items-center justify-center rounded-lg bg-blue-600 p-3 hover:bg-blue-300 transition"
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
            {/* Mobile Cards */}

            <div className="space-y-4 md:hidden">
                {filteredAttendance.map((employee) => (

                    <div
                        key={employee._id}
                        className="rounded-2xl border border-gray-200 bg-white shadow-sm"
                    >

                        <div className="flex items-center justify-between border-b p-4">

                            <div className="flex items-center gap-3">

                                <Image
                                    src={employee.photo}
                                    alt={employee.employeeName}
                                    width={50}
                                    height={50}
                                    className="rounded-full border"
                                />

                                <div>

                                    <h3 className="font-semibold">
                                        {employee.employeeName}
                                    </h3>

                                    <p className="text-sm text-gray-500">
                                        {employee.email}
                                    </p>

                                    <p className="text-xs text-blue-600">
                                        {employee.employeeId}
                                    </p>

                                </div>

                            </div>

                            <button
                                onClick={() => window.open(employee.photo)}
                                className="inline-flex items-center justify-center rounded-lg bg-blue-600 p-3 hover:bg-blue-300 transition"
                            >
                                <Eye size={18} />
                            </button>

                        </div>

                        <div className="divide-y">

                            <div className="flex justify-between p-4">

                                <span className="text-gray-500">
                                    Date
                                </span>

                                <span>
                                    {employee.date}
                                </span>

                            </div>

                            <div className="flex justify-between p-4">

                                <span className="text-gray-500">
                                    Check In
                                </span>

                                <span>
                                    {employee.checkIn}
                                </span>

                            </div>

                            <div className="flex items-center justify-between p-4">

                                <span className="text-gray-500">
                                    Status
                                </span>

                                <span
                                    className={`rounded-full px-3 py-1 text-xs font-semibold ${employee.status === "Present"
                                        ? "bg-green-100 text-green-700"
                                        : employee.status === "Late"
                                            ? "bg-orange-100 text-orange-700"
                                            : "bg-red-100 text-red-700"
                                        }`}
                                >
                                    {employee.status}
                                </span>

                            </div>

                        </div>

                        <div className="p-4">

                            <a
                                href={employee.locationLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 hover:bg-blue-300 transition"
                            >

                                <MapPinned size={18} />

                                View Map

                            </a>

                        </div>

                    </div>

                ))}
            </div>

        </div>
    );
}