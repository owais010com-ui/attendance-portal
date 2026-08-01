"use client";

import { Download, FileSpreadsheet, CalendarDays } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useEffect, useState } from "react";

import {
    Users,
    UserCheck,
    UserX,
    Percent,
} from "lucide-react";

import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    PieChart,
    Pie,
    Cell,
} from "recharts";


const COLORS = [
    "#2563EB", // Present
    "#F59E0B", // Late
    "#EF4444", // Absent
];


export default function ReportsPage() {

    interface Attendance {
        _id: string;
        employeeName: string;
        employeeId: string;
        date: string;
        checkIn: string;
        status: string;
    }

    const [attendance, setAttendance] = useState<Attendance[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function getAttendance() {
            try {
                const res = await fetch("/api/attendance");
                const data = await res.json();

                if (data.success) {
                    setAttendance(data.attendance);
                }
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        }

        getAttendance();
    }, []);

    const [filter, setFilter] = useState("today");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    const exportPDF = () => {
        const doc = new jsPDF();

        doc.setFontSize(18);
        doc.text("Attendance Report", 14, 18);

        autoTable(doc, {
            head: [["Employee", "ID", "Date", "Check In", "Status"]],
            body: filteredAttendance.map((item) => [
                item.employeeName,
                item.employeeId,
                item.date,
                item.checkIn,
                item.status,
            ]),
            startY: 28,
        });

        doc.save("Attendance-Report.pdf");
    };

    const exportExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(
            filteredAttendance.map((item) => ({
                Employee: item.employeeName,
                ID: item.employeeId,
                Date: item.date,
                CheckIn: item.checkIn,
                Status: item.status,
            }))
        );

        const workbook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(
            workbook,
            worksheet,
            "Attendance"
        );

        const excelBuffer = XLSX.write(workbook, {
            bookType: "xlsx",
            type: "array",
        });

        const file = new Blob([excelBuffer], {
            type: "application/octet-stream",
        });

        saveAs(file, "Attendance-Report.xlsx");
    };

    const filteredAttendance = attendance.filter((item) => {
        const attendanceDate = new Date(item.date);
        const today = new Date();

        if (filter === "today") {
            return attendanceDate.toDateString() === today.toDateString();
        }

        if (filter === "week") {
            const firstDay = new Date(today);
            firstDay.setDate(today.getDate() - today.getDay());

            const lastDay = new Date(firstDay);
            lastDay.setDate(firstDay.getDate() + 6);

            return attendanceDate >= firstDay && attendanceDate <= lastDay;
        }

        if (filter === "month") {
            return (
                attendanceDate.getMonth() === today.getMonth() &&
                attendanceDate.getFullYear() === today.getFullYear()
            );
        }

        if (filter === "custom") {
            if (!fromDate || !toDate) return true;

            const endDate = new Date(toDate);
            endDate.setHours(23, 59, 59, 999);

            return (
                attendanceDate >= new Date(fromDate) &&
                attendanceDate <= endDate
            );
        }

        return true;
    });

    const reportTitle =
        filter === "today"
            ? "Today's Attendance"
            : filter === "week"
                ? "Weekly Attendance"
                : filter === "month"
                    ? "Monthly Attendance"
                    : "Custom Attendance";


    const pieTitle =
        filter === "today"
            ? "Today's Attendance Ratio"
            : filter === "week"
                ? "Weekly Attendance Ratio"
                : filter === "month"
                    ? "Monthly Attendance Ratio"
                    : "Custom Attendance Ratio";

    const totalEmployees = new Set(
        filteredAttendance.map((item) => item.employeeId)
    ).size;

    const presentCount = filteredAttendance.filter(
        (item) => item.status === "Present"
    ).length;

    const absentCount = filteredAttendance.filter(
        (item) => item.status !== "Present"
    ).length;

    const attendancePercentage =
        totalEmployees === 0
            ? 0
            : Math.round((presentCount / totalEmployees) * 100);

    const chartData = (() => {
        // TODAY
        if (filter === "today") {
            return [
                {
                    period: "Today",
                    present: filteredAttendance.filter(
                        (i) => i.status === "Present"
                    ).length,
                    absent: filteredAttendance.filter(
                        (i) => i.status !== "Present"
                    ).length,
                },
            ];
        }

        // WEEK
        if (filter === "week") {
            const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

            const data = days.map((day) => ({
                period: day,
                present: 0,
                absent: 0,
            }));

            filteredAttendance.forEach((item) => {
                const day = days[new Date(item.date).getDay()];
                const index = data.findIndex((d) => d.period === day);

                if (item.status === "Present") {
                    data[index].present++;
                } else {
                    data[index].absent++;
                }
            });

            return data;
        }

        // MONTH
        if (filter === "month") {
            const daysInMonth = new Date(
                new Date().getFullYear(),
                new Date().getMonth() + 1,
                0
            ).getDate();

            const data = Array.from({ length: daysInMonth }, (_, i) => ({
                period: String(i + 1),
                present: 0,
                absent: 0,
            }));

            filteredAttendance.forEach((item) => {
                const day = new Date(item.date).getDate();

                if (item.status === "Present") {
                    data[day - 1].present++;
                } else {
                    data[day - 1].absent++;
                }
            });

            return data;
        }

        // CUSTOM
        const map = new Map<
            string,
            { period: string; present: number; absent: number }
        >();

        filteredAttendance.forEach((item) => {
            if (!map.has(item.date)) {
                map.set(item.date, {
                    period: item.date,
                    present: 0,
                    absent: 0,
                });
            }

            const row = map.get(item.date)!;

            if (item.status === "Present") {
                row.present++;
            } else {
                row.absent++;
            }
        });

        return Array.from(map.values());
    })();

    const pieData = [
        {
            name: "Present",
            value: filteredAttendance.filter(
                (item) => item.status === "Present"
            ).length,
        },
        {
            name: "Absent",
            value: filteredAttendance.filter(
                (item) => item.status !== "Present"
            ).length,
        },
    ];

    return (
        <div className="space-y-6">

            <div className="rounded-2xl bg-white p-5 shadow">

                <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

                    {/* Filter */}

                    <div>

                        <label className="mb-3 block text-sm font-semibold text-gray-700">
                            Report Period
                        </label>

                        <div className="flex flex-wrap gap-2">

                            {[
                                { id: "today", label: "Today" },
                                { id: "week", label: "This Week" },
                                { id: "month", label: "This Month" },
                                { id: "custom", label: "Custom" },
                            ].map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => setFilter(item.id)}
                                    className={`rounded-lg px-4 py-2 text-sm font-medium transition ${filter === item.id
                                        ? "bg-blue-600 text-white"
                                        : "border border-gray-300 bg-white hover:bg-gray-100"
                                        }`}
                                >
                                    {item.label}
                                </button>
                            ))}

                        </div>

                    </div>

                    {/* Export */}

                    <div className="flex gap-2">

                        <button
                            onClick={exportPDF}
                            className="flex h-10 items-center gap-2 rounded-lg bg-red-600 px-4 text-sm font-medium text-white transition hover:bg-red-700"
                        >
                            <Download size={16} />
                            PDF
                        </button>

                        <button
                            onClick={exportExcel}
                            className="flex h-10 items-center gap-2 rounded-lg bg-green-600 px-4 text-sm font-medium text-white transition hover:bg-green-700"
                        >
                            <FileSpreadsheet size={16} />
                            Excel
                        </button>

                    </div>

                </div>

                {filter === "custom" && (

                    <div className="mt-5 flex flex-col gap-3 sm:flex-row">

                        <div className="relative w-full">

                            <CalendarDays
                                size={18}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            />

                            <input
                                type="date"
                                value={fromDate}
                                onChange={(e) => setFromDate(e.target.value)}
                                className="h-11 w-full rounded-xl border border-gray-300 pl-10 pr-4 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />

                        </div>

                        <div className="relative w-full">

                            <CalendarDays
                                size={18}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            />

                            <input
                                type="date"
                                value={toDate}
                                onChange={(e) => setToDate(e.target.value)}
                                className="h-11 w-full rounded-xl border border-gray-300 pl-10 pr-4 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />

                        </div>

                    </div>

                )}

            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

                <div className="flex items-center justify-between rounded-2xl bg-white p-5 shadow">
                    <div>
                        <p className="text-sm text-gray-500">
                            Total Employees
                        </p>

                        <h2 className="mt-2 text-3xl font-bold">
                            {totalEmployees}
                        </h2>
                    </div>

                    <div className="rounded-xl bg-gray-200 p-3">
                        <Users className="text-gray-600" />
                    </div>
                </div>

                <div className="flex items-center justify-between rounded-2xl bg-white p-5 shadow">
                    <div>
                        <p className="text-sm text-gray-500">
                            Present
                        </p>

                        <h2 className="mt-2 text-3xl font-bold text-green-600">
                            {presentCount}
                        </h2>
                    </div>

                    <div className="rounded-xl bg-green-100 p-3">
                        <UserCheck className="text-green-600" />
                    </div>
                </div>

                <div className="flex items-center justify-between rounded-2xl bg-white p-5 shadow">
                    <div>
                        <p className="text-sm text-gray-500">
                            Absent
                        </p>

                        <h2 className="mt-2 text-3xl font-bold text-red-600">
                            {absentCount}
                        </h2>
                    </div>

                    <div className="rounded-xl bg-red-100 p-3">
                        <UserX className="text-red-600" />
                    </div>
                </div>

                <div className="flex items-center justify-between rounded-2xl bg-white p-5 shadow ">
                    <div>
                        <p className="text-sm text-gray-500">
                            Attendance %
                        </p>

                        <h2 className="mt-2 text-3xl font-bold text-blue-600">
                            {attendancePercentage}%
                        </h2>
                    </div>

                    <div className="rounded-xl bg-blue-100 p-3">
                        <Percent className="text-blue-600" />
                    </div>
                </div>

            </div>

            {/* Charts */}

            <div className="grid gap-6 lg:grid-cols-2">

                {/* Bar */}

                <div className="rounded-2xl bg-white p-6 shadow">

                    <h2 className="mb-5 text-xl font-semibold">
                        {reportTitle}
                    </h2>
                    <div className="h-80">

                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="period" />
                                <YAxis />
                                <Tooltip />
                                <Bar
                                    dataKey="present"
                                    fill="#2563EB"
                                    radius={[6, 6, 0, 0]}
                                />

                                <Bar
                                    dataKey="absent"
                                    fill="#EF4444"
                                    radius={[6, 6, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>

                    </div>

                </div>

                {/* Pie */}

                <div className="rounded-2xl bg-white p-6 shadow">

                    <h2 className="mb-5 text-xl font-semibold">
                        {pieTitle}
                    </h2>

                    <div className="h-80">

                        <ResponsiveContainer width="100%" height="100%">

                            <PieChart>

                                <Pie
                                    data={pieData}
                                    dataKey="value"
                                    nameKey="name"
                                    outerRadius={110}
                                    label
                                >
                                    {pieData.map((_, index) => (
                                        <Cell
                                            key={index}
                                            fill={COLORS[index]}
                                        />
                                    ))}
                                </Pie>

                                <Tooltip />

                            </PieChart>

                        </ResponsiveContainer>

                    </div>

                </div>

            </div>
            <div className="rounded-2xl bg-white shadow">

                <div className="border-b p-5">
                    <h2 className="text-lg font-semibold text-slate-800">
                        Attendance Report
                    </h2>
                </div>

                <div className="overflow-x-auto">

                    <table className="w-full">

                        <thead className="bg-slate-50">

                            <tr>

                                <th className="px-5 py-4 text-left">Employee</th>
                                <th className="px-5 py-4 text-left">Date</th>
                                <th className="px-5 py-4 text-left">Check In</th>
                                <th className="px-5 py-4 text-left">Status</th>

                            </tr>

                        </thead>

                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="py-10 text-center text-gray-500">
                                        Loading...
                                    </td>
                                </tr>
                            ) : filteredAttendance.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="py-10 text-center text-gray-500">
                                        No attendance records found.
                                    </td>
                                </tr>
                            ) : (
                                filteredAttendance.map((item) => (
                                    <tr
                                        key={item._id}
                                        className="border-t transition hover:bg-gray-50"
                                    >
                                        {/* Employee */}

                                        <td className="px-5 py-4">
                                            <div>
                                                <p className="font-semibold text-slate-800">
                                                    {item.employeeName}
                                                </p>

                                                <p className="text-xs text-gray-500">
                                                    {item.employeeId}
                                                </p>
                                            </div>
                                        </td>

                                        {/* Date */}

                                        <td className="px-5 py-4 text-gray-700">
                                            {item.date}
                                        </td>

                                        {/* Check In */}

                                        <td className="px-5 py-4 text-gray-700">
                                            {item.checkIn}
                                        </td>

                                        {/* Status */}

                                        <td className="px-5 py-4">
                                            <span
                                                className={`rounded-full px-3 py-1 text-xs font-semibold ${item.status === "Present"
                                                    ? "bg-green-100 text-green-700"
                                                    : item.status === "Late"
                                                        ? "bg-orange-100 text-orange-700"
                                                        : "bg-red-100 text-red-700"
                                                    }`}
                                            >
                                                {item.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>

                    </table>

                </div>

            </div>

        </div>
    );
}