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
            <div className="flex h-[70vh] items-center justify-center">
                <div className="text-lg font-semibold">
                    Loading...
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