"use client";

import {
    Bell,
    CheckCircle2,
    Clock3,
    CalendarDays,
} from "lucide-react";

const notifications = [
    {
        title: "Attendance Marked",
        message: "Your attendance has been marked successfully.",
        time: "2 minutes ago",
        icon: CheckCircle2,
        color: "bg-green-100 text-green-600",
    },
    {
        title: "Leave Request",
        message: "Your leave request is pending approval.",
        time: "1 hour ago",
        icon: CalendarDays,
        color: "bg-yellow-100 text-yellow-600",
    },
    {
        title: "Working Hours",
        message: "You completed 8 working hours today.",
        time: "Today",
        icon: Clock3,
        color: "bg-blue-100 text-blue-600",
    },
];

export default function NotificationCard() {
    return (
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">

            <div className="flex items-center justify-between border-b px-6 py-5">

                <div>

                    <h2 className="text-2xl font-bold text-gray-800">
                        Notifications
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        Latest updates
                    </p>

                </div>

                <Bell className="text-blue-600" size={26} />

            </div>

            <div className="divide-y">

                {notifications.map((item, index) => {

                    const Icon = item.icon;

                    return (

                        <div
                            key={index}
                            className="flex items-start gap-4 p-6 transition hover:bg-gray-50"
                        >

                            <div
                                className={`flex h-12 w-12 items-center justify-center rounded-xl ${item.color}`}
                            >
                                <Icon size={22} />
                            </div>

                            <div className="flex-1">

                                <h3 className="font-semibold text-gray-800">
                                    {item.title}
                                </h3>

                                <p className="mt-1 text-sm text-gray-500">
                                    {item.message}
                                </p>

                                <p className="mt-2 text-xs text-gray-400">
                                    {item.time}
                                </p>

                            </div>

                        </div>

                    );

                })}

            </div>

        </div>
    );
}