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

        <div className="mt-6 rounded-3xl border border-gray-200 bg-white p-5 sm:p-6 shadow-sm">

            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                Account Information
            </h2>

            <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2">

                {/* Status */}

                <div className="flex items-start gap-4 rounded-2xl border border-gray-100 p-4 transition hover:shadow-md">

                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-green-100">

                        <ShieldCheck
                            size={22}
                            className="text-green-600"
                        />

                    </div>

                    <div className="min-w-0">

                        <p className="text-sm text-gray-500">
                            Account Status
                        </p>

                        <span
                            className={`mt-2 inline-flex rounded-full px-4 py-1 text-xs sm:text-sm font-medium ${user.isActive
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                                }`}
                        >
                            {user.isActive ? "Active Employee" : "Inactive"}
                        </span>

                    </div>

                </div>

                {/* Created */}

                <div className="flex items-start gap-4 rounded-2xl border border-gray-100 p-4 transition hover:shadow-md">

                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-blue-100">

                        <CalendarClock
                            size={22}
                            className="text-blue-600"
                        />

                    </div>

                    <div className="min-w-0">

                        <p className="text-sm text-gray-500">
                            Account Created
                        </p>

                        <h3 className="mt-2 text-base sm:text-lg font-semibold text-gray-800">
                            {new Date(user.createdAt).toLocaleDateString("en-GB")}
                        </h3>

                    </div>

                </div>

            </div>

            {/* Logout */}

            <div className="mt-8 flex justify-end">

                <button
                    onClick={onLogout}
                    className="flex w-full sm:w-auto cursor-pointer items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-3 font-semibold text-white transition hover:bg-red-700 active:scale-95"
                >

                    <LogOut size={18} />

                    Logout

                </button>

            </div>

        </div>

    );
}