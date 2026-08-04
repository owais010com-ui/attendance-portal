"use client";

import { CheckCircle2, Clock, XCircle, AlertCircle } from "lucide-react";

interface Attendance {
    _id: string;
    date: string;
    checkIn: string;
    status: string;
}

interface RecentAttendanceProps {
    attendance: Attendance[];
}

export default function RecentAttendance({
    attendance,
}: RecentAttendanceProps) {

    if (attendance.length === 0) {
        return (
            <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">

                <h2 className="text-xl font-bold text-gray-800">
                    Recent Attendance
                </h2>

                <p className="mt-8 text-gray-500">
                    No attendance records found.
                </p>

            </div>
        );
    }

    function statusBadge(status: string) {

        switch (status) {

            case "Present":
                return (
                    <span className="inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                        <CheckCircle2 size={15} />
                        Present
                    </span>
                );

            case "Late":
                return (
                    <span className="inline-flex items-center gap-2 rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-700">
                        <AlertCircle size={15} />
                        Late
                    </span>
                );

            default:
                return (
                    <span className="inline-flex items-center gap-2 rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-700">
                        <XCircle size={15} />
                        Absent
                    </span>
                );

        }

    }

    return (

        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

            <div className="border-b border-gray-200 px-6 py-5">

                <h2 className="text-xl font-bold text-gray-800">
                    Recent Attendance
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                    Your latest attendance history
                </p>

            </div>

            {/* Desktop */}

            <div className="hidden overflow-x-auto md:block">

                <table className="w-full">

                    <thead className="sticky top-0 bg-gray-50">

                        <tr>

                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                                Date
                            </th>

                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                                Check In
                            </th>

                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                                Status
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {attendance.map((item) => (

                            <tr
                                key={item._id}
                                className="border-t border-gray-100 transition hover:bg-gray-50"
                            >

                                <td className="px-6 py-4 font-medium text-gray-800">

                                    {new Date(item.date).toLocaleDateString()}

                                </td>

                                <td className="px-6 py-4">

                                    <div className="flex items-center gap-2">

                                        <Clock
                                            size={16}
                                            className="text-blue-600"
                                        />

                                        {item.checkIn || "--"}

                                    </div>

                                </td>

                                <td className="px-6 py-4">

                                    {statusBadge(item.status)}

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

            {/* Mobile */}

            <div className="space-y-4 p-4 md:hidden">

                {attendance.map((item) => (

                    <div
                        key={item._id}
                        className="rounded-xl border border-gray-200 p-4"
                    >

                        <div className="flex items-center justify-between">

                            <h3 className="font-semibold">

                                {new Date(item.date).toLocaleDateString()}

                            </h3>

                            {statusBadge(item.status)}

                        </div>

                        <div className="mt-3 flex items-center gap-2 text-gray-600">

                            <Clock size={16} />

                            {item.checkIn || "--"}

                        </div>

                    </div>

                ))}

            </div>

        </div>

    );
}