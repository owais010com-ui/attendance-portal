"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { MapPin } from "lucide-react";

interface Attendance {
    _id: string;
    employeeName: string;
    employeeId: string;
    profileImage: string;
    checkIn: string;
    locationLink: string;
    status: string;
    day: string;
    date: string;
}
export default function RecentAttendance() {

    const [attendance, setAttendance] = useState<Attendance[]>([]);

    useEffect(() => {
        async function getRecentAttendance() {

            try {

                const res = await fetch("/api/dashboard", {
                    cache: "no-store",
                });

                const data = await res.json();

                if (data.success) {
                    setAttendance(data.recentAttendance);
                }

            } catch (error) {
                console.log(error);
            }
        }

        getRecentAttendance();
    }, []);

    return (
        <div className="mt-8 rounded-2xl border border-gray-200 bg-white shadow-sm">

            <div className="border-b p-5">
                <h2 className="text-xl font-bold">
                    Recent Attendance
                </h2>
            </div>

            {/* Mobile */}

            <div className="space-y-4 p-4 lg:hidden">

                {attendance.length > 0 ? (

                    attendance.map((item) => (

                        <div
                            key={item._id}
                            className="rounded-2xl border p-4"
                        >

                            <div className="flex items-center gap-3">

                                {item.profileImage ? (

                                    <Image
                                        src={item.profileImage}
                                        alt={item.employeeName}
                                        width={55}
                                        height={55}
                                        className="h-14 w-14 rounded-full object-cover"
                                    />

                                ) : (

                                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-lg font-bold text-white">

                                        {item.employeeName.charAt(0)}

                                    </div>

                                )}

                                <div>

                                    <h3 className="font-semibold">
                                        {item.employeeName}
                                    </h3>

                                    <p className="text-sm text-gray-500">
                                        {item.employeeId}
                                    </p>

                                </div>

                            </div>

                            <div className="mt-4 space-y-2 text-sm">

                                <p>
                                    <span className="font-medium">
                                        Day:
                                    </span>{" "}
                                    {item.day}
                                </p>

                                <p>
                                    <span className="font-medium">
                                        Check In:
                                    </span>{" "}
                                    {item.checkIn}
                                </p>

                            </div>

                            <div className="mt-4 flex gap-3">

                                <div className="mt-4 w-full">
                                    <a
                                        href={item.locationLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex h-11 w-full items-center justify-center rounded-xl bg-blue-600 text-white hover:bg-blue-700"
                                    >
                                        <MapPin size={18} />
                                    </a>
                                </div>

                            </div>

                            <div className="mt-4">

                                <span
                                    className={`rounded-full px-3 py-1 text-xs font-semibold ${item.status === "Present"
                                        ? "bg-green-100 text-green-700"
                                        : item.status === "Late"
                                            ? "bg-yellow-100 text-yellow-700"
                                            : "bg-red-100 text-red-700"
                                        }`}
                                >
                                    {item.status}
                                </span>

                            </div>

                        </div>

                    ))

                ) : (

                    <div className="py-10 text-center text-gray-500">
                        No attendance found.
                    </div>

                )}

            </div>

            {/* Desktop */}

            <div className="hidden overflow-x-auto lg:block">

                <table className="w-full">

                    <thead className="bg-gray-50">

                        <tr>

                            <th className="p-4 text-left">
                                Employee
                            </th>

                            <th className="p-4 text-left">
                                ID
                            </th>
                            <th className="p-4 text-left">
                                Day
                            </th>

                            <th className="p-4 text-left">
                                Check In
                            </th>

                            <th className="p-4 text-center">
                                Location
                            </th>

                            <th className="p-4 text-left">
                                Status
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {attendance.length > 0 ? (

                            attendance.map((item) => (

                                <tr
                                    key={item._id}
                                    className="border-t hover:bg-gray-50"
                                >

                                    <td className="p-4">

                                        <div className="flex items-center gap-3">

                                            {item.profileImage ? (

                                                <Image
                                                    src={item.profileImage}
                                                    alt={item.employeeName}
                                                    width={42}
                                                    height={42}
                                                    className="h-11 w-11 rounded-full object-cover"
                                                />

                                            ) : (

                                                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 font-bold text-white">

                                                    {item.employeeName.charAt(0)}

                                                </div>

                                            )}

                                            {item.employeeName}

                                        </div>

                                    </td>

                                    <td className="p-4">
                                        {item.employeeId}
                                    </td>

                                    <td className="p-4 font-medium">
                                        {item.day}
                                    </td>

                                    <td className="p-4">
                                        {item.checkIn}
                                    </td>

                                    <td className="p-4 text-center">

                                        <a
                                            href={item.locationLink}
                                            target="_blank"
                                            className="inline-flex rounded-lg bg-blue-600 p-2 text-white"
                                        >
                                            <MapPin size={18} />
                                        </a>

                                    </td>

                                    <td className="p-4">

                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-semibold ${item.status === "Present"
                                                ? "bg-green-100 text-green-700"
                                                : item.status === "Late"
                                                    ? "bg-yellow-100 text-yellow-700"
                                                    : "bg-red-100 text-red-700"
                                                }`}
                                        >
                                            {item.status}
                                        </span>

                                    </td>

                                </tr>

                            ))

                        ) : (

                            <tr>

                                <td
                                    colSpan={6}
                                    className="py-10 text-center text-gray-500"
                                >
                                    No attendance found.
                                </td>

                            </tr>

                        )}

                    </tbody>

                </table>

            </div>

        </div>
    );
}