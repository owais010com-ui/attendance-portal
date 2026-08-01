"use client";

import Link from "next/link";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
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

export default function Sidebar({

    collapsed,
    setCollapsed,
}: {
    collapsed: boolean;
    setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    const pathname = usePathname();

    return (
        <aside
            className={`hidden md:flex md:flex-col fixed left-0 top-0 h-screen border-r border-gray-200 bg-white transition-all duration-300 ${collapsed ? "w-20" : "w-56"
                }`}
        >
            <div
                className={`flex h-20 items-center border-b px-4 ${collapsed ? "justify-center" : ""
                    }`}
            >

                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-gray-100"
                >
                    {collapsed ? (
                        <PanelLeftOpen size={22} />
                    ) : (
                        <PanelLeftClose size={22} />
                    )}
                </button>

                {!collapsed && (
                    <h1 className="ml-3 text-2xl font-bold text-blue-600">
                        Attendance
                    </h1>
                )}

            </div>
            <nav
                className={`flex-1 py-6 space-y-2 ${collapsed ? "px-2" : "px-4"
                    }`}
            >
                {menuItems.map((item) => {
                    const Icon = item.icon;

                    const active = pathname === item.href;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex-row flex items-center h-10 rounded-xl transition-all duration-300 ${active
                                ? "bg-blue-600 text-white"
                                : "text-gray-700 hover:bg-gray-100"
                                } ${collapsed
                                    ? "justify-center"
                                    : "px-3 gap-3"
                                }`}
                        >
                            <Icon className="h-5 w-5" />

                            {!collapsed && (
                                <span className="text-sm font-medium">
                                    {item.title}
                                </span>
                            )}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4">

                <button
                    className={`flex w-full items-center rounded-xl py-3 text-red-600 hover:bg-red-50 ${collapsed
                        ? "justify-center"
                        : "gap-3 px-4"
                        }`}
                >

                    <LogOut size={20} />

                    {!collapsed && (
                        <span>Logout</span>
                    )}

                </button>

            </div>

        </aside>
    );
}