"use client";

import {
    ShieldCheck,
    CalendarClock,
    LogOut,
} from "lucide-react";

interface UserData {
    isActive: boolean;
    createdAt: string;
}

interface AccountCardProps {
    user: UserData;
    onLogout: () => void;
}

export default function AccountCard({
    user,
    onLogout,
}: AccountCardProps) {
    return (
        <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

            <h2 className="text-xl font-bold text-gray-800">
                Account Information
            </h2>

            <div className="mt-6 grid gap-6 md:grid-cols-2">

                <div className="flex items-start gap-4">

                    <div className="rounded-xl bg-green-100 p-3">
                        <ShieldCheck
                            className="text-green-600"
                            size={22}
                        />
                    </div>

                    <div>

                        <p className="text-sm text-gray-500">
                            Account Status
                        </p>

                        <span
                            className={`mt-2 inline-flex rounded-full px-4 py-1 text-sm font-medium ${user.isActive
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                                }`}
                        >
                            {user.isActive ? "Active Employee" : "Inactive"}
                        </span>

                    </div>

                </div>

                <div className="flex items-start gap-4">

                    <div className="rounded-xl bg-blue-100 p-3">
                        <CalendarClock
                            className="text-blue-600"
                            size={22}
                        />
                    </div>

                    <div>

                        <p className="text-sm text-gray-500">
                            Account Created
                        </p>

                        <h3 className="mt-1 font-semibold text-gray-800">
                            {new Date(
                                user.createdAt
                            ).toLocaleDateString("en-GB")}
                        </h3>

                    </div>

                </div>

            </div>

            <div className="mt-8 flex justify-end">

                <button
                    onClick={onLogout}
                    className="flex cursor-pointer items-center gap-2 rounded-xl bg-red-600 px-6 py-3 font-medium text-white transition hover:bg-red-700"
                >

                    <LogOut size={18} />

                    Logout

                </button>

            </div>

        </div>
    );
}