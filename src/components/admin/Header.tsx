"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Settings, LogOut, ChevronDown } from "lucide-react";
import Image from "next/image";


export default function Header() {

    const [admin, setAdmin] = useState({
        name: "Admin",
        email: "",
        phone: "",
        profileImage: "",
    });

    useEffect(() => {
        async function getAdmin() {
            try {
                const res = await fetch("/api/settings", {
                    cache: "no-store",
                });

                const data = await res.json();

                if (data.success) {
                    setAdmin({
                        name: data.settings.adminName || "Admin",
                        email: data.settings.adminEmail || "",
                        phone: data.settings.adminPhone || "",
                        profileImage: "",
                    });
                }
            } catch (error) {
                console.log(error);
            }
        }

        getAdmin();
    }, []);

    const pathname = usePathname();

    const titles: Record<string, string> = {
        "/admin/dashboard": "Dashboard",
        "/admin/employees": "Employees",
        "/admin/attendance": "Attendance",
        "/admin/reports": "Reports",
        "/admin/settings": "Settings",
    };
    const router = useRouter();

    const [open, setOpen] = useState(false);

    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node)
            ) {
                setOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () =>
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
    }, []);

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

            <div
                className="relative flex items-center"
                ref={menuRef}
            >

                <button
                    onClick={() => setOpen(!open)}
                    className="flex items-center gap-3 rounded-xl p-2 transition hover:bg-gray-100"
                >

                    <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-blue-600 font-semibold text-white">

                        {admin.profileImage ? (
                            <Image
                                src={admin.profileImage}
                                alt={admin.name}
                                width={40}
                                height={40}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            admin.name.charAt(0).toUpperCase()
                        )}

                    </div>

                    <div className="hidden md:block text-left">

                        <h2 className="text-sm font-semibold text-gray-800">
                            {admin.name}
                        </h2>

                        <p className="text-xs text-gray-500">
                            {admin.email}
                        </p>

                    </div>

                    <ChevronDown
                        size={18}
                        className={`hidden md:block transition ${open ? "rotate-180" : ""
                            }`}
                    />

                </button>

                {open && (

                    <div className="absolute right-0 top-14 w-56 overflow-hidden rounded-2xl border bg-white shadow-xl">

                        <div className="border-b p-4">

                            <div className="flex items-center gap-3">

                                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 text-lg font-bold text-white">
                                    A
                                </div>

                                <div>

                                    <h3 className="font-semibold">
                                        Admin
                                    </h3>

                                    <p className="text-xs text-gray-500">
                                        Administrator
                                    </p>

                                </div>

                            </div>

                        </div>

                        <button
                            onClick={() => {
                                router.push("/admin/settings");
                                setOpen(false);
                            }}
                            className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-gray-100"
                        >
                            <Settings size={18} />
                            Settings
                        </button>

                        <button
                            onClick={() => {

                                localStorage.removeItem("admin");

                                router.push("/login");

                            }}
                            className="flex w-full items-center gap-3 px-4 py-3 text-left text-red-600 transition hover:bg-red-50"
                        >
                            <LogOut size={18} />
                            Logout
                        </button>

                    </div>

                )}

            </div>

        </header>
    );
}