"use client";

import { useEffect, useState } from "react";
import {
    Users,
    UserCheck,
    UserX,
    Camera,
} from "lucide-react";

import RecentAttendance from "@/components/admin/RecentAttendance";
import StatCard from "@/components/admin/StatCard";

interface Stats {
    totalEmployees: number;
    activeEmployees: number;
    inactiveEmployees: number;
    todayAttendance: number;
}

export default function AdminDashboard() {

    const [stats, setStats] = useState<Stats>({
        totalEmployees: 0,
        activeEmployees: 0,
        inactiveEmployees: 0,
        todayAttendance: 0,
    });

    useEffect(() => {
        async function getDashboardStats() {
            const res = await fetch("/api/dashboard", {
                cache: "no-store",
            });

            const data = await res.json();

            if (data.success) {
                setStats(data.stats);
            }
        }

        getDashboardStats();
    }, []);

    return (
        <div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">

                <StatCard
                    title="Total Employees"
                    value={stats.totalEmployees}
                    icon={<Users size={26} strokeWidth={2.2} />}
                    color="bg-blue-50 text-blue-600 shadow-blue-200"
                />

                <StatCard
                    title="Present Today"
                    value={stats.activeEmployees}
                    icon={<UserCheck size={26} strokeWidth={2.2} />}
                    color="bg-green-50 text-green-600 shadow-green-200"
                />

                <StatCard
                    title="Absent Today"
                    value={stats.inactiveEmployees}
                    icon={<UserX size={26} strokeWidth={2.2} />}
                    color="bg-red-50 text-red-600 shadow-red-200"
                />

                <StatCard
                    title="Today's Check-ins"
                    value={stats.todayAttendance}
                    icon={<Camera size={26} strokeWidth={2.2} />}
                    color="bg-purple-50 text-purple-600 shadow-purple-200"
                />
            </div>

            <RecentAttendance />
        </div>
    );
}