"use client";

import { usePathname } from "next/navigation";


export default function Header() {

    const pathname = usePathname();

    const titles: Record<string, string> = {
        "/admin/dashboard": "Dashboard",
        "/admin/employees": "Employees",
        "/admin/attendance": "Attendance",
        "/admin/reports": "Reports",
        "/admin/settings": "Settings",
    };

    const title = titles[pathname] || "Admin";
    return (
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-gray-200 bg-white px-4 md:px-8">

            {/* Left */}

            <div>
                <h1 className="text-xl font-bold text-gray-800 md:text-2xl">
                    {title}
                </h1>

                <p className="hidden md:block text-sm text-gray-500">
                    Welcome back, Admin
                </p>
            </div>

            {/* Right */}

            <div className="flex items-center gap-3 md:gap-5">  
                {/* Profile */}

                <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-semibold text-white">
                        A
                    </div>

                    <div className="hidden md:block">

                        <h2 className="text-sm font-semibold text-gray-800">
                            Admin
                        </h2>

                        <p className="text-xs text-gray-500">
                            Administrator
                        </p>

                    </div>

                </div>

            </div>

        </header>
    );
}