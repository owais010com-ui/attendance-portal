"use client";

import { Bell, Search } from "lucide-react";

export default function Header() {
    return (
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8">

            <div>
                <h1 className="text-2xl font-bold text-gray-800">
                    Dashboard
                </h1>

                <p className="text-sm text-gray-500">
                    Welcome back, Admin 
                </p>
            </div>

            <div className="flex items-center gap-5">

                <div className="relative">
                    <Search
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-72 rounded-lg border border-gray-300 pl-10 pr-4 py-2 outline-none focus:border-blue-500"
                    />
                </div>

                <button className="relative">
                    <Bell size={22} className="text-gray-700" />

                    <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-red-500"></span>
                </button>

                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                        A
                    </div>

                    <div>
                        <h2 className="font-semibold text-gray-800">
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