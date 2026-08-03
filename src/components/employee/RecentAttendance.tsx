"use client";

import { CheckCircle2, Clock } from "lucide-react";


interface Attendance {
    _id: string;
    date: string;
    checkIn: string;
    status: string;
}

interface Props {
    attendance: Attendance[];
}

export default function RecentAttendance({
    attendance,
}: Props) {
    return (
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">

            <div className="border-b border-gray-200 px-6 py-5">

                <h2 className="text-xl font-bold text-gray-800">
                    Recent Attendance
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                    Your last attendance records
                </p>

            </div>

            <div className="overflow-x-auto">

                <table className="w-full">

                    <thead className="bg-gray-50">

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

                        {attendance.length > 0 ? (
                            attendance.map((item) => (

                                <tr
                                    key={item._id}
                                    className="border-t border-gray-100 hover:bg-gray-50 transition"
                                >

                                    <td className="px-6 py-4 text-sm font-medium text-gray-800">
                                        {item.date}
                                    </td>

                                    <td className="px-6 py-4">

                                        <div className="flex items-center gap-2 text-gray-700">

                                            <Clock size={16} />

                                            {item.checkIn}

                                        </div>

                                    </td>

                                    <td className="px-6 py-4">

                                        {item.status === "Present" && (
                                            <span className="inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                                                <CheckCircle2 size={15} />
                                                Present
                                            </span>
                                        )}

                                        {item.status === "Late" && (
                                            <span className="inline-flex rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-700">
                                                Late
                                            </span>
                                        )}

                                        {item.status === "Absent" && (
                                            <span className="inline-flex rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-700">
                                                Absent
                                            </span>
                                        )}

                                    </td>

                                </tr>

                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={3}
                                    className="py-8 text-center text-gray-500"
                                >
                                    No attendance records found.
                                </td>
                            </tr>
                        )}

                    </tbody>

                </table>

            </div>

        </div>
    );
}