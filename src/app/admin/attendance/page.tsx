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
import { useEffect, useMemo, useState } from "react";

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
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [selectedDate, setSelectedDate] = useState("");

    const ITEMS_PER_PAGE = 10;
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {

        async function getAttendance() {

            setCurrentPage(1);
            try {

                setLoading(true);

                const res = await fetch(`/api/attendance?date=${selectedDate || new Date().toLocaleDateString("en-CA")}&search=${search}`, {
                    cache: "no-store",
                });

                const data = await res.json();

                console.log(data.attendance);

                if (data.success) {
                    setAttendance(data.attendance);
                }

            } catch (error) {

                console.log(error);

            } finally {

                setLoading(false);

            }

        }

        getAttendance();

    }, [selectedDate, search]);

    const filteredAttendance = useMemo(() => {

        const value = search.toLowerCase();

        return attendance.filter((employee) => {

            const matchesSearch =
                (employee.employeeName ?? "").toLowerCase().includes(value) ||
                (employee.email ?? "").toLowerCase().includes(value) ||
                (employee.employeeId ?? "").toLowerCase().includes(value);

            const matchesDate =
                selectedDate === "" ||
                employee.date === selectedDate;

            return matchesSearch && matchesDate;

        });

    }, [attendance, search, selectedDate]);

    // ===== Stats =====

    const totalRecords = filteredAttendance.length;

    const today = new Date().toLocaleDateString("en-CA");

    const todayAttendance = filteredAttendance.filter(
        (item) => item.date === today
    ).length;

    const lateEmployees = filteredAttendance.filter(
        (item) => item.status === "Late"
    ).length;

    const absentEmployees = filteredAttendance.filter(
        (item) => item.status === "Absent"
    ).length;

    // ===== Pagination =====

    const totalPages = Math.max(
        1,
        Math.ceil(filteredAttendance.length / ITEMS_PER_PAGE)
    );

    const paginatedAttendance = filteredAttendance.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    if (loading) {

        return (

            <div className="space-y-6">

                <div className="h-8 w-64 animate-pulse rounded bg-gray-200" />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

                    {[1, 2, 3, 4].map((item) => (

                        <div
                            key={item}
                            className="h-28 animate-pulse rounded-2xl bg-white shadow"
                        />

                    ))}

                </div>

                <div className="h-[500px] animate-pulse rounded-2xl bg-white shadow" />

            </div>

        );

    }

    return (

        <div className="space-y-6">

            <div>

                <h1 className="text-3xl font-semibold text-slate-800">
                    Attendance History
                </h1>

                <p className="mt-1 text-slate-500">
                    View and manage daily employee attendance records.
                </p>

            </div>

            {/* Stats */}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

                <div className="rounded-2xl bg-white p-5 shadow-sm">

                    <div className="flex items-center justify-between">

                        <div>

                            <p className="text-sm text-slate-500">
                                Total Records
                            </p>

                            <h2 className="mt-2 text-3xl font-bold">
                                {totalRecords}
                            </h2>

                        </div>

                        <div className="rounded-2xl bg-blue-100 p-3">
                            <Users className="text-blue-600" />
                        </div>

                    </div>

                </div>

                <div className="rounded-2xl bg-white p-5 shadow-sm">

                    <div className="flex items-center justify-between">

                        <div>

                            <p className="text-sm text-slate-500">
                                Todays Check-ins
                            </p>

                            <h2 className="mt-2 text-3xl font-bold">
                                {todayAttendance}
                            </h2>

                        </div>

                        <div className="rounded-2xl bg-green-100 p-3">
                            <CircleCheckBig className="text-green-600" />
                        </div>

                    </div>

                </div>

                <div className="rounded-2xl bg-white p-5 shadow-sm">

                    <div className="flex items-center justify-between">

                        <div>

                            <p className="text-sm text-slate-500">
                                Late
                            </p>

                            <h2 className="mt-2 text-3xl font-bold">
                                {lateEmployees}
                            </h2>

                        </div>

                        <div className="rounded-2xl bg-yellow-100 p-3">
                            <Clock3 className="text-yellow-600" />
                        </div>

                    </div>

                </div>

                <div className="rounded-2xl bg-white p-5 shadow-sm">

                    <div className="flex items-center justify-between">

                        <div>

                            <p className="text-sm text-slate-500">
                                Absent
                            </p>

                            <h2 className="mt-2 text-3xl font-bold">
                                {absentEmployees}
                            </h2>

                        </div>

                        <div className="rounded-2xl bg-red-100 p-3">
                            <CircleX className="text-red-600" />
                        </div>

                    </div>

                </div>

            </div>

            {/* Filters */}

            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                <h2 className="text-xl font-semibold text-slate-800">
                    Daily Attendance
                </h2>

                <div className="flex flex-col gap-3 md:flex-row">

                    <div className="relative w-full md:w-80">

                        <Search
                            size={18}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                        />

                        <input
                            type="text"
                            placeholder="Search employee..."
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="h-11 w-full rounded-xl border border-gray-200 bg-white pl-11 pr-4 text-gray-900 placeholder:text-gray-400 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
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
                            onChange={(e) => {
                                setSelectedDate(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="h-11 rounded-xl border border-gray-200 bg-white pl-11 pr-4 text-gray-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                        />

                    </div>

                </div>

            </div>


            {/* Desktop Table */}

            <div className="hidden overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm md:block">

                <div className="overflow-x-auto">

                    <table className="min-w-[1100px] w-full">

                        <thead className="border-b bg-slate-50">

                            <tr>

                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                                    Employee
                                </th>

                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                                    Date
                                </th>

                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                                    Check In
                                </th>

                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                                    Status
                                </th>

                                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">
                                    Location
                                </th>

                                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">
                                    Photo
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {paginatedAttendance.length > 0 ? (

                                paginatedAttendance.map((employee) => (

                                    <tr
                                        key={employee._id}
                                        className="border-b transition hover:bg-slate-50"
                                    >

                                        <td className="px-6 py-4">

                                            <div className="flex items-center gap-3">

                                                {employee.photo ? (
                                                    <Image
                                                        src={employee.photo}
                                                        alt={employee.employeeName}
                                                        width={50}
                                                        height={50}
                                                        className="h-12 w-12 rounded-full border object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 font-semibold text-white">
                                                        {employee.employeeName.charAt(0).toUpperCase()}
                                                    </div>
                                                )}

                                                <div>

                                                    <h3 className="font-semibold text-slate-800">
                                                        {employee.employeeName}
                                                    </h3>

                                                    <p className="text-sm text-gray-500">
                                                        {employee.email}
                                                    </p>

                                                    <span className="text-xs font-medium text-blue-600">
                                                        {employee.employeeId}
                                                    </span>

                                                </div>

                                            </div>

                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <CalendarDays size={16} />
                                                {employee.date}
                                            </div>
                                        </td>

                                        <td className="px-6 py-4">
                                            {employee.checkIn}
                                        </td>

                                        <td className="px-6 py-4">

                                            <span
                                                className={`rounded-full px-3 py-1 text-xs font-semibold ${employee.status === "Present"
                                                    ? "bg-green-100 text-green-700"
                                                    : employee.status === "Late"
                                                        ? "bg-yellow-100 text-yellow-700"
                                                        : "bg-red-100 text-red-700"
                                                    }`}
                                            >
                                                {employee.status}
                                            </span>

                                        </td>

                                        <td className="px-6 py-4 text-center">

                                            {employee.status === "Absent" ? (
                                                <button
                                                    disabled
                                                    className="inline-flex cursor-not-allowed items-center gap-2 rounded-lg bg-gray-300 px-4 py-2 text-gray-500"
                                                >
                                                    <MapPinned size={16} />
                                                    No Location
                                                </button>
                                            ) : (
                                                <a
                                                    href={employee.locationLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
                                                >
                                                    <MapPinned size={16} />
                                                    View Map
                                                </a>
                                            )}

                                        </td>

                                        <td className="px-6 py-4 text-center">

                                            <button
                                                disabled={employee.status === "Absent"}
                                                onClick={() => {
                                                    if (employee.status !== "Absent") {
                                                        window.open(employee.photo, "_blank");
                                                    }
                                                }}
                                                className={`inline-flex items-center justify-center rounded-lg p-3 text-white transition ${employee.status === "Absent"
                                                    ? "cursor-not-allowed bg-gray-300 text-gray-500"
                                                    : "bg-slate-800 hover:bg-slate-700"
                                                    }`}
                                            >
                                                <Eye size={18} />
                                            </button>

                                        </td>

                                    </tr>

                                ))

                            ) : (

                                <tr>

                                    <td
                                        colSpan={6}
                                        className="py-10 text-center text-gray-500"
                                    >
                                        No attendance found.
                                    </td>

                                </tr>

                            )}

                        </tbody>

                    </table>

                </div>

            </div>

            {/* Mobile Cards */}

            <div className="space-y-4 md:hidden">

                {paginatedAttendance.length > 0 ? (

                    paginatedAttendance.map((employee) => (

                        <div
                            key={employee._id}
                            className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
                        >

                            <div className="flex items-center gap-3 border-b p-4">

                                {employee.photo ? (
                                    <Image
                                        src={employee.photo}
                                        alt={employee.employeeName}
                                        width={56}
                                        height={56}
                                        className="h-14 w-14 rounded-full border object-cover"
                                    />
                                ) : (
                                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 font-semibold text-white">
                                        {employee.employeeName.charAt(0).toUpperCase()}
                                    </div>
                                )}

                                <div className="min-w-0 flex-1">

                                    <h3 className="truncate font-semibold text-slate-800">
                                        {employee.employeeName}
                                    </h3>

                                    <p className="truncate text-sm text-gray-500">
                                        {employee.email}
                                    </p>

                                    <span className="text-xs font-medium text-blue-600">
                                        {employee.employeeId}
                                    </span>

                                </div>

                            </div>

                            <div className="space-y-3 p-4 text-sm">

                                <div className="flex items-center justify-between">

                                    <span className="text-gray-500">
                                        Date
                                    </span>

                                    <span className="font-medium">
                                        {employee.date}
                                    </span>

                                </div>

                                <div className="flex items-center justify-between">

                                    <span className="text-gray-500">
                                        Check In
                                    </span>

                                    <span className="font-medium">
                                        {employee.checkIn}
                                    </span>

                                </div>

                                <div className="flex items-center justify-between">

                                    <span className="text-gray-500">
                                        Status
                                    </span>

                                    <span
                                        className={`rounded-full px-3 py-1 text-xs font-semibold ${employee.status === "Present"
                                            ? "bg-green-100 text-green-700"
                                            : employee.status === "Late"
                                                ? "bg-yellow-100 text-yellow-700"
                                                : "bg-red-100 text-red-700"
                                            }`}
                                    >
                                        {employee.status}
                                    </span>

                                </div>

                            </div>

                            <div className="grid grid-cols-2 gap-3 border-t p-4">

                                {employee.status === "Absent" ? (
                                    <button
                                        disabled
                                        className="flex cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-gray-300 py-3 text-gray-500"
                                    >
                                        <MapPinned size={18} />
                                        No Location
                                    </button>
                                ) : (
                                    <a
                                        href={employee.locationLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-white transition hover:bg-blue-700"
                                    >
                                        <MapPinned size={18} />
                                        Map
                                    </a>
                                )}

                                {employee.status === "Absent" ? (
                                    <button
                                        disabled
                                        className="flex cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-gray-300 py-3 text-gray-500"
                                    >
                                        <Eye size={18} />
                                        No Photo
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => window.open(employee.photo, "_blank")}
                                        className="flex items-center justify-center gap-2 rounded-xl bg-slate-800 py-3 text-white transition hover:bg-slate-700"
                                    >
                                        <Eye size={18} />
                                        Photo
                                    </button>
                                )}

                            </div>

                        </div>

                    ))

                ) : (

                    <div className="rounded-2xl bg-white py-10 text-center text-gray-500 shadow-sm">
                        No attendance found.
                    </div>

                )}

            </div>

            {/* Pagination */}

            {filteredAttendance.length > 0 && (

                <div className="flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">

                    <p className="text-sm text-gray-500">
                        Showing{" "}
                        {(currentPage - 1) * ITEMS_PER_PAGE + 1}
                        {" - "}
                        {Math.min(
                            currentPage * ITEMS_PER_PAGE,
                            filteredAttendance.length
                        )}{" "}
                        of {filteredAttendance.length}
                    </p>

                    <div className="flex gap-2">

                        <button
                            onClick={() =>
                                setCurrentPage((prev) =>
                                    Math.max(prev - 1, 1)
                                )
                            }
                            disabled={currentPage === 1}
                            className="rounded-xl border border-gray-300 bg-white px-5 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Previous
                        </button>

                        <div className="flex items-center rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white">
                            {currentPage} / {totalPages}
                        </div>

                        <button
                            onClick={() =>
                                setCurrentPage((prev) =>
                                    Math.min(prev + 1, totalPages)
                                )
                            }
                            disabled={currentPage === totalPages}
                            className="rounded-xl bg-blue-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Next
                        </button>

                    </div>

                </div>

            )}

        </div>

    );

}