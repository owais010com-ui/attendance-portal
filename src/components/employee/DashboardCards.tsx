"use client";

import {
    ClipboardCheck,
    Clock3,
    CalendarDays,
    TrendingUp,
} from "lucide-react";

interface Attendance {
    checkIn: string;
    status: string;
}

interface DashboardStats {
    totalPresent: number;
    totalAbsent: number;
    totalLate: number;
    monthlyAttendance: number;
    attendancePercentage: number;
}

interface DashboardCardsProps {
    stats: DashboardStats;
    todayAttendance: Attendance | null;
}

export default function DashboardCards({
    stats,
    todayAttendance,
}: DashboardCardsProps) {

    const cards = [
        {
            title: "Today's Status",
            value: todayAttendance?.status || "Not Marked",
            subtitle: todayAttendance
                ? "Attendance Recorded"
                : "Pending",
            icon: ClipboardCheck,
            bg: "bg-green-50",
            iconColor: "text-green-600",
        },
        {
            title: "Check In Time",
            value: todayAttendance?.checkIn || "--:--",
            subtitle: "Today",
            icon: Clock3,
            bg: "bg-blue-50",
            iconColor: "text-blue-600",
        },
        {
            title: "This Month",
            value: `${stats.monthlyAttendance} Days`,
            subtitle: "Attendance",
            icon: CalendarDays,
            bg: "bg-purple-50",
            iconColor: "text-purple-600",
        },
        {
            title: "Attendance %",
            value: `${stats.attendancePercentage}%`,
            subtitle:
                stats.attendancePercentage >= 90
                    ? "Excellent"
                    : stats.attendancePercentage >= 75
                        ? "Good"
                        : "Needs Improvement",
            icon: TrendingUp,
            bg: "bg-orange-50",
            iconColor: "text-orange-600",
        },
    ];

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

            {cards.map((card) => {

                const Icon = card.icon;

                return (

                    <div
                        key={card.title}
                        className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-30"
                    >

                        <div className="flex items-center justify-between">

                            <div className="min-w-0">

                                <p className="text-sm text-gray-500">
                                    {card.title}
                                </p>

                                <h2 className="mt-2 truncate text-2xl font-bold text-gray-900 lg:text-2xl">
                                    {card.value}
                                </h2>

                                <p className="mt-1 text-sm text-gray-500">
                                    {card.subtitle}
                                </p>

                            </div>

                            <div
                                className={`flex h-12 w-12 items-center justify-center rounded-2xl transition-transform duration-300 ${card.bg}`}
                            >
                                <Icon
                                    size={26}
                                    className={card.iconColor}
                                />
                            </div>

                        </div>

                    </div>

                );
            })}

        </div>
    );
}