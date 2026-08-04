"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
interface User {
    name: string;
    email: string;
    employeeId: string;
    role: string;
    phone: string;
    address: string;
}

export default function EditProfilePage() {

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [form, setForm] = useState<User>({
        name: "",
        email: "",
        employeeId: "",
        role: "",
        phone: "",
        address: "",
    });
    useEffect(() => {

        async function getUser() {

            const res = await fetch("/api/auth/me", {
                cache: "no-store",
            });

            const data = await res.json();

            if (data.success) {
                setForm(data.user);
            }

            setLoading(false);
        }

        getUser();

    }, []);

    async function handleSubmit(
        e: React.FormEvent
    ) {
        e.preventDefault();

        setSaving(true);

        const res = await fetch("/api/profile", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: form.name,
                email: form.email,
                phone: form.phone,
                address: form.address,
            }),
        });

        const data = await res.json();

        setSaving(false);

        if (data.success) {

            toast.success(data.message);

            setTimeout(() => {
                window.location.href = "/employee/profile";
            }, 1000);

        } else {

            toast.error(data.message);

        }
    }

    if (loading) {
        return (
            <div className="rounded-3xl bg-white p-10 text-center">
                Loading...
            </div>
        );
    }

    return (

        <div className="mx-auto max-w-3xl">

            <form
                onSubmit={handleSubmit}
                className="rounded-3xl bg-white p-8 shadow-sm"
            >

                <div className="flex flex-col items-center">

                    <div className="flex h-28 w-28 items-center justify-center rounded-full bg-blue-600 text-5xl font-bold text-white">
                        {form.name.charAt(0).toUpperCase()}
                    </div>

                    <h2 className="mt-5 text-3xl font-bold">
                        Edit Profile
                    </h2>

                </div>

                <div className="mt-10 grid gap-6">

                    <div>

                        <label className="mb-2 block font-medium">
                            Full Name
                        </label>

                        <input
                            type="text"
                            value={form.name}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    name: e.target.value,
                                })
                            }
                            className="h-12 w-full rounded-xl border px-4 outline-none focus:border-blue-600"
                        />

                    </div>

                    <div>

                        <label className="mb-2 block font-medium">
                            Email
                        </label>

                        <input
                            type="email"
                            value={form.email}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    email: e.target.value,
                                })
                            }
                            className="h-12 w-full rounded-xl border px-4 outline-none focus:border-blue-600"
                        />

                    </div>
                    <div>

                        <label className="mb-2 block font-medium">
                            Phone Number
                        </label>

                        <input
                            type="text"
                            value={form.phone}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    phone: e.target.value,
                                })
                            }
                            placeholder="+92 300 1234567"
                            className="h-12 w-full rounded-xl border px-4 outline-none focus:border-blue-600"
                        />

                    </div>
                    <div>

                        <label className="mb-2 block font-medium">
                            Address
                        </label>

                        <input
                            type="text"
                            value={form.address}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    address: e.target.value,
                                })
                            }
                            placeholder="Karachi, Pakistan"
                            className="h-12 w-full rounded-xl border px-4 outline-none focus:border-blue-600"
                        />

                    </div>

                    <div>

                        <label className="mb-2 block font-medium">
                            Employee ID
                        </label>

                        <input
                            disabled
                            value={form.employeeId}
                            className="h-12 w-full rounded-xl border bg-gray-100 px-4"
                        />

                    </div>

                    <div>

                        <label className="mb-2 block font-medium">
                            Role
                        </label>

                        <input
                            disabled
                            value={form.role}
                            className="h-12 w-full rounded-xl border bg-gray-100 px-4 capitalize"
                        />

                    </div>

                </div>

                <button
                    disabled={saving}
                    className="cursor-pointer mt-8 w-full rounded-xl bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700"
                >
                    {saving ? "Saving..." : "Save Changes"}
                </button>

            </form>

        </div>

    );
}