"use client";

import { useEffect, useState } from "react";
import {
    Mail,
    BadgeCheck,
    User,
    Moon,
    ShieldCheck,
} from "lucide-react";

interface UserData {
    name: string;
    email: string;
    employeeId: string;
    role: string;
    isActive: boolean;
    createdAt: string;
}

export default function SettingsCard() {
    const [user, setUser] = useState<UserData | null>(null);

    useEffect(() => {
        async function getUser() {
            const res = await fetch("/api/auth/me", {
                cache: "no-store",
            });

            const data = await res.json();

            if (data.success) {
                setUser(data.user);
            }
        }

        getUser();
    }, []);

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

            <h2 className="text-2xl font-bold text-gray-800">
                Settings
            </h2>

            <p className="mt-1 text-sm text-gray-500">
                Manage your account settings.
            </p>

            <div className="mt-8 space-y-5">

                <div className="flex items-center gap-4 rounded-xl border p-4">

                    <User className="text-blue-600" />

                    <div>
                        <p className="text-sm text-gray-500">
                            Full Name
                        </p>

                        <h3 className="font-semibold">
                            {user?.name}
                        </h3>
                    </div>

                </div>

                <div className="flex items-center gap-4 rounded-xl border p-4">

                    <Mail className="text-blue-600" />

                    <div>
                        <p className="text-sm text-gray-500">
                            Email
                        </p>

                        <h3 className="font-semibold">
                            {user?.email}
                        </h3>
                    </div>

                </div>

                <div className="flex items-center gap-4 rounded-xl border p-4">

                    <BadgeCheck className="text-green-600" />

                    <div>
                        <p className="text-sm text-gray-500">
                            Employee ID
                        </p>

                        <h3 className="font-semibold">
                            {user?.employeeId}
                        </h3>
                    </div>

                </div>

                <div className="flex items-center justify-between rounded-xl border p-4">

                    <div className="flex items-center gap-4">

                        <Moon className="text-indigo-600" />

                        <div>

                            <h3 className="font-semibold">
                                Dark Mode
                            </h3>

                            <p className="text-sm text-gray-500">
                                Coming Soon
                            </p>

                        </div>

                    </div>

                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium">
                        Soon
                    </span>

                </div>
                <div className="rounded-xl border p-5">

                    <h3 className="text-lg font-semibold text-gray-800">
                        Account Information
                    </h3>

                    <div className="mt-5 grid gap-4 md:grid-cols-2">

                        <div>
                            <p className="text-sm text-gray-500">
                                Role
                            </p>

                            <h4 className="mt-1 font-semibold capitalize">
                                {user?.role}
                            </h4>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">
                                Status
                            </p>

                            <span
                                className={`mt-1 inline-flex rounded-full px-3 py-1 text-sm font-medium ${user?.isActive
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                                    }`}
                            >
                                {user?.isActive ? "Active" : "Inactive"}
                            </span>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">
                                Joined On
                            </p>

                            <h4 className="mt-1 font-semibold">
                                {user &&
                                    new Date(user.createdAt).toLocaleDateString("en-GB")}
                            </h4>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">
                                Employee ID
                            </p>

                            <h4 className="mt-1 font-semibold">
                                {user?.employeeId}
                            </h4>
                        </div>

                    </div>

                </div>

                <div className="flex items-center justify-between rounded-xl border p-4">

                    <div className="flex items-center gap-4">

                        <ShieldCheck className="text-purple-600" />

                        <div>

                            <h3 className="font-semibold">
                                Two Factor Authentication
                            </h3>

                            <p className="text-sm text-gray-500">
                                Coming Soon
                            </p>

                        </div>

                    </div>

                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium">
                        Soon
                    </span>

                </div>

            </div>

        </div>
    );
}