"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    User,
    Mail,
    BadgeCheck,
    Shield,
    CalendarDays,
} from "lucide-react";

interface UserData {
    name: string;
    email: string;
    employeeId: string;
    role: string;
    isActive: boolean;
    createdAt: string;
}

export default function ProfileCard() {
    const [user, setUser] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function getUser() {
            try {
                const res = await fetch("/api/auth/me", {
                    cache: "no-store",
                });

                const data = await res.json();

                if (data.success) {
                    setUser(data.user);
                }
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        }

        getUser();
    }, []);

    if (loading) {
        return (
            <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
                Loading...
            </div>
        );
    }

    if (!user) {
        return (
            <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
                User not found.
            </div>
        );
    }

    return (
        <div className="rounded-3xl bg-white p-8 shadow-sm">

            <div className="flex flex-col items-center">

                <div className="flex h-28 w-28 items-center justify-center rounded-full bg-blue-500 text-5xl font-bold text-white shadow-lg">
                    {user.name.charAt(0).toUpperCase()}
                </div>


                <h2 className="mt-5 text-2xl font-bold text-slate-800">
                    {user.name}
                </h2>

                <p className="text-slate-500">
                    {user.role}
                </p>

                <span
                    className={`mt-3 rounded-full px-4 py-2 text-sm font-medium ${user.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                        }`}
                >
                    {user.isActive ? "Active" : "Inactive"}
                </span>

                <Link
                    href="/employee/profile/edit"
                    className="mt-5 rounded-xl bg-blue-600 px-6 py-3 text-white transition hover:bg-blue-700"
                >
                    Edit Profile
                </Link>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-2">

                <div className="flex items-center gap-4 rounded-2xl border p-5">
                    <User className="text-blue-600" />
                    <div>
                        <p className="text-sm text-slate-500">Employee ID</p>
                        <h3 className="font-semibold">{user.employeeId}</h3>
                    </div>
                </div>

                <div className="flex items-center gap-4 rounded-2xl border p-5">
                    <Mail className="text-blue-600" />
                    <div>
                        <p className="text-sm text-slate-500">Email</p>
                        <h3 className="font-semibold">{user.email}</h3>
                    </div>
                </div>

                <div className="flex items-center gap-4 rounded-2xl border p-5">
                    <Shield className="text-blue-600" />
                    <div>
                        <p className="text-sm text-slate-500">Role</p>
                        <h3 className="font-semibold capitalize">
                            {user.role}
                        </h3>
                    </div>
                </div>

                <div className="flex items-center gap-4 rounded-2xl border p-5">
                    <CalendarDays className="text-blue-600" />
                    <div>
                        <p className="text-sm text-slate-500">Joined</p>
                        <h3 className="font-semibold">
                            {new Date(user.createdAt).toLocaleDateString()}
                        </h3>
                    </div>
                </div>

            </div>

            <div className="mt-8 rounded-2xl bg-blue-50 p-5">

                <div className="flex items-center gap-3">

                    <BadgeCheck className="text-blue-600" />

                    <div>
                        <h3 className="font-semibold text-slate-800">
                            Account Status
                        </h3>

                        <p className="text-sm text-slate-600">
                            Your account is verified and ready to use.
                        </p>
                    </div>

                </div>

            </div>

        </div>
    );
}