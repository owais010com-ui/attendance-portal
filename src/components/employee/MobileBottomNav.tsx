"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Clock3,
    User,
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
        href: "/employee/settings",
        label: "Settings",
        icon: Settings,
    },
];

export default function MobileBottomNav() {

    const pathname = usePathname();

    return (

        <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white/95 backdrop-blur-md shadow-[0_-5px_20px_rgba(0,0,0,0.08)] lg:hidden">

            <div className="grid grid-cols-4">

                {navItems.map((item) => {

                    const Icon = item.icon;

                    const active =
                        pathname === item.href ||
                        pathname.startsWith(item.href + "/");

                    return (

                        <Link
                            key={item.href}
                            href={item.href}
                            className="relative flex flex-col items-center justify-center py-3"
                        >

                            {/* Active Line */}

                            {active && (
                                <span className="absolute left-4 right-4 top-0 h-1 rounded-full bg-blue-600" />
                            )}

                            <div
                                className={`flex h-11 w-11 items-center justify-center rounded-xl transition-all duration-300 ${active
                                        ? "bg-blue-100 text-blue-600"
                                        : "text-gray-500"
                                    }`}
                            >
                                <Icon
                                    size={22}
                                    strokeWidth={active ? 2.6 : 2}
                                />
                            </div>

                            <span
                                className={`mt-1 text-[11px] font-semibold transition ${active
                                        ? "text-blue-600"
                                        : "text-gray-500"
                                    }`}
                            >
                                {item.label}
                            </span>

                        </Link>

                    );

                })}

            </div>

        </div>

    );
}