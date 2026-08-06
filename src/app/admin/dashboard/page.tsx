"use client";

import { useEffect, useState } from "react";
import {
    Users,
    Camera,
} from "lucide-react";

import RecentAttendance from "@/components/admin/RecentAttendance";
import StatCard from "@/components/admin/StatCard";

interface Stats {
    totalEmployees: number;
    todayAttendance: number;
}

export default function AdminDashboard() {

    const [stats, setStats] = useState<Stats>({
        totalEmployees: 0,
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

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                    {[1, 2].map((item) => (

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

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                <StatCard
                    title="Total Employees"
                    value={stats.totalEmployees}
                    icon={<Users size={24} />}
                    color="bg-blue-50 text-blue-600"
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