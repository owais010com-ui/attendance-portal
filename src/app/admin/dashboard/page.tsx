import {
    Users,
    UserCheck,
    UserX,
    Camera,
} from "lucide-react";

import RecentAttendance from "@/components/admin/RecentAttendance";
import StatCard from "@/components/admin/StatCard";

export default function AdminDashboard() {
    return (
        <div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

                <StatCard
                    title="Total Employees"
                    value={50}
                    icon={<Users size={28} />}
                    color="bg-blue-600"
                />

                <StatCard
                    title="Present Today"
                    value={42}
                    icon={<UserCheck size={28} />}
                    color="bg-green-600"
                />

                <StatCard
                    title="Absent Today"
                    value={8}
                    icon={<UserX size={28} />}
                    color="bg-red-500"
                />

                <StatCard
                    title="Today's Check-ins"
                    value={42}
                    icon={<Camera size={28} />}
                    color="bg-purple-600"
                />


            </div>

            <RecentAttendance />
        </div>
    );
}