"use client";

import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";

interface UserData {
    name: string;
    email: string;
    employeeId: string;
    role: string;
    isActive: boolean;
}

interface ProfileHeaderProps {
    user: UserData;
}

export default function ProfileHeader({
    user,
}: ProfileHeaderProps) {

    const router = useRouter();

    return (
        <div className="overflow-hidden rounded-3xl bg-white shadow-sm border border-gray-200">

            {/* Cover */}

            <div className="relative h-52 bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500">

                <div className="absolute inset-0 bg-black/10"></div>

            </div>

            {/* Content */}

            <div className="relative px-8 pb-8">

                {/* Avatar */}

                <div className="-mt-16 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">

                    <div className="flex items-end gap-5">

                        <div className="flex h-32 w-32 items-center justify-center rounded-full border-8 border-white bg-blue-600 text-5xl font-bold text-white shadow-lg">

                            {user.name.charAt(0).toUpperCase()}

                        </div>

                        <div className="pb-3">

                            <h1 className="text-3xl font-bold text-gray-900">

                                {user.name}

                            </h1>

                            <div className="mt-2 flex flex-wrap items-center gap-3">

                                <span className="rounded-full bg-blue-100 px-4 py-1 text-sm font-medium text-blue-700">

                                    {user.employeeId}

                                </span>

                                <span className="rounded-full bg-gray-100 px-4 py-1 text-sm capitalize text-gray-700">

                                    {user.role}

                                </span>

                                <span
                                    className={`rounded-full px-4 py-1 text-sm font-medium ${user.isActive
                                        ? "bg-green-100 text-green-700"
                                        : "bg-red-100 text-red-700"
                                        }`}
                                >
                                    {user.isActive ? "Active" : "Inactive"}
                                </span>

                            </div>

                        </div>

                    </div>

                    <button
                        onClick={() => router.push("/employee/profile/edit")}
                        className="cursor-pointer flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700"
                    >

                        <Pencil size={18} />

                        Edit Profile

                    </button>

                </div>

            </div>

        </div>
    );
}