"use client";

import { CalendarDays, Plus } from "lucide-react";

const history = [
    {
        type: "Casual Leave",
        from: "10 Aug 2026",
        to: "11 Aug 2026",
        status: "Approved",
    },
    {
        type: "Sick Leave",
        from: "22 Jul 2026",
        to: "22 Jul 2026",
        status: "Pending",
    },
    {
        type: "Annual Leave",
        from: "03 Jun 2026",
        to: "06 Jun 2026",
        status: "Rejected",
    },
];

export default function LeaveCard() {
    return (
        <div className="space-y-6">

            {/* Apply Leave */}

            <div className="rounded-2xl border bg-white p-6 shadow-sm">

                <div className="flex items-center justify-between">

                    <div>

                        <h2 className="text-2xl font-bold">
                            Apply Leave
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            Submit a leave request
                        </p>

                    </div>

                    <div className="rounded-xl bg-blue-50 p-4 text-blue-600">

                        <CalendarDays size={28} />

                    </div>

                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2">

                    <input
                        className="rounded-xl border p-3 outline-none focus:border-blue-600"
                        placeholder="Leave Type"
                    />

                    <input
                        type="date"
                        className="rounded-xl border p-3 outline-none focus:border-blue-600"
                    />

                    <input
                        type="date"
                        className="rounded-xl border p-3 outline-none focus:border-blue-600"
                    />

                    <input
                        className="rounded-xl border p-3 outline-none focus:border-blue-600"
                        placeholder="Reason"
                    />

                </div>

                <button className="mt-6 flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700">

                    <Plus size={18} />

                    Apply Leave

                </button>

            </div>

            {/* Leave History */}

            <div className="rounded-2xl border bg-white shadow-sm">

                <div className="border-b p-5">

                    <h2 className="text-xl font-bold">
                        Leave History
                    </h2>

                </div>

                <div className="overflow-x-auto">

                    <table className="w-full">

                        <thead className="bg-gray-50">

                            <tr>

                                <th className="px-5 py-4 text-left">
                                    Type
                                </th>

                                <th className="px-5 py-4 text-left">
                                    From
                                </th>

                                <th className="px-5 py-4 text-left">
                                    To
                                </th>

                                <th className="px-5 py-4 text-left">
                                    Status
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {history.map((item, index) => (

                                <tr
                                    key={index}
                                    className="border-t hover:bg-gray-50"
                                >

                                    <td className="px-5 py-4">
                                        {item.type}
                                    </td>

                                    <td className="px-5 py-4">
                                        {item.from}
                                    </td>

                                    <td className="px-5 py-4">
                                        {item.to}
                                    </td>

                                    <td className="px-5 py-4">

                                        <span
                                            className={`rounded-full px-3 py-1 text-sm font-medium ${item.status === "Approved"
                                                    ? "bg-green-100 text-green-700"
                                                    : item.status === "Pending"
                                                        ? "bg-yellow-100 text-yellow-700"
                                                        : "bg-red-100 text-red-700"
                                                }`}
                                        >
                                            {item.status}
                                        </span>

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>
    );
}