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
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.08)] md:hidden">

            <div className="flex h-16 items-center justify-around">

                {menus.map((item) => {

                    const Icon = item.icon;

                    const active = pathname === item.href;
                    // console.log(pathname);

                    return (

                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex flex-1 flex-col items-center justify-center"
                        >
                            <Icon
                                size={22}
                                className={
                                    active
                                        ? "text-blue-600"
                                        : "text-gray-500"
                                }
                            />

                            <span
                                className={`mt-1 text-[11px] font-medium ${active
                                        ? "text-blue-600"
                                        : "text-gray-500"
                                    }`}
                            >
                                {item.title}
                            </span>
                        </Link>

                    );

                })}

            </div>

        </div>
    );
}