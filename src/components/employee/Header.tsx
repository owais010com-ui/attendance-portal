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

    const [user, setUser] =
        useState<User | null>(null);

    const pathname = usePathname();

    useEffect(() => {

        async function getUser() {

            try {

                const res =
                    await fetch(
                        "/api/auth/me",
                        {
                            cache: "no-store",
                        }
                    );

                const data =
                    await res.json();

                if (data.success) {
                    setUser(data.user);
                }

            } catch (error) {

                console.log(
                    "Header User Error:",
                    error
                );
            }
        }

        getUser();

    }, []);


    const pageTitle = useMemo(() => {

        const titles: Record<string, string> = {

            "/employee/dashboard":
                "Dashboard",

            "/employee/attendance":
                "Attendance",

            "/employee/profile":
                "My Profile",

            "/employee/profile/edit":
                "Edit Profile",

            "/employee/change-password":
                "Change Password",

            "/employee/settings":
                "Settings",

        };

        return (
            titles[pathname] ||
            "Employee"
        );

    }, [pathname]);


    return (

        <header
            className="
                sticky
                top-0
                flex
                h-14
                items-center
                justify-between
                bg-white
                px-3
                sm:h-16
                sm:px-5
                lg:h-20
                lg:px-6
            "
        >

            {/* Left */}

            <div>

                <h1
                    className="
                        text-lg
                        font-bold
                        text-gray-800
                        sm:text-xl
                        lg:text-2xl
                    "
                >
                    {pageTitle}
                </h1>

            </div>


            {/* Right */}

            <div
                className="
                    flex
                    items-center
                    gap-2
                    sm:gap-3
                    lg:gap-4
                "
            >

                <div
                    onClick={() =>
                        router.push(
                            "/employee/profile"
                        )
                    }
                    className="
                        flex
                        cursor-pointer
                        items-center
                        gap-2
                        rounded-xl
                        p-1
                        transition
                        hover:bg-gray-100
                        sm:gap-3
                        sm:p-2
                    "
                >

                    {/* Profile Image */}

                    <div
                        className="
                            flex
                            h-9
                            w-9
                            items-center
                            justify-center
                            overflow-hidden
                            rounded-full
                            bg-blue-600
                            sm:h-10
                            sm:w-10
                            lg:h-11
                            lg:w-11
                        "
                    >

                        {user?.profileImage ? (

                            <Image
                                src={
                                    user.profileImage
                                }
                                alt="Profile"
                                width={44}
                                height={44}
                                className="
                                    h-full
                                    w-full
                                    object-cover
                                "
                            />

                        ) : (

                            <span
                                className="
                                    text-sm
                                    font-bold
                                    text-white
                                    sm:text-base
                                    lg:text-lg
                                "
                            >
                                {user?.name
                                    ?.charAt(0)
                                    .toUpperCase()}
                            </span>

                        )}

                    </div>


                    {/* User Info */}

                    <div
                        className="
                            hidden
                            md:block
                        "
                    >

                        <h3
                            className="
                                font-semibold
                                text-gray-800
                            "
                        >
                            {user?.name ||
                                "Loading..."}
                        </h3>

                        <p
                            className="
                                text-xs
                                capitalize
                                text-gray-500
                            "
                        >
                            {user?.role || ""}
                        </p>

                    </div>

                </div>

            </div>

        </header>
    );
}