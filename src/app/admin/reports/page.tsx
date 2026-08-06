"use client";

import { useEffect, useState } from "react";
import { Download, FileSpreadsheet, CalendarDays } from "lucide-react";
import {
    Users,
    UserCheck,
    UserX,
} from "lucide-react";
import Image from "next/image";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

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
    "#2563EB",
    "#F59E0B",
    "#EF4444",
];

interface Attendance {
    _id: string;
    employeeId: string;
    employeeName: string;
    email: string;
    photo: string;
    latitude: number | null;
    longitude: number | null;
    locationLink: string;
    date: string;
    checkIn: string;
    status: "Present" | "Late" | "Absent";
    createdAt: string;
    updatedAt: string;
}

interface ReportStats {
    totalEmployees: number;
    present: number;
    late: number;
    absent: number;
    attendancePercentage: number;
}

export default function ReportsPage() {

    const [filter, setFilter] = useState("today");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    const [attendance, setAttendance] = useState<Attendance[]>([]);

    const [stats, setStats] = useState<ReportStats>({
        totalEmployees: 0,
        present: 0,
        late: 0,
        absent: 0,
        attendancePercentage: 0,
    });

    const [loading, setLoading] = useState(true);
    useEffect(() => {
        async function getReports() {
            try {
                setLoading(true);

                const res = await fetch(
                    `/api/reports?filter=${filter}&fromDate=${fromDate}&toDate=${toDate}`,
                    {
                        cache: "no-store",
                    }
                );

                const data = await res.json();

                if (data.success) {
                    setAttendance(data.attendance);
                    setStats(data.stats);
                }
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        }

        getReports();
    }, [filter, fromDate, toDate]);

    const exportPDF = () => {
        const doc = new jsPDF();

        doc.setFontSize(18);
        doc.text("Attendance Report", 14, 18);

        autoTable(doc, {
            head: [["Employee", "ID", "Date", "Check In", "Status"]],
            body: attendance.map((item) => [
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
            attendance.map((item) => ({
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

    const totalEmployees = stats.totalEmployees;

    const presentCount = stats.present;

    const lateCount = stats.late;

    const absentCount = stats.absent;

    const attendancePercentage = stats.attendancePercentage;

    const chartData = (() => {

        if (filter === "today") {

            return [
                {
                    period: "Today",
                    present: stats.present,
                    late: stats.late,
                    absent: stats.absent,
                },
            ];

        }

        if (filter === "week") {

            const days = [
                "Sun",
                "Mon",
                "Tue",
                "Wed",
                "Thu",
                "Fri",
                "Sat",
            ];

            const data = days.map((day) => ({
                period: day,
                present: 0,
                late: 0,
                absent: 0,
            }));

            attendance.forEach((item) => {

                const index = new Date(item.date).getDay();

                if (item.status === "Present") {

                    data[index].present++;

                } else if (item.status === "Late") {

                    data[index].late++;

                } else {

                    data[index].absent++;

                }

            });

            return data;

        }

        if (filter === "month") {

            const daysInMonth = new Date(
                new Date().getFullYear(),
                new Date().getMonth() + 1,
                0
            ).getDate();

            const data = Array.from(
                { length: daysInMonth },
                (_, i) => ({
                    period: String(i + 1),
                    present: 0,
                    late: 0,
                    absent: 0,
                })
            );

            attendance.forEach((item) => {

                const day = new Date(item.date).getDate() - 1;

                if (item.status === "Present") {

                    data[day].present++;

                } else if (item.status === "Late") {

                    data[day].late++;

                } else {

                    data[day].absent++;

                }

            });

            return data;

        }

        const map = new Map<
            string,
            {
                period: string;
                present: number;
                late: number;
                absent: number;
            }
        >();

        attendance.forEach((item) => {

            if (!map.has(item.date)) {

                map.set(item.date, {
                    period: item.date,
                    present: 0,
                    late: 0,
                    absent: 0,
                });

            }

            const row = map.get(item.date)!;

            if (item.status === "Present") {

                row.present++;

            } else if (item.status === "Late") {

                row.late++;

            } else {

                row.absent++;

            }

        });

        return Array.from(map.values());

    })();

    const pieData = [
        {
            name: "Present",
            value: presentCount,
        },
        {
            name: "Late",
            value: lateCount,
        },
        {
            name: "Absent",
            value: absentCount,
        },
    ];

    if (loading) {

        return (

            <div className="space-y-6">

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

                    {[1, 2, 3, 4].map((item) => (

                        <div
                            key={item}
                            className="h-32 animate-pulse rounded-2xl bg-gray-200"
                        />

                    ))}

                </div>

                <div className="h-96 animate-pulse rounded-2xl bg-gray-200" />

                <div className="h-96 animate-pulse rounded-2xl bg-gray-200" />

            </div>

        );

    }

    return (
        <div className="space-y-6">

            {/* Filter */}

            <div className="rounded-2xl bg-white p-5 shadow">

                <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

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

            {/* Stats */}

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">

                <div className="flex items-center justify-between rounded-2xl bg-white p-5 shadow">

                    <div>

                        <p className="text-sm text-gray-500">
                            Total Employees
                        </p>

                        <h2 className="mt-2 text-3xl font-bold">
                            {totalEmployees}
                        </h2>

                    </div>

                    <div className="rounded-xl bg-slate-100 p-3">
                        <Users className="text-slate-700" />
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
                            Late
                        </p>

                        <h2 className="mt-2 text-3xl font-bold text-yellow-600">
                            {lateCount}
                        </h2>

                    </div>

                    <div className="rounded-xl bg-yellow-100 p-3">
                        <CalendarDays className="text-yellow-600" />
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

                <div className="flex items-center justify-between rounded-2xl bg-white p-5 shadow">

                    <div>

                        <p className="text-sm text-gray-500">
                            Attendance %
                        </p>

                        <h2 className="mt-2 text-3xl font-bold text-blue-600">
                            {attendancePercentage}%
                        </h2>

                    </div>

                    <div className="rounded-xl bg-blue-100 p-3">
                        <span className="text-xl font-bold text-blue-600">%</span>
                    </div>

                </div>

            </div>
            {/* Charts */}

            <div className="grid gap-6 lg:grid-cols-2">

                {/* Bar Chart */}

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
                                    dataKey="late"
                                    fill="#F59E0B"
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

                {/* Pie Chart */}

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

                                    {pieData.map((item, index) => (

                                        <Cell
                                            key={item.name}
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

            {/* Attendance Report */}

            <div className="rounded-2xl bg-white shadow">

                <div className="border-b p-5">

                    <h2 className="text-lg font-semibold">
                        Attendance Report
                    </h2>

                </div>

                {/* Mobile Cards */}

                <div className="space-y-4 p-4 lg:hidden">

                    {attendance.length === 0 ? (

                        <div className="py-10 text-center text-gray-500">
                            No attendance found.
                        </div>

                    ) : (

                        attendance.map((item) => (

                            <div
                                key={item._id}
                                className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
                            >

                                <div className="flex items-center gap-3">

                                    {item.photo ? (

                                        <Image
                                            src={item.photo}
                                            alt={item.employeeName}
                                            width={48}
                                            height={48}
                                            className="h-12 w-12 rounded-full object-cover"
                                        />

                                    ) : (

                                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-lg font-bold text-white">
                                            {item.employeeName.charAt(0).toUpperCase()}
                                        </div>

                                    )}

                                    <div>

                                        <h3 className="font-semibold text-slate-800">
                                            {item.employeeName}
                                        </h3>

                                        <p className="text-sm text-gray-500">
                                            {item.employeeId}
                                        </p>

                                    </div>

                                </div>

                                <div className="mt-4 space-y-2 text-sm">

                                    <div className="flex justify-between">

                                        <span className="font-medium">
                                            Date
                                        </span>

                                        <span>{item.date}</span>

                                    </div>

                                    <div className="flex justify-between">

                                        <span className="font-medium">
                                            Check In
                                        </span>

                                        <span>{item.checkIn}</span>

                                    </div>

                                    <div className="flex items-center justify-between">

                                        <span className="font-medium">
                                            Status
                                        </span>

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

                            </div>

                        ))

                    )}

                </div>

                {/* Desktop Table */}

                <div className="hidden overflow-x-auto lg:block">

                    <table className="w-full">

                        <thead className="bg-slate-50">

                            <tr>

                                <th className="px-5 py-4 text-left">
                                    Employee
                                </th>

                                <th className="px-5 py-4 text-left">
                                    Date
                                </th>

                                <th className="px-5 py-4 text-left">
                                    Check In
                                </th>

                                <th className="px-5 py-4 text-left">
                                    Status
                                </th>

                            </tr>

                        </thead>

                        <tbody>
                            {attendance.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan={4}
                                        className="py-10 text-center text-gray-500"
                                    >
                                        No attendance found.
                                    </td>

                                </tr>

                            ) : (

                                attendance.map((item) => (

                                    <tr
                                        key={item._id}
                                        className="border-t transition hover:bg-slate-50"
                                    >

                                        <td className="px-5 py-4">

                                            <div className="flex items-center gap-3">

                                                {item.photo ? (

                                                    <Image
                                                        src={item.photo}
                                                        alt={item.employeeName}
                                                        width={40}
                                                        height={40}
                                                        className="h-10 w-10 rounded-full object-cover"
                                                    />

                                                ) : (

                                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                                                        {item.employeeName.charAt(0).toUpperCase()}
                                                    </div>

                                                )}

                                                <div>

                                                    <p className="font-semibold text-slate-800">
                                                        {item.employeeName}
                                                    </p>

                                                    <p className="text-xs text-gray-500">
                                                        {item.employeeId}
                                                    </p>

                                                </div>

                                            </div>
                                        </td>

                                        <td className="px-5 py-4">
                                            {item.date}
                                        </td>

                                        <td className="px-5 py-4">
                                            {item.checkIn}
                                        </td>

                                        <td className="px-5 py-4">

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

                            )}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>
    );
}