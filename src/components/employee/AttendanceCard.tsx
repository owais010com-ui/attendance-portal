"use client";

import { CircleCheckBig } from "lucide-react";

interface DashboardStats {
    totalPresent: number;
    totalAbsent: number;
    totalLate: number;
    attendancePercentage: number;
}

interface AttendanceCardProps {
    stats: DashboardStats;
}

export default function AttendanceCard({
    stats,
}: AttendanceCardProps) {

    const percentage = stats.attendancePercentage;

    const radius = 70;
    const circumference = 2 * Math.PI * radius;
    const offset =
        circumference -
        (percentage / 100) * circumference;

    return (

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg">

            <h2 className="text-xl font-bold text-gray-800">
                Attendance Progress
            </h2>

            <p className="mt-1 text-sm text-gray-500">
                This Month Overview
            </p>

            <div className="mt-8 flex justify-center">

                <div className="relative h-44 w-44">

                    <svg
                        className="-rotate-90"
                        width="176"
                        height="176"
                    >

                        <circle
                            cx="88"
                            cy="88"
                            r={radius}
                            stroke="#E5E7EB"
                            strokeWidth="12"
                            fill="none"
                        />

                        <circle
                            cx="88"
                            cy="88"
                            r={radius}
                            stroke="#2563EB"
                            strokeWidth="12"
                            fill="none"
                            strokeLinecap="round"
                            strokeDasharray={circumference}
                            strokeDashoffset={offset}
                            className="transition-all duration-700"
                        />

                    </svg>

                    <div className="absolute inset-0 flex flex-col items-center justify-center">

                        <h2 className="text-4xl font-bold text-blue-600">
                            {percentage}%
                        </h2>

                        <p className="text-sm text-gray-500">
                            Attendance
                        </p>

                    </div>

                </div>

            </div>

            <div className="mt-8 grid grid-cols-3 gap-3">

                <div className="rounded-xl bg-green-50 p-4 text-center">

                    <h3 className="text-2xl font-bold text-green-600">
                        {stats.totalPresent}
                    </h3>

                    <p className="mt-1 text-xs text-gray-500">
                        Present
                    </p>

                </div>

                <div className="rounded-xl bg-red-50 p-4 text-center">

                    <h3 className="text-2xl font-bold text-red-600">
                        {stats.totalAbsent}
                    </h3>

                    <p className="mt-1 text-xs text-gray-500">
                        Absent
                    </p>

                </div>

                <div className="rounded-xl bg-yellow-50 p-4 text-center">

                    <h3 className="text-2xl font-bold text-yellow-600">
                        {stats.totalLate}
                    </h3>

                    <p className="mt-1 text-xs text-gray-500">
                        Late
                    </p>

                </div>

            </div>

            <div
                className={`mt-6 flex items-center justify-center gap-2 rounded-xl px-4 py-3 font-medium ${percentage >= 90
                        ? "bg-green-50 text-green-700"
                        : percentage >= 75
                            ? "bg-yellow-50 text-yellow-700"
                            : "bg-red-50 text-red-700"
                    }`}
            >

                <CircleCheckBig size={20} />

                {percentage >= 90
                    ? "Excellent Attendance"
                    : percentage >= 75
                        ? "Good Attendance"
                        : "Needs Improvement"}

            </div>

        </div>

    );
}