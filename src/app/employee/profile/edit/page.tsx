"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Camera } from "lucide-react";
import Image from "next/image";
interface User {
    name: string;
    email: string;
    employeeId: string;
    role: string;
    phone: string;
    address: string;
    profileImage: string;
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
        profileImage: "",
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

    async function handleImageChange(
        e: React.ChangeEvent<HTMLInputElement>
    ) {

        const file = e.target.files?.[0];

        if (!file) return;

        const formData = new FormData();

        formData.append("file", file);

        formData.append("upload_preset", "employ-image");

        try {

            setSaving(true);

            const res = await fetch(
                "https://api.cloudinary.com/v1_1/dpcvy4xll/image/upload",
                {
                    method: "POST",
                    body: formData,
                }
            );

            const data = await res.json();

            if (data.secure_url) {

                setForm((prev) => ({
                    ...prev,
                    profileImage: data.secure_url,
                }));

                toast.success("Profile image uploaded");

            }

        } catch {

            toast.error("Image upload failed");

        } finally {

            setSaving(false);

        }

    }

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
                profileImage: form.profileImage,
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

            <div className="mx-auto max-w-3xl animate-pulse">

                <div className="rounded-3xl bg-white p-8 shadow-sm">

                    {/* Avatar */}

                    <div className="flex flex-col items-center">

                        <div className="h-28 w-28 rounded-full bg-gray-200"></div>

                        <div className="mt-5 h-8 w-48 rounded bg-gray-200"></div>

                    </div>

                    {/* Form */}

                    <div className="mt-10 space-y-6">

                        {[1, 2, 3, 4, 5, 6].map((item) => (

                            <div key={item}>

                                <div className="mb-2 h-4 w-32 rounded bg-gray-200"></div>

                                <div className="h-12 w-full rounded-xl bg-gray-200"></div>

                            </div>

                        ))}

                    </div>

                    {/* Button */}

                    <div className="mt-8 h-12 w-full rounded-xl bg-gray-200"></div>

                </div>

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

                    <div className="relative">

                        <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-blue-600">

                            {form.profileImage ? (

                                <Image
                                    src={form.profileImage}
                                    alt="Profile"
                                    width={112}
                                    height={112}
                                    className="h-28 w-28 rounded-full object-cover"
                                />

                            ) : (

                                <span className="text-5xl font-bold text-white">

                                    {form.name.charAt(0).toUpperCase()}

                                </span>

                            )}

                        </div>

                        <label
                            htmlFor="profile-image"
                            className="absolute bottom-0 right-0 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-blue-600 text-white shadow-lg hover:bg-blue-700"
                        >

                            <Camera size={18} />

                        </label>

                        <input
                            id="profile-image"
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={handleImageChange}
                        />

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