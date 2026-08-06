
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "sonner";
import {
    Eye,
    EyeOff,
    Mail,
    Lock,
    ShieldCheck,
    Users,
    CalendarCheck,
    BarChart3,
    ArrowRight,
} from "lucide-react";

export default function LoginForm() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [remember, setRemember] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        try {
            setLoading(true);

            const { data } = await axios.post(
                "/api/auth/login",
                {
                    email,
                    password,
                }
            );

            toast.success(data.message);

            if (data.user.role === "admin") {
                router.replace("/admin/dashboard");
            } else {
                router.replace("/employee/dashboard");
            }

        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(
                    error.response?.data?.message ||
                    "Login Failed"
                );
            } else {
                toast.error("Something went wrong");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen overflow-hidden bg-gradient-to-br from-slate-100 via-white to-blue-50">

            <div className="grid min-h-screen lg:grid-cols-2">

                {/* LEFT PANEL */}

                <motion.div className="relative hidden overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 lg:flex" >

                    <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-white/10 blur-2xl"></div>

                    <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-white/10 blur-3xl"></div>

                    <div className="relative z-10 flex h-full w-full flex-col justify-between p-14 text-white">

                        <div>

                            <div className="flex items-center gap-4">

                                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-blue-700 shadow-xl">

                                    <ShieldCheck size={34} />

                                </div>

                                <div>

                                    <h1 className="text-3xl font-bold">
                                        Attendance Portal
                                    </h1>

                                    <p className="text-blue-100">
                                        Employee Management System
                                    </p>

                                </div>

                            </div>

                            <div className="mt-20">

                                <h2 className="text-5xl font-bold leading-tight">
                                    Welcome
                                </h2>

                                <p className="mt-4 max-w-lg text-xl  leading-9 text-blue-100">

                                    Manage employees, attendance,
                                    reports and daily check-ins
                                    from one modern dashboard.

                                </p>

                            </div>

                        </div>

                        <div className="space-y-4">

                            <div className="rounded-2xl bg-white/10 p-5 backdrop-blur">

                                <div className="flex items-center gap-4">

                                    <CalendarCheck size={34} />

                                    <div>

                                        <h3 className="text-lg font-semibold">
                                            Attendance Tracking
                                        </h3>

                                        <p className="text-blue-100">
                                            Smart daily attendance records.
                                        </p>

                                    </div>

                                </div>

                            </div>

                            <div className="rounded-2xl bg-white/10 p-5 backdrop-blur">

                                <div className="flex items-center gap-4">

                                    <BarChart3 size={34} />

                                    <div>

                                        <h3 className="text-lg font-semibold">
                                            Reports
                                        </h3>

                                        <p className="text-blue-100">
                                            Generate monthly attendance reports.
                                        </p>

                                    </div>

                                </div>

                            </div>
                            <p className="text-sm text-blue-100">
                                © 2026 Attendance Portal • Secure HR Management
                            </p>


                        </div>

                    </div>

                </motion.div>

                {/* RIGHT PANEL */}

                <motion.div
                    initial={{
                        opacity: 0,
                        scale: .95,
                        y: 15,
                    }}
                    animate={{
                        opacity: 1,
                        scale: 1,
                        y: 0,
                    }}
                    transition={{
                        duration: .6,
                        ease: "easeOut",
                    }}
                    className="flex items-center justify-center px-6 py-8 lg:px-12"
                >

                    <div className="w-full max-w-md rounded-[30px] border border-gray-200 bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,.12)]">

                        <div className="mb-6">


                            <h2 className="mt-5 text-4xl font-bold text-gray-900">
                                Welcome
                            </h2>

                            <p className="mt-2 text-gray-500">
                                Sign in to continue to your dashboard
                            </p>

                        </div>

                        <form
                            onSubmit={handleLogin}
                            className="space-y-5"
                        >

                            {/* EMAIL */}

                            <div >

                                <label className="mb-2 block text-sm font-semibold text-gray-700">
                                    Email Address
                                </label>

                                <div className="group flex h-14 items-center rounded-2xl border border-gray-200 bg-gray-50 px-4 transition-all focus-within:border-blue-600 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-100">

                                    <Mail
                                        size={20}
                                        className="text-gray-400 transition-colors group-focus-within:text-blue-600"
                                    />

                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        placeholder="admin@gmail.com"
                                        className="h-full w-full bg-transparent px-3 outline-none"
                                    />

                                </div>

                            </div>

                            {/* PASSWORD */}

                            <div>

                                <label className="mb-2 block text-sm font-semibold text-gray-700">
                                    Password
                                </label>

                                <div className="group flex h-14 items-center rounded-2xl border border-gray-200 bg-gray-50 px-4 transition-all focus-within:border-blue-600 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-100">

                                    <Lock
                                        size={20}
                                        className="text-gray-400 transition-colors group-focus-within:text-blue-600"
                                    />

                                    <input
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        placeholder="********"
                                        className="h-full w-full bg-transparent px-3 outline-none"
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(
                                                !showPassword
                                            )
                                        }
                                    >
                                        {showPassword ? (
                                            <EyeOff
                                                size={20}
                                                className="text-gray-500"
                                            />
                                        ) : (
                                            <Eye
                                                size={20}
                                                className="text-gray-500"
                                            />
                                        )}
                                    </button>

                                </div>

                            </div>

                            <div className="flex items-center justify-between">

                                <label className="flex items-center gap-2 text-sm text-gray-600">

                                    <input
                                        type="checkbox"
                                        checked={remember}
                                        onChange={(e) =>
                                            setRemember(
                                                e.target.checked
                                            )
                                        }
                                    />

                                    Remember Me

                                </label>

                                <button
                                    type="button"
                                    className="text-sm font-medium text-blue-600 hover:underline"
                                >
                                    Forgot Password?
                                </button>

                            </div>

                            <motion.button
                                disabled={loading}
                                type="submit"
                                className="cursor-pointer flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl"
                            >
                                {loading ? (
                                    <>
                                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                        Signing In...
                                    </>
                                ) : (
                                    <>
                                        Sign In
                                        <ArrowRight size={18} />
                                    </>
                                )}
                            </motion.button>

                        </form>

                        <div className="my-8 flex items-center">

                            <div className="h-px flex-1 bg-gray-200"></div>

                            <span className="px-4 text-sm text-gray-400">
                                Attendance Portal
                            </span>

                            <div className="h-px flex-1 bg-gray-200"></div>

                        </div>

                        <p className="mt-8 text-center text-sm text-gray-400">
                            © 2026 Attendance Portal. All rights reserved.
                        </p>

                    </div>

                </motion.div>

            </div>

        </main>
    );
}



{/* <div className="rounded-xl bg-blue-50 p-4 text-center">
                            <ShieldCheck
                                size={28}
                                className="mx-auto mb-2 text-blue-600"
                            />

                            <h3 className="font-semibold text-gray-800">
                                Secure Login
                            </h3>

                            <p className="mt-1 text-sm text-gray-500">
                                Protected & encrypted authentication.
                            </p>
                        </div> */}