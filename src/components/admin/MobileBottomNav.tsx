"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Users,
    ClipboardCheck,
    BarChart3,
    Settings,
} from "lucide-react";

const menus = [
    {
        title: "Home",
        href: "/admin/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Employee",
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

export default function MobileBottomNav() {
    const pathname = usePathname();

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t bg-white md:hidden">

            {menus.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`flex flex-col items-center justify-center text-xs ${active ? "text-blue-600" : "text-gray-500"
                            }`}
                    >
                        <Icon size={22} />
                        <span>{item.title}</span>
                    </Link>
                );
            })}
        </div>
    );
}