"use client";

import { CircleCheckBig } from "lucide-react";

interface Props {
    stats: {
        totalPresent: number;
        totalAbsent: number;
        totalLate: number;
        attendancePercentage: number;
    };
}

export default function AttendanceCard({
    stats,
}: Props) {

    const percentage = stats.attendancePercentage;

    return (

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

            <h2 className="text-xl font-bold text-gray-800">
                Attendance Progress
            </h2>

            <p className="mt-1 text-sm text-gray-500">
                This Month
            </p>

            <div className="mt-8 flex flex-col items-center">

                <div className="relative flex h-44 w-44 items-center justify-center rounded-full border-[14px] border-blue-100">

                    <div className="absolute inset-0 rounded-full border-[14px] border-transparent border-t-blue-600 rotate-45"></div>

                    <div className="text-center">

                        <h1 className="text-5xl font-bold text-blue-600">
                            {percentage}%
                        </h1>

                        <p className="mt-1 text-sm text-gray-500">
                            Attendance
                        </p>

                    </div>

                </div>

                <div className="mt-8 grid w-full grid-cols-3 gap-4">

                    <div className="rounded-xl bg-green-50 p-4 text-center">

                        <h3 className="text-2xl font-bold text-green-600">
                            {stats.totalPresent}
                        </h3>

                        <p className="text-sm text-gray-500">
                            Present
                        </p>

                    </div>

                    <div className="rounded-xl bg-red-50 p-4 text-center">

                        <h3 className="text-2xl font-bold text-red-600">
                            {stats.totalAbsent}
                        </h3>

                        <p className="text-sm text-gray-500">
                            Absent
                        </p>

                    </div>

                    <div className="rounded-xl bg-yellow-50 p-4 text-center">

                        <h3 className="text-2xl font-bold text-yellow-600">
                            {stats.totalLate}
                        </h3>

                        <p className="text-sm text-gray-500">
                            Late
                        </p>

                    </div>

                </div>

                <div className="mt-6 flex items-center gap-2 rounded-xl bg-green-50 px-4 py-3 text-green-700">

                    <CircleCheckBig size={20} />

                    {percentage >= 90
                        ? "Excellent Attendance"
                        : percentage >= 70
                            ? "Good Attendance"
                            : "Needs Improvement"}

                </div>

            </div>

        </div>

    );
}