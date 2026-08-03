"use client";

import { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { toast } from "sonner";

export default function ChangePasswordPage() {
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [loading, setLoading] = useState(false);

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!currentPassword || !newPassword || !confirmPassword) {
            return toast.error("All fields are required.");
        }

        if (newPassword !== confirmPassword) {
            return toast.error("Passwords do not match.");
        }

        setLoading(true);

        try {
            const res = await fetch("/api/change-password", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    currentPassword,
                    newPassword,
                }),
            });

            const data = await res.json();

            if (data.success) {
                toast.success(data.message);

                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
            } else {
                toast.error(data.message);
            }
        } catch {
            toast.error("Something went wrong.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="mx-auto max-w-2xl">
            <form
                onSubmit={handleSubmit}
                className="rounded-3xl bg-white p-8 shadow-sm"
            >
                <h1 className="mb-8 text-3xl font-bold">
                    Change Password
                </h1>

                {/* Current */}

                <div className="mb-5">
                    <label className="mb-2 block font-medium">
                        Current Password
                    </label>

                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                        <input
                            type={showCurrent ? "text" : "password"}
                            value={currentPassword}
                            onChange={(e) =>
                                setCurrentPassword(e.target.value)
                            }
                            className="h-12 w-full rounded-xl border pl-12 pr-12"
                        />

                        <button
                            type="button"
                            onClick={() =>
                                setShowCurrent(!showCurrent)
                            }
                            className="absolute right-4 top-1/2 -translate-y-1/2"
                        >
                            {showCurrent ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                </div>

                {/* New */}

                <div className="mb-5">
                    <label className="mb-2 block font-medium">
                        New Password
                    </label>

                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                        <input
                            type={showNew ? "text" : "password"}
                            value={newPassword}
                            onChange={(e) =>
                                setNewPassword(e.target.value)
                            }
                            className="h-12 w-full rounded-xl border pl-12 pr-12"
                        />

                        <button
                            type="button"
                            onClick={() => setShowNew(!showNew)}
                            className="absolute right-4 top-1/2 -translate-y-1/2"
                        >
                            {showNew ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                </div>

                {/* Confirm */}

                <div className="mb-8">
                    <label className="mb-2 block font-medium">
                        Confirm Password
                    </label>

                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                        <input
                            type={showConfirm ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) =>
                                setConfirmPassword(e.target.value)
                            }
                            className="h-12 w-full rounded-xl border pl-12 pr-12"
                        />

                        <button
                            type="button"
                            onClick={() =>
                                setShowConfirm(!showConfirm)
                            }
                            className="absolute right-4 top-1/2 -translate-y-1/2"
                        >
                            {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                </div>

                <button
                    disabled={loading}
                    className="cursor-pointer w-full rounded-xl bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700"
                >
                    {loading ? "Updating..." : "Update Password"}
                </button>
            </form>
        </div>
    );
}