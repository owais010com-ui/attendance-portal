"use client";

import {
    Mail,
    Phone,
    MapPin,
    User,
    BadgeCheck,
    CalendarDays,
    Briefcase,
} from "lucide-react";

interface UserData {
    name: string;
    email: string;
    employeeId: string;
    role: string;
    isActive: boolean;
    createdAt: string;
    phone?: string;
    address?: string;
}

interface ProfileInfoProps {
    user: UserData;
}

export default function ProfileInfo({
    user,
}: ProfileInfoProps) {
    return (
        <div className="mt-8 grid gap-6 lg:grid-cols-2">

            {/* Contact Information */}

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

                <h2 className="mb-6 text-xl font-bold text-gray-800">
                    Contact Information
                </h2>

                <div className="space-y-6">

                    <div className="flex items-start gap-4">

                        <div className="rounded-xl bg-blue-100 p-3">
                            <Mail className="text-blue-600" size={20} />
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">
                                Email
                            </p>

                            <h3 className="font-semibold text-gray-800">
                                {user.email}
                            </h3>
                        </div>

                    </div>

                    <div className="flex items-start gap-4">

                        <div className="rounded-xl bg-green-100 p-3">
                            <Phone className="text-green-600" size={20} />
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">
                                Phone
                            </p>

                            <h3 className="font-semibold text-gray-800">
                                {user.phone || "Not Added"}
                            </h3>
                        </div>

                    </div>

                    <div className="flex items-start gap-4">

                        <div className="rounded-xl bg-orange-100 p-3">
                            <MapPin className="text-orange-600" size={20} />
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">
                                Address
                            </p>

                            <h3 className="font-semibold text-gray-800">
                                {user.address || "Not Added"}
                            </h3>
                        </div>

                    </div>

                </div>

            </div>

            {/* Personal Information */}

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

                <h2 className="mb-6 text-xl font-bold text-gray-800">
                    Personal Information
                </h2>

                <div className="grid gap-6 sm:grid-cols-2">

                    <div>

                        <div className="mb-2 flex items-center gap-2">
                            <User className="text-blue-600" size={18} />
                            <span className="text-sm text-gray-500">
                                Full Name
                            </span>
                        </div>

                        <p className="font-semibold text-gray-800">
                            {user.name}
                        </p>

                    </div>

                    <div>

                        <div className="mb-2 flex items-center gap-2">
                            <BadgeCheck className="text-green-600" size={18} />
                            <span className="text-sm text-gray-500">
                                Employee ID
                            </span>
                        </div>

                        <p className="font-semibold text-gray-800">
                            {user.employeeId}
                        </p>

                    </div>

                    <div>

                        <div className="mb-2 flex items-center gap-2">
                            <Briefcase className="text-purple-600" size={18} />
                            <span className="text-sm text-gray-500">
                                Role
                            </span>
                        </div>

                        <p className="font-semibold capitalize text-gray-800">
                            {user.role}
                        </p>

                    </div>

                    <div>

                        <div className="mb-2 flex items-center gap-2">
                            <CalendarDays className="text-orange-600" size={18} />
                            <span className="text-sm text-gray-500">
                                Joined Date
                            </span>
                        </div>

                        <p className="font-semibold text-gray-800">
                            {new Date(user.createdAt).toLocaleDateString("en-GB")}
                        </p>

                    </div>

                </div>

            </div>

        </div>
    );
}