"use client";

import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";
import Image from "next/image";

interface UserData {
    name: string;
    email: string;
    employeeId: string;
    role: string;
    isActive: boolean;
    profileImage?: string;
}

interface ProfileHeaderProps {
    user: UserData;
}

export default function ProfileHeader({
    user,
}: ProfileHeaderProps) {

    const router = useRouter();

    return (
        <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">

            {/* Cover */}

            <div className="relative h-36 sm:h-44 lg:h-52 bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500">
                <div className="absolute inset-0 bg-black/10" />
            </div>

            {/* Content */}

            <div className="relative px-4 pb-6 sm:px-6 lg:px-8">

                <div className="-mt-14 sm:-mt-16 flex flex-col items-center gap-6 lg:flex-row lg:items-end lg:justify-between">

                    {/* Left */}

                    <div className="flex flex-col items-center gap-5 text-center lg:flex-row lg:items-end lg:text-left">

                        {/* Avatar */}

                        <div className="flex h-24 w-24 sm:h-28 sm:w-28 lg:h-36 lg:w-36 items-center justify-center overflow-hidden rounded-full bg-blue-600 shadow-lg">

                            {user.profileImage ? (
                                <Image
                                    src={user.profileImage}
                                    alt={user.name}
                                    width={144}
                                    height={144}
                                    className="h-full w-full rounded-full object-cover"
                                />
                            ) : (
                                <span className="text-4xl font-bold text-white">
                                    {user.name.charAt(0).toUpperCase()}
                                </span>
                            )}

                        </div>
                        {/* User Info */}

                        <div>

                            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                                {user.name}
                            </h1>

                            <p className="mt-1 break-all text-sm text-gray-500">
                                {user.email}
                            </p>

                            <div className="mt-4 flex flex-wrap justify-center gap-2 lg:justify-start">

                                <span className="rounded-full bg-blue-100 px-4 py-1 text-xs font-medium text-blue-700 sm:text-sm">
                                    {user.employeeId}
                                </span>

                                <span className="rounded-full bg-gray-100 px-4 py-1 text-xs capitalize text-gray-700 sm:text-sm">
                                    {user.role}
                                </span>

                                <span
                                    className={`rounded-full px-4 py-1 text-xs font-medium sm:text-sm ${user.isActive
                                        ? "bg-green-100 text-green-700"
                                        : "bg-red-100 text-red-700"
                                        }`}
                                >
                                    {user.isActive ? "Active" : "Inactive"}
                                </span>

                            </div>

                        </div>

                    </div>

                    {/* Right */}

                    <button
                        onClick={() => router.push("/employee/profile/edit")}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 sm:w-auto sm:text-base"
                    >
                        <Pencil size={18} />
                        Edit Profile
                    </button>

                </div>

            </div>

        </div>
    );
}