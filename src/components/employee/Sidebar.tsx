"use client";

import Link from "next/link";
import { KeyRound } from "lucide-react";
import { toast } from "sonner";
import { usePathname, useRouter } from "next/navigation";
import LogoutModal from "./LogoutModal";
import {
    PanelLeftClose,
    PanelLeftOpen,
    LayoutDashboard,
    ClipboardCheck,
    User,
    Settings,
    LogOut,
} from "lucide-react";
import { useState } from "react";

const menuItems = [
    {
        title: "Dashboard",
        href: "/employee/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Attendance",
        href: "/employee/attendance",
        icon: ClipboardCheck,
    },
    {
        title: "My Profile",
        href: "/employee/profile",
        icon: User,
    },
    {
        title: "Settings",
        href: "/employee/settings",
        icon: Settings,
    },
    {
        title: "Change Password",
        href: "/employee/change-password",
        icon: KeyRound,
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

    const router = useRouter();

    const [logoutModal, setLogoutModal] = useState(false);
    const [logoutLoading, setLogoutLoading] = useState(false);

    async function handleLogout() {
        setLogoutLoading(true);
        setLogoutModal(false);

        try {
            const res = await fetch("/api/auth/logout", {
                method: "POST",
            });

            const data = await res.json();

            if (data.success) {
                toast.success("Logged out successfully");

                router.replace("/login");
                router.refresh();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
        }
        finally {
            setLogoutLoading(false);
        }
    }

    return (
        <aside
            className={`hidden lg:flex lg:flex-col fixed left-0 top-0 h-screen border-r border-gray-200 bg-white transition-all duration-300 ${collapsed ? "w-20" : "w-56"
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
                        Employee
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
                            className={`flex items-center h-10 rounded-xl transition-all duration-300 ${active
                                ? "bg-blue-600 text-white"
                                : "text-gray-700 hover:bg-gray-100"
                                } ${collapsed
                                    ? "justify-center"
                                    : "gap-3 px-3"
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
                    onClick={() => setLogoutModal(true)}
                    className={`flex w-full cursor-pointer items-center rounded-xl py-3 text-red-600 transition hover:bg-red-50 ${collapsed ? "justify-center" : "gap-3 px-4"
                        }`}
                >
                    <LogOut size={20} />

                    {!collapsed && <span>Logout</span>}
                </button>
            </div>

            <LogoutModal
                isOpen={logoutModal}
                onClose={() => setLogoutModal(false)}
                onConfirm={handleLogout}
                loading={logoutLoading}
            />
        </aside>
    );
}