"use client";

import { useEffect, useState } from "react";

import AttendanceCard from "@/components/employee/AttendanceCard";
import DashboardCards from "@/components/employee/DashboardCards";
import RecentAttendance from "@/components/employee/RecentAttendance";
import WelcomeCard from "@/components/employee/WelcomeCard";


interface User {
  _id: string;
  name: string;
  email: string;
  employeeId: string;
  role: string;
  isActive: boolean;
}

interface Attendance {
  _id: string;
  date: string;
  checkIn: string;
  status: string;
  photo: string;
  locationLink: string;
  createdAt: string;
}

interface DashboardStats {
  totalPresent: number;
  totalAbsent: number;
  totalLate: number;
  monthlyAttendance: number;
  attendancePercentage: number;
}

interface DashboardData {
  user: User;
  todayAttendance: Attendance | null;
  recentAttendance: Attendance[];
  stats: DashboardStats;
}

export default function EmployeeDashboard() {

  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    async function getDashboard() {

      try {

        const res = await fetch("/api/dashboard/employee", {
          cache: "no-store",
        });

        const data = await res.json();

        if (data.success) {
          setDashboardData(data);
        }

      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }

    getDashboard();

  }, []);

  if (loading) {
    return (
      <div className="rounded-2xl bg-white p-10 text-center">
        Loading Dashboard...
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="rounded-2xl bg-white p-10 text-center">
        Failed to load dashboard.
      </div>
    );
  }

  return (
    <div className="space-y-6">

      <WelcomeCard
        user={dashboardData.user}
      />

      <DashboardCards
        stats={dashboardData.stats}
        todayAttendance={dashboardData.todayAttendance}
      />

      <div className="grid gap-6 xl:grid-cols-3">

        <div className="xl:col-span-1">

          <AttendanceCard
            stats={dashboardData.stats}
          />

        </div>

        <div className="xl:col-span-2">

          <RecentAttendance
            attendance={dashboardData.recentAttendance}
          />

        </div>

      </div>

    </div>
  );
}