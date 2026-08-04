"use client";
import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";

interface User {
    name: string;
    role: string;
    profileImage: string;
}


export default function Header() {


    const router = useRouter();

    const [user, setUser] = useState<User | null>(null);
    const pathname = usePathname();

    useEffect(() => {
        async function getUser() {
            const res = await fetch("/api/auth/me", {
                cache: "no-store",
            });

            const data = await res.json();
            
            console.log(data.user);

            if (data.success) {
                setUser(data.user);
            }
        }


        getUser();
    }, []);

    const pageTitle = useMemo(() => {

        const titles: Record<string, string> = {

            "/employee/dashboard": "Dashboard",

            "/employee/attendance": "Attendance",

            "/employee/profile": "My Profile",

            "/employee/profile/edit": "Edit Profile",

            "/employee/change-password": "Change Password",

            "/employee/settings": "Settings",

        };

        return titles[pathname] || "Employee";

    }, [pathname]);
    return (
        <header className="sticky top-0 z-10 flex h-20 items-center justify-between bg-white px-6">

            {/* Left */}

            <div>

                <h1 className="text-2xl font-bold text-gray-800">
                    {pageTitle}
                </h1>

            </div>

            {/* Right */}

            <div className="flex items-center gap-4">

                <div
                    onClick={() => router.push("/employee/profile")}
                    className="flex cursor-pointer items-center gap-3 rounded-xl p-2 transition hover:bg-gray-100"
                >

                    <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-blue-600">
                        {user?.profileImage ? (
                            <Image
                                src={user.profileImage}
                                alt="Profile"
                                width={44}
                                height={44}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <span className="text-lg font-bold text-white">
                                {user?.name?.charAt(0).toUpperCase()}
                            </span>
                        )}
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