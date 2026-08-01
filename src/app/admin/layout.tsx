"use client";

import { useState } from "react";
import Sidebar from "@/components/admin/Sidebar";
import Header from "@/components/admin/Header";
import MobileBottomNav from "@/components/admin/MobileBottomNav";

export default function AdminLayout({
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
        className={`flex flex-1 flex-col overflow-hidden transition-all duration-300 ${collapsed ? "md:ml-20" : "md:ml-56"
          }`}
      >
        <Header />

        <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-20">
          {children}
        </main>

        <MobileBottomNav />

      </div>

    </div>
  );
}