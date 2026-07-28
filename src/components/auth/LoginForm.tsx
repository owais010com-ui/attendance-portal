"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";

export default function LoginForm() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setLoading(true);

            const { data } = await axios.post("/api/auth/login", {
                email,
                password,
            });

            toast.success(data.message);

            if (data.user.role === "admin") {
                router.push("/admin/dashboard");
            } else {
                router.push("/employee/dashboard");
            }
        } catch (error: any) {
            toast.error(
                error.response?.data?.message || "Login Failed"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen flex items-center justify-center bg-black px-4">
            <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl">

                <h1 className="text-3xl font-bold text-white text-center">
                    Attendance Portal
                </h1>

                <p className="text-zinc-400 text-center mt-2">
                    Sign in to continue
                </p>

                <form onSubmit={handleLogin} className="mt-8 space-y-5">

                    <div>
                        <label className="text-sm text-zinc-300">
                            Email
                        </label>

                        <input
                            type="email"
                            placeholder="admin@gmail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-2 w-full rounded-lg bg-zinc-800 border border-zinc-700 px-4 py-3 text-white outline-none focus:border-purple-500"
                        />
                    </div>

                    <div>
                        <label className="text-sm text-zinc-300">
                            Password
                        </label>

                        <input
                            type="password"
                            placeholder="********"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-2 w-full rounded-lg bg-zinc-800 border border-zinc-700 px-4 py-3 text-white outline-none focus:border-purple-500"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-purple-600 hover:bg-purple-700 transition py-3 text-white font-semibold disabled:opacity-50"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>

                </form>
            </div>
        </main>
    );
}