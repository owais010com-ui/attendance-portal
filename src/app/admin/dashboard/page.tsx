"use client";

import { useEffect, useState } from "react";
import {
    Users,
    UserCheck,
    UserX,
    Camera,
    Clock3,
} from "lucide-react";

import RecentAttendance from "@/components/admin/RecentAttendance";
import StatCard from "@/components/admin/StatCard";

interface Stats {
    totalEmployees: number;
    presentToday: number;
    lateToday: number;
    absentToday: number;
    todayAttendance: number;
}

export default function AdminDashboard() {

    const [stats, setStats] = useState<Stats>({
        totalEmployees: 0,
        presentToday: 0,
        lateToday: 0,
        absentToday: 0,
        todayAttendance: 0,
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        async function getDashboardStats() {

            try {

                const res = await fetch("/api/dashboard", {
                    cache: "no-store",
                });

                const data = await res.json();

                if (data.success) {
                    setStats(data.stats);
                }

            } catch (error) {

                console.log(error);

            } finally {

                setLoading(false);

            }

        }

        getDashboardStats();

    }, []);

    if (loading) {

        return (

            <div className="space-y-6">

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">

                    {[1, 2, 3, 4, 5].map((item) => (

                        <div
                            key={item}
                            className="h-32 animate-pulse rounded-2xl bg-gray-200"
                        />

                    ))}

                </div>

                <div className="h-[500px] animate-pulse rounded-2xl bg-gray-200" />

            </div>

        );

    }

    return (

        <div className="space-y-6">

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">

                <StatCard
                    title="Total Employees"
                    value={stats.totalEmployees}
                    icon={<Users size={24} />}
                    color="bg-blue-50 text-blue-600"
                />

                <StatCard
                    title="Present Today"
                    value={stats.presentToday}
                    icon={<UserCheck size={24} />}
                    color="bg-green-50 text-green-600"
                />

                <StatCard
                    title="Late Today"
                    value={stats.lateToday}
                    icon={<Clock3 size={24} />}
                    color="bg-yellow-50 text-yellow-600"
                />

                <StatCard
                    title="Absent Today"
                    value={stats.absentToday}
                    icon={<UserX size={24} />}
                    color="bg-red-50 text-red-600"
                />

                <StatCard
                    title="Today's Check-ins"
                    value={stats.todayAttendance}
                    icon={<Camera size={24} />}
                    color="bg-purple-50 text-purple-600"
                />

            </div>

            <RecentAttendance />

        </div>

    );

}