"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Users,
    ClipboardCheck,
    BarChart3,
    Settings,
    LogOut,
} from "lucide-react";

const menuItems = [
    {
        title: "Dashboard",
        href: "/admin/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Employees",
        href: "/admin/employees",
        icon: Users,
    },
    {
        title: "Attendance",
        href: "/admin/attendance",
        icon: ClipboardCheck,
    },
    {
        title: "Reports",
        href: "/admin/reports",
        icon: BarChart3,
    },
    {
        title: "Settings",
        href: "/admin/settings",
        icon: Settings,
    },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-56 bg-white border-r border-gray-200 min-h-screen flex flex-col">

            <div className="h-20 flex items-center justify-center border-b">
                <h1 className="text-2xl font-bold text-blue-600">
                    Attendance
                </h1>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-2">
                {menuItems.map((item) => {
                    const Icon = item.icon;

                    const active = pathname === item.href;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all
                                   ${active
                                    ? "bg-blue-600 text-white"
                                    : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                                }`}
                        >
                            <Icon size={20} />
                            {item.title}
                        </Link>
                    );
                })}
            </nav>

            <div className="border-t p-4">
                <button
                    className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-red-600 hover:bg-red-50 transition"
                >
                    <LogOut size={20} />
                    Logout
                </button>
            </div>

        </aside>
    );
}