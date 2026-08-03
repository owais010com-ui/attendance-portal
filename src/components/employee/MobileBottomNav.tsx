"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Clock3,
    User,
    CalendarDays,
    Settings,
} from "lucide-react";

const navItems = [
    {
        href: "/employee/dashboard",
        label: "Home",
        icon: LayoutDashboard,
    },
    {
        href: "/employee/attendance",
        label: "Attendance",
        icon: Clock3,
    },
    {
        href: "/employee/profile",
        label: "Profile",
        icon: User,
    },
    {
        href: "/employee/leave",
        label: "Leave",
        icon: CalendarDays,
    },
    {
        href: "/employee/settings",
        label: "Settings",
        icon: Settings,
    },
];

export default function MobileBottomNav() {
    const pathname = usePathname();

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white shadow-lg lg:hidden">
            <div className="grid grid-cols-5">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const active = pathname === item.href;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex flex-col items-center justify-center gap-1 py-3 transition ${active
                                    ? "text-blue-600"
                                    : "text-gray-500 hover:text-blue-600"
                                }`}
                        >
                            <Icon size={20} />
                            <span className="text-[11px] font-medium">
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}