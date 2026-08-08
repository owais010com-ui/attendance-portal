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

        <div
            className="
                fixed
                bottom-0
                left-0
                right-0
                z-50
                border-t
                border-gray-200
                bg-white/95
                shadow-[0_-5px_20px_rgba(0,0,0,0.08)]
                backdrop-blur-md
                lg:hidden
            "
        >

            <div className="grid grid-cols-4">

                {navItems.map((item) => {

                    const Icon = item.icon;

                    const active =
                        pathname === item.href ||
                        pathname.startsWith(
                            item.href + "/"
                        );

                    return (

                        <Link
                            key={item.href}
                            href={item.href}
                            className="
                                relative
                                flex
                                flex-col
                                items-center
                                justify-center
                                py-1.5
                                sm:py-2
                            "
                        >

                            {/* Active Line */}

                            {active && (
                                <span
                                    className="
                                        absolute
                                        left-5
                                        right-5
                                        top-0
                                        h-0.5
                                        rounded-full
                                        bg-blue-600
                                        sm:left-6
                                        sm:right-6
                                    "
                                />
                            )}

                            {/* Icon */}

                            <div
                                className={`
                                    flex
                                    h-9
                                    w-9
                                    items-center
                                    justify-center
                                    rounded-xl
                                    transition-all
                                    duration-300
                                    sm:h-9
                                    sm:w-9
                                    sm:rounded-xl
                                    ${
                                        active
                                            ? "bg-blue-100 text-blue-600"
                                            : "text-gray-500"
                                    }
                                `}
                            >

                                <Icon
                                    size={19}
                                    strokeWidth={
                                        active
                                            ? 2.6
                                            : 2
                                    }
                                    className="
                                        sm:h-[21px]
                                        sm:w-[21px]
                                    "
                                />

                            </div>

                            {/* Label */}

                            <span
                                className={`
                                    mt-0.5
                                    text-[10px]
                                    font-semibold
                                    transition
                                    sm:mt-1
                                    sm:text-[11px]
                                    ${
                                        active
                                            ? "text-blue-600"
                                            : "text-gray-500"
                                    }
                                `}
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