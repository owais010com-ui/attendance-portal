"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ArrowLeft, SearchX } from "lucide-react";

export default function NotFound() {
    const pathname = usePathname();

    const dashboardLink = pathname.startsWith("/admin")
        ? "/admin/dashboard"
        : "/employee/dashboard";


    return (

        <div className="flex min-h-screen items-center justify-center bg-slate-50 px-5">

            <div className="w-full max-w-xl rounded-3xl bg-white p-10 text-center shadow-sm">

                {/* Icon */}

                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-blue-100">

                    <SearchX
                        size={48}
                        className="text-blue-600"
                    />

                </div>

                {/* 404 */}

                <h1 className="mt-8 text-7xl font-extrabold text-blue-600">

                    404

                </h1>

                <h2 className="mt-4 text-3xl font-bold text-gray-800">

                    Page Not Found

                </h2>

                <p className="mt-3 text-gray-500">

                    The page you are looking for does not exist or has been moved.

                </p>

                {/* Buttons */}

                <div className="mt-10 flex flex-col gap-4 sm:flex-row">

                    <button
                        onClick={() => window.history.back()}
                        className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border border-gray-300 py-3 font-medium transition hover:bg-gray-100"
                    >

                        <ArrowLeft size={18} />

                        Go Back

                    </button>

                    <Link
                        href={dashboardLink}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 font-medium text-white transition hover:bg-blue-700"
                    >

                        <Home size={18} />

                        Dashboard

                    </Link>

                </div>

            </div>

        </div>

    );

}