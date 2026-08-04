"use client";

import { CalendarDays, BadgeCheck, Hash } from "lucide-react";

interface User {
    name: string;
    employeeId: string;
    isActive: boolean;
}

interface WelcomeCardProps {
    user: User;
}

export default function WelcomeCard({
    user,
}: WelcomeCardProps) {

    const today = new Date().toLocaleDateString("en-US", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    const hour = new Date().getHours();

    const greeting =
        hour < 12
            ? "Good Morning"
            : hour < 17
                ? "Good Afternoon"
                : "Good Evening";

    return (
        <div className="overflow-hidden rounded-2xl lg:rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 p-5 sm:p-6 lg:p-8 text-white shadow-xl">

            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

                <div>

                    <p className="text-blue-100 text-sm font-medium">
                        {greeting} 👋
                    </p>

                    <h1 className="mt-2 text-2xl font-bold sm:text-3xl lg:text-4xl">
                        {user.name}
                    </h1>

                    <p className="mt-3 text-blue-100">
                        Welcome back to your attendance dashboard.
                    </p>

                    <div className="mt-5 flex flex-wrap gap-2 sm:gap-3">

                        <div className="flex items-center gap-2 rounded-xl bg-white/15 px-4 py-2 backdrop-blur">
                            <Hash size={18} />
                            <span>{user.employeeId}</span>
                        </div>

                        <div
                            className={`flex items-center gap-2 rounded-xl px-4 py-2 backdrop-blur ${user.isActive
                                ? "bg-green-500/20"
                                : "bg-red-500/20"
                                }`}
                        >
                            <BadgeCheck size={18} />

                            {user.isActive
                                ? "Active Employee"
                                : "Inactive"}
                        </div>

                    </div>

                </div>

                <div className="flex flex-col items-start lg:items-end">

                    <div className="flex items-center gap-3 rounded-xl lg:rounded-2xl bg-white/15 px-5 py-4 backdrop-blur">

                        <CalendarDays size={34} />

                        <div>

                            <p className="text-sm text-blue-100">
                                Today
                            </p>

                            <h3 className="font-semibold">
                                {today}
                            </h3>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}