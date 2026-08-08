"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
    Settings,
    LogOut,
    ChevronDown,
} from "lucide-react";
import Image from "next/image";

export default function Header() {

    const [admin, setAdmin] = useState({
        name: "Admin",
        email: "",
        phone: "",
        profileImage: "",
    });

    const [open, setOpen] = useState(false);

    const pathname = usePathname();
    const router = useRouter();

    const menuRef =
        useRef<HTMLDivElement>(null);


    /* =========================
       Get Admin
    ========================= */

    useEffect(() => {

        async function getAdmin() {

            try {

                const res =
                    await fetch(
                        "/api/settings",
                        {
                            cache: "no-store",
                        }
                    );

                const data =
                    await res.json();

                if (data.success) {

                    setAdmin({
                        name:
                            data.settings
                                .adminName ||
                            "Admin",

                        email:
                            data.settings
                                .adminEmail ||
                            "",

                        phone:
                            data.settings
                                .adminPhone ||
                            "",

                        profileImage: "",
                    });
                }

            } catch (error) {

                console.log(error);
            }
        }

        getAdmin();

    }, []);


    /* =========================
       Page Titles
    ========================= */

    const titles: Record<string, string> = {

        "/admin/dashboard":
            "Dashboard",

        "/admin/employees":
            "Employees",

        "/admin/attendance":
            "Attendance",

        "/admin/reports":
            "Reports",

        "/admin/settings":
            "Settings",

    };


    /* =========================
       Close Dropdown
    ========================= */

    useEffect(() => {

        function handleClickOutside(
            event: MouseEvent
        ) {

            if (
                menuRef.current &&
                !menuRef.current.contains(
                    event.target as Node
                )
            ) {

                setOpen(false);
            }
        }

        document.addEventListener(
            "mousedown",
            handleClickOutside
        );

        return () =>
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );

    }, []);


    const title =
        titles[pathname] ||
        "Admin";


    return (

        <header
            className="
                sticky
                top-0
                z-30
                flex
                h-14
                items-center
                justify-between
                border-b
                border-gray-200
                bg-white
                px-3
                sm:h-16
                sm:px-5
                md:h-20
                md:px-8
            "
        >

            {/* =========================
                Left
            ========================= */}

            <div>

                <h1
                    className="
                        text-lg
                        font-bold
                        text-gray-800
                        sm:text-xl
                        md:text-2xl
                    "
                >
                    {title}
                </h1>

                <p
                    className="
                        hidden
                        text-sm
                        text-gray-500
                        md:block
                    "
                >
                    Welcome back, Admin
                </p>

            </div>


            {/* =========================
                Right
            ========================= */}

            <div
                className="
                    relative
                    flex
                    items-center
                "
                ref={menuRef}
            >

                <button
                    onClick={() =>
                        setOpen(!open)
                    }
                    className="
                        flex
                        items-center
                        gap-1.5
                        rounded-xl
                        p-1
                        transition
                        hover:bg-gray-100
                        sm:gap-2
                        sm:p-1.5
                        md:gap-3
                        md:p-2
                    "
                >

                    {/* Profile */}

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
                            font-semibold
                            text-white
                            sm:h-10
                            sm:w-10
                            md:h-10
                            md:w-10
                        "
                    >

                        {admin.profileImage ? (

                            <Image
                                src={
                                    admin.profileImage
                                }
                                alt={
                                    admin.name
                                }
                                width={40}
                                height={40}
                                className="
                                    h-full
                                    w-full
                                    object-cover
                                "
                            />

                        ) : (

                            admin.name
                                .charAt(0)
                                .toUpperCase()

                        )}

                    </div>


                    {/* Admin Info */}

                    <div
                        className="
                            hidden
                            text-left
                            md:block
                        "
                    >

                        <h2
                            className="
                                text-sm
                                font-semibold
                                text-gray-800
                            "
                        >
                            {admin.name}
                        </h2>

                        <p
                            className="
                                text-xs
                                text-gray-500
                            "
                        >
                            {admin.email}
                        </p>

                    </div>


                    {/* Arrow */}

                    <ChevronDown
                        size={17}
                        className={`
                            hidden
                            transition
                            md:block
                            ${
                                open
                                    ? "rotate-180"
                                    : ""
                            }
                        `}
                    />

                </button>


                {/* =========================
                    Dropdown
                ========================= */}

                {open && (

                    <div
                        className="
                            absolute
                            right-0
                            top-12
                            w-52
                            overflow-hidden
                            rounded-2xl
                            border
                            bg-white
                            shadow-xl
                            sm:top-14
                            sm:w-56
                        "
                    >

                        <div
                            className="
                                border-b
                                p-3
                                sm:p-4
                            "
                        >

                            <div
                                className="
                                    flex
                                    items-center
                                    gap-3
                                "
                            >

                                <div
                                    className="
                                        flex
                                        h-10
                                        w-10
                                        shrink-0
                                        items-center
                                        justify-center
                                        rounded-full
                                        bg-blue-600
                                        text-base
                                        font-bold
                                        text-white
                                    "
                                >
                                    {admin.name
                                        .charAt(0)
                                        .toUpperCase()}
                                </div>

                                <div>

                                    <h3
                                        className="
                                            font-semibold
                                            text-gray-800
                                        "
                                    >
                                        {admin.name}
                                    </h3>

                                    <p
                                        className="
                                            text-xs
                                            text-gray-500
                                        "
                                    >
                                        Administrator
                                    </p>

                                </div>

                            </div>

                        </div>


                        {/* Settings */}

                        <button
                            onClick={() => {

                                router.push(
                                    "/admin/settings"
                                );

                                setOpen(false);
                            }}
                            className="
                                flex
                                w-full
                                items-center
                                gap-3
                                px-4
                                py-2.5
                                text-left
                                text-sm
                                transition
                                hover:bg-gray-100
                            "
                        >

                            <Settings
                                size={17}
                            />

                            Settings

                        </button>


                        {/* Logout */}

                        <button
                            onClick={async () => {

                                await fetch(
                                    "/api/auth/logout",
                                    {
                                        method:
                                            "POST",
                                    }
                                );

                                router.replace(
                                    "/login"
                                );
                            }}
                            className="
                                flex
                                w-full
                                items-center
                                gap-3
                                px-4
                                py-2.5
                                text-left
                                text-sm
                                text-red-600
                                transition
                                hover:bg-red-50
                            "
                        >

                            <LogOut
                                size={17}
                            />

                            Logout

                        </button>

                    </div>

                )}

            </div>

        </header>
    );
}