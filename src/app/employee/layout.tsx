"use client";

import { useState } from "react";

import Sidebar from "@/components/employee/Sidebar";
import Header from "@/components/employee/Header";
import MobileBottomNav from "@/components/employee/MobileBottomNav";

export default function EmployeeLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className="flex h-screen overflow-hidden bg-gray-100">

            <Sidebar
                collapsed={collapsed}
                setCollapsed={setCollapsed}
            />

            <div
                className={`flex flex-1 flex-col overflow-hidden transition-all duration-300 ${collapsed ? "lg:ml-20" : "lg:ml-56"
                    }`}
            >
                <Header />

                <main className="flex-1 overflow-y-auto px-6 py-6 pb-24">
                    {children}
                </main>

                <MobileBottomNav />

            </div>

        </div>
    );
}