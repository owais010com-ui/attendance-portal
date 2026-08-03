"use client";

import { CalendarDays } from "lucide-react";

interface Props {
    user: {
        name: string;
    };
}

export default function WelcomeCard({
    user,
}: Props) {
    const today = new Date().toLocaleDateString("en-US", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    return (
        <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 p-8 text-white shadow-xl">

            <div className="flex items-center justify-between">

                <div>

                    <p className="text-sm font-medium text-blue-100">
                        Welcome Back 👋
                    </p>

                    <h1 className="mt-2 text-3xl font-bold">
                        {user.name}
                    </h1>

                    <p className="mt-2 text-blue-100">
                          Have a productive day at work, {user.name.split(" ")[0]}
                    </p>

                </div>

                <div className="hidden rounded-2xl bg-white/15 p-4 backdrop-blur md:flex">

                    <CalendarDays size={42} />

                </div>

            </div>

            <div className="mt-8 inline-flex items-center rounded-xl bg-white/15 px-4 py-2 text-sm backdrop-blur">

                📅 {today}

            </div>

        </div>
    );
}