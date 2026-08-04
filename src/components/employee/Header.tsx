"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";


interface User {
    name: string;
    role: string;
}

export default function Header() {


    const router = useRouter();

    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        async function getUser() {
            const res = await fetch("/api/auth/me", {
                cache: "no-store",
            });

            const data = await res.json();

            if (data.success) {
                setUser(data.user);
            }
        }

        getUser();
    }, []);
    return (
        <header className="sticky top-0 z-10 flex h-20 items-center justify-between bg-white px-6">

            {/* Left */}

            <div>

                <h1 className="text-2xl font-bold text-gray-800">
                    Employee Dashboard
                </h1>

                <p className="text-sm text-gray-500">
                    Welcome back
                </p>

            </div>

            {/* Right */}

            <div className="flex items-center gap-4">

                <div
                    onClick={() => router.push("/employee/profile")}
                    className="flex cursor-pointer items-center gap-3 rounded-xl p-2 transition hover:bg-gray-100"
                >

                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-500 text-lg font-bold text-white">
                        {user?.name?.charAt(0).toUpperCase()}
                    </div>

                    <div className="hidden md:block">

                        <h3 className="font-semibold text-gray-800">
                            {user?.name || "Loading..."}
                        </h3>

                        <p className="text-xs capitalize text-gray-500">
                            {user?.role || ""}
                        </p>

                    </div>

                </div>

            </div>

        </header>
    );
}