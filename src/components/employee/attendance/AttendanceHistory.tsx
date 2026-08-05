"use client";

import { useMemo, useState } from "react";
import { Eye, MapPin } from "lucide-react";

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

interface AttendanceHistoryProps {
    attendanceHistory: Attendance[];
}
const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];
const currentMonth = new Date().getMonth() + 1;

const currentYear = new Date().getFullYear();


export default function AttendanceHistory({
    attendanceHistory,
}: AttendanceHistoryProps) {

    const currentDate = new Date();

    const [selectedMonth, setSelectedMonth] = useState(
        currentDate.getMonth() + 1
    );

    const [selectedYear, setSelectedYear] = useState(
        currentDate.getFullYear()
    );

    const [currentPage, setCurrentPage] = useState(1);

    const recordsPerPage = 10;
    const filteredAttendance = useMemo(() => {
        return attendanceHistory.filter((item) => {
            const date = new Date(item.date);

            return (
                date.getMonth() + 1 === selectedMonth &&
                date.getFullYear() === selectedYear
            );
        });
    }, [attendanceHistory, selectedMonth, selectedYear]);

    const totalPages = Math.ceil(
        filteredAttendance.length / recordsPerPage
    );

    const startIndex =
        (currentPage - 1) * recordsPerPage;

    const currentAttendance =
        filteredAttendance.slice(
            startIndex,
            startIndex + recordsPerPage
        );

    function nextPage() {

        if (currentPage < totalPages) {

            setCurrentPage(currentPage + 1);

        }

    }

    function prevPage() {

        if (currentPage > 1) {

            setCurrentPage(currentPage - 1);

        }

    }

    return (

        <div className="mt-8 rounded-3xl border bg-white shadow-sm">

            <div className="border-b p-6">

                <h2 className="text-2xl font-bold">
                    Attendance History
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                    View your previous attendance records.
                </p>

            </div>

            <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">

                <h3 className="text-lg font-semibold">
                    Monthly Attendance
                </h3>

                <div className="w-full sm:w-auto">
                    <select
                        value={selectedMonth}
                        onChange={(e) => {
                            setSelectedMonth(Number(e.target.value));
                            setCurrentPage(1);
                        }}
                        className="h-11 w-full rounded-xl border px-4 text-sm outline-none focus:border-blue-600 sm:w-56"
                    >
                        {months.slice(0, currentMonth).map((month, index) => (
                            <option key={index} value={index + 1}>
                                {month} {currentYear}
                            </option>
                        ))}
                    </select>
                </div>

            </div>

            {/* Desktop Table */}

            <div className="hidden overflow-x-auto lg:block">

                <table className="min-w-full">

                    <thead className="bg-gray-50">

                        <tr>

                            <th className="px-6 py-4 text-left text-sm font-semibold">
                                Date
                            </th>

                            <th className="px-6 py-4 text-left text-sm font-semibold">
                                Check In
                            </th>

                            <th className="px-6 py-4 text-left text-sm font-semibold">
                                Status
                            </th>

                            <th className="px-6 py-4 text-center text-sm font-semibold">
                                Location
                            </th>

                            <th className="px-6 py-4 text-center text-sm font-semibold">
                                Photo
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {currentAttendance.length > 0 ? (

                            currentAttendance.map((item) => (

                                <tr
                                    key={item._id}
                                    className="border-t hover:bg-gray-50"
                                >

                                    <td className="px-6 py-4">
                                        {item.date}
                                    </td>

                                    <td className="px-6 py-4">
                                        {item.checkIn}
                                    </td>

                                    <td className="px-6 py-4">

                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-semibold ${item.status === "Present"
                                                ? "bg-green-100 text-green-700"
                                                : item.status === "Late"
                                                    ? "bg-yellow-100 text-yellow-700"
                                                    : "bg-red-100 text-red-700"
                                                }`}
                                        >
                                            {item.status}
                                        </span>

                                    </td>

                                    <td className="px-6 py-4 text-center">

                                        <a
                                            href={item.locationLink}
                                            target="_blank"
                                            className="inline-flex items-center justify-center rounded-lg bg-blue-600 p-2 text-white hover:bg-blue-700"
                                        >
                                            <MapPin size={18} />
                                        </a>

                                    </td>

                                    <td className="px-6 py-4 text-center">

                                        <button
                                            onClick={() =>
                                                window.open(item.photo, "_blank")
                                            }
                                            className="inline-flex items-center justify-center rounded-lg bg-slate-800 p-2 text-white hover:bg-black"
                                        >
                                            <Eye size={18} />
                                        </button>

                                    </td>

                                </tr>

                            ))

                        ) : (

                            <tr>

                                <td
                                    colSpan={5}
                                    className="py-10 text-center text-gray-500"
                                >
                                    No attendance history found.
                                </td>

                            </tr>

                        )}

                    </tbody>

                </table>

            </div>

            {/* Mobile Cards */}

            <div className="space-y-4 p-4 lg:hidden">

                {currentAttendance.length > 0 ? (

                    currentAttendance.map((item) => (

                        <div
                            key={item._id}
                            className="rounded-2xl border p-4"
                        >

                            <div className="flex items-center justify-between">

                                <h3 className="font-semibold">
                                    {item.date}
                                </h3>

                                <span
                                    className={`rounded-full px-3 py-1 text-xs font-semibold ${item.status === "Present"
                                        ? "bg-green-100 text-green-700"
                                        : item.status === "Late"
                                            ? "bg-yellow-100 text-yellow-700"
                                            : "bg-red-100 text-red-700"
                                        }`}
                                >
                                    {item.status}
                                </span>

                            </div>

                            <p className="mt-3 text-sm text-gray-600">
                                Check In: {item.checkIn}
                            </p>

                            <div className="mt-4 flex gap-3">

                                <a
                                    href={item.locationLink}
                                    target="_blank"
                                    className="flex-1 rounded-xl bg-blue-600 py-2 text-center text-sm font-medium text-white"
                                >
                                    Location
                                </a>

                                <button
                                    onClick={() =>
                                        window.open(item.photo, "_blank")
                                    }
                                    className="flex-1 rounded-xl bg-slate-800 py-2 text-sm font-medium text-white"
                                >
                                    Photo
                                </button>

                            </div>

                        </div>

                    ))

                ) : (

                    <div className="py-10 text-center text-gray-500">
                        No attendance history found.
                    </div>

                )}

            </div>

            {/* Pagination */}

            {filteredAttendance.length > 0 && (

                <div className="flex flex-col items-center justify-between gap-4 border-t p-5 sm:flex-row">

                    <p className="text-sm text-gray-500">

                        Showing {startIndex + 1} -
                        {Math.min(
                            startIndex + recordsPerPage,
                            filteredAttendance.length
                        )}{" "}
                        of {filteredAttendance.length}

                    </p>

                    <div className="flex items-center gap-3">

                        <button
                            onClick={prevPage}
                            disabled={currentPage === 1}
                            className="rounded-lg border px-4 py-2 disabled:opacity-40"
                        >
                            Previous
                        </button>

                        <span className="text-sm font-semibold">
                            {currentPage} / {totalPages || 1}
                        </span>

                        <button
                            onClick={nextPage}
                            disabled={currentPage === totalPages}
                            className="rounded-lg border px-4 py-2 disabled:opacity-40"
                        >
                            Next
                        </button>

                    </div>

                </div>

            )}

        </div>

    );

}