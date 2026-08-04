"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import ProfileInfo from "@/components/employee/ProfileInfo";
import AccountCard from "@/components/employee/AccountCard";
import LogoutModal from "@/components/employee/LogoutModal";
import ProfileHeader from "@/components/employee/ProfileHeader";



interface UserData {
    name: string;
    email: string;
    employeeId: string;
    role: string;
    isActive: boolean;
    createdAt: string;
}

export default function ProfilePage() {

    const router = useRouter();

    const [user, setUser] = useState<UserData | null>(null);

    const [loading, setLoading] = useState(true);

    const [logoutModal, setLogoutModal] = useState(false);

    const [logoutLoading, setLogoutLoading] = useState(false);

    useEffect(() => {
        async function getUser() {
            try {
                const res = await fetch("/api/auth/me", {
                    cache: "no-store",
                });

                const data = await res.json();

                if (data.success) {
                    setUser(data.user);
                }
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        }

        getUser();
    }, []);

    async function handleLogout() {

        setLogoutLoading(true);

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

        } finally {

            setLogoutLoading(false);

            setLogoutModal(false);

        }
    }

    if (loading) {

        return (

            <div className="space-y-8 animate-pulse">

                {/* Profile Header */}

                <div className="overflow-hidden rounded-3xl border bg-white">

                    <div className="h-52 bg-gray-200"></div>

                    <div className="px-8 pb-8">

                        <div className="-mt-16 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">

                            <div className="flex items-end gap-5">

                                <div className="h-32 w-32 rounded-full border-8 border-white bg-gray-200"></div>

                                <div className="space-y-3 pb-3">

                                    <div className="h-8 w-52 rounded bg-gray-200"></div>

                                    <div className="flex gap-3">

                                        <div className="h-8 w-24 rounded-full bg-gray-200"></div>

                                        <div className="h-8 w-24 rounded-full bg-gray-200"></div>

                                        <div className="h-8 w-24 rounded-full bg-gray-200"></div>

                                    </div>

                                </div>

                            </div>

                            <div className="h-12 w-40 rounded-xl bg-gray-200"></div>

                        </div>

                    </div>

                </div>

                {/* Profile Info */}

                <div className="grid gap-6 lg:grid-cols-2">

                    {[1, 2].map((item) => (

                        <div
                            key={item}
                            className="rounded-2xl border bg-white p-6"
                        >

                            <div className="mb-6 h-6 w-40 rounded bg-gray-200"></div>

                            <div className="space-y-5">

                                {[1, 2, 3, 4].map((i) => (

                                    <div
                                        key={i}
                                        className="flex items-center gap-4"
                                    >

                                        <div className="h-12 w-12 rounded-xl bg-gray-200"></div>

                                        <div className="flex-1 space-y-2">

                                            <div className="h-4 w-24 rounded bg-gray-200"></div>

                                            <div className="h-5 w-40 rounded bg-gray-200"></div>

                                        </div>

                                    </div>

                                ))}

                            </div>

                        </div>

                    ))}

                </div>

                {/* Account Card */}

                <div className="rounded-2xl border bg-white p-6">

                    <div className="mb-6 h-7 w-52 rounded bg-gray-200"></div>

                    <div className="grid gap-6 md:grid-cols-2">

                        {[1, 2].map((item) => (

                            <div
                                key={item}
                                className="flex gap-4"
                            >

                                <div className="h-12 w-12 rounded-xl bg-gray-200"></div>

                                <div className="flex-1 space-y-2">

                                    <div className="h-4 w-28 rounded bg-gray-200"></div>

                                    <div className="h-5 w-40 rounded bg-gray-200"></div>

                                </div>

                            </div>

                        ))}

                    </div>

                    <div className="mt-8 flex justify-end">

                        <div className="h-12 w-36 rounded-xl bg-gray-200"></div>

                    </div>

                </div>

            </div>

        );

    }

    if (!user) {
        return (
            <div className="text-center text-red-600">
                User not found
            </div>
        );
    }

    return (
        <>
            <div className="space-y-8">

                <ProfileHeader user={user} />

                <ProfileInfo user={user} />

                <AccountCard
                    user={user}
                    onLogout={() => setLogoutModal(true)}
                />

            </div>

            <LogoutModal
                isOpen={logoutModal}
                onClose={() => setLogoutModal(false)}
                onConfirm={handleLogout}
                loading={logoutLoading}
            />
        </>
    );
}