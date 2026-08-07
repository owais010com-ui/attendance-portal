"use client";

import { User, Lock, Clock, ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function SettingsPage() {

    const [openCard, setOpenCard] = useState("profile");
    const [adminName, setAdminName] = useState("");
    const [adminEmail, setAdminEmail] = useState("");
    const [adminPhone, setAdminPhone] = useState("");
    const [officeStart, setOfficeStart] = useState("");
    const [officeEnd, setOfficeEnd] = useState("");
    const [lateAfterHours, setLateAfterHours] = useState(0);
    const [lateAfterMinutes, setLateAfterMinutes] = useState(10);
    const [workingHours, setWorkingHours] = useState(8);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    // const [companyName, setCompanyName] = useState("");
    // const [companyEmail, setCompanyEmail] = useState("");
    // const [companyAddress, setCompanyAddress] = useState("");

    useEffect(() => {
        async function getSettings() {
            try {
                const res = await fetch("/api/settings");
                const data = await res.json();
                const totalLateMinutes = data.settings.lateAfter || 10;

                if (data.success) {
                    setAdminName(data.settings.adminName);
                    setAdminEmail(data.settings.adminEmail);
                    setAdminPhone(data.settings.adminPhone);
                    setOfficeStart(data.settings.officeStart || "09:00");
                    setOfficeEnd(data.settings.officeEnd || "18:00");
                    setLateAfterHours(Math.floor(totalLateMinutes / 60));
                    setLateAfterMinutes(totalLateMinutes % 60);
                    setWorkingHours(data.settings.workingHours || 8);
                    // setCompanyName(data.settings.companyName || "");
                    // setCompanyEmail(data.settings.companyEmail || "");
                    // setCompanyAddress(data.settings.companyAddress || "");

                }
            } catch (error) {
                console.log(error);
            }
        }

        getSettings();
    }, []);


    const saveProfile = async () => {
        try {
            const res = await fetch("/api/settings", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    adminName,
                    adminEmail,
                    adminPhone,
                }),
            });

            const data = await res.json();

            if (data.success) {
                toast.success("Profile Updated Successfully");
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
        }
    };
    // const saveCompany = async () => {
    //     try {
    //         const res = await fetch("/api/settings", {
    //             method: "PUT",
    //             headers: {
    //                 "Content-Type": "application/json",
    //             },
    //             body: JSON.stringify({
    //                 companyName,
    //                 companyEmail,
    //                 companyAddress,
    //             }),
    //         });

    //         const data = await res.json();

    //         if (data.success) {
    //             alert("Company Information Updated");
    //         }
    //     } catch (error) {
    //         console.log(error);
    //         toast.error("Something went wrong");
    //     }
    // };
    const saveAttendanceRules = async () => {
        try {
            const res = await fetch("/api/settings", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    officeStart,
                    officeEnd,
                    lateAfter:
                        lateAfterHours * 60 + lateAfterMinutes,
                    workingHours,
                }),
            });

            const data = await res.json();

            if (data.success) {
                toast.success("Attendance Rules Updated");
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
        }
    };

    const updatePassword = async () => {

        if (!currentPassword || !newPassword || !confirmPassword) {
            return toast.error("All fields are required");
        }

        if (newPassword !== confirmPassword) {
            return toast.error("Passwords do not match");
        }

        const res = await fetch("/api/settings/password", {
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
    };

    return (
        <div className="space-y-6">

            <div className="space-y-6">

                {/* Profile */}

                <div className="rounded-2xl bg-white p-6 shadow">

                    {/* Header */}

                    <div
                        onClick={() =>
                            setOpenCard(openCard === "profile" ? "" : "profile")
                        }
                        className="flex cursor-pointer items-center justify-between"
                    >

                        <div className="flex items-center gap-3">

                            <div className="rounded-xl bg-blue-100 p-3">
                                <User className="text-blue-600" size={22} />
                            </div>

                            <div>
                                <h2 className="text-xl font-semibold">
                                    Admin Profile
                                </h2>

                                <p className="text-sm text-gray-500">
                                    Update your personal information
                                </p>
                            </div>

                        </div>

                        {openCard === "profile" ? (
                            <ChevronUp size={22} className="text-gray-500" />
                        ) : (
                            <ChevronDown size={22} className="text-gray-500" />
                        )}

                    </div>

                    {/* Body */}

                    <div
                        className={`overflow-hidden transition-all duration-500 ease-in-out ${openCard === "profile"
                            ? "max-h-125 opacity-100 mt-6"
                            : "max-h-0 opacity-0"
                            }`}
                    >

                        <div className="space-y-5">

                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Full Name
                                </label>

                                <input
                                    type="text"
                                    value={adminName}
                                    onChange={(e) => setAdminName(e.target.value)}
                                    placeholder="Enter full name"
                                    className="h-11 w-full rounded-xl border border-gray-300 px-4 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Email
                                </label>

                                <input
                                    type="email"
                                    value={adminEmail}
                                    onChange={(e) => setAdminEmail(e.target.value)}
                                    placeholder="Enter email"
                                    className="h-11 w-full rounded-xl border border-gray-300 px-4 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Phone Number
                                </label>

                                <input
                                    type="tel"
                                    value={adminPhone}
                                    onChange={(e) => setAdminPhone(e.target.value)}
                                    placeholder="03XXXXXXXXX"
                                    className="h-11 w-full rounded-xl border border-gray-300 px-4 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                                />
                            </div>

                            <button
                                onClick={saveProfile}
                                className="cursor-pointer h-11 rounded-xl bg-blue-600 px-5 text-sm font-medium text-white transition hover:bg-blue-700"
                            >
                                Save Changes
                            </button>

                        </div>

                    </div>

                </div>

                {/* Password */}

                <div className="rounded-2xl bg-white p-6 shadow">

                    {/* Header */}

                    <div
                        onClick={() =>
                            setOpenCard(openCard === "password" ? "" : "password")
                        }
                        className="flex cursor-pointer items-center justify-between"
                    >

                        <div className="flex items-center gap-3">

                            <div className="rounded-xl bg-orange-100 p-3">
                                <Lock className="text-orange-600" size={22} />
                            </div>

                            <div>
                                <h2 className="text-xl font-semibold">
                                    Change Password
                                </h2>

                                <p className="text-sm text-gray-500">
                                    Keep your account secure
                                </p>
                            </div>

                        </div>

                        {openCard === "password" ? (
                            <ChevronUp size={22} className="text-gray-500" />
                        ) : (
                            <ChevronDown size={22} className="text-gray-500" />
                        )}

                    </div>

                    {/* Body */}

                    <div
                        className={`overflow-hidden transition-all duration-500 ease-in-out ${openCard === "password"
                            ? "max-h-screen opacity-100 mt-6"
                            : "max-h-0 opacity-0"
                            }`}
                    >

                        <div className="space-y-5">

                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Current Password
                                </label>

                                <input
                                    type="password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    placeholder="Enter current password"
                                    className="h-11 w-full rounded-xl border border-gray-300 px-4"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    New Password
                                </label>

                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Enter new password"
                                    className="h-11 w-full rounded-xl border border-gray-300 px-4"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Confirm Password
                                </label>

                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirm new password"
                                    className="h-11 w-full rounded-xl border border-gray-300 px-4"
                                />
                            </div>

                            <button
                                onClick={updatePassword}
                                className="cursor-pointer h-11 rounded-xl bg-orange-600 px-5 text-white"
                            >
                                Update Password
                            </button>

                        </div>

                    </div>

                </div>

                {/* Attendance Rules */}

                <div className="rounded-2xl bg-white p-6 shadow">

                    {/* Header */}

                    <div
                        onClick={() =>
                            setOpenCard(openCard === "attendance" ? "" : "attendance")
                        }
                        className="flex cursor-pointer items-center justify-between"
                    >

                        <div className="flex items-center gap-3">

                            <div className="rounded-xl bg-purple-100 p-3">
                                <Clock className="text-purple-600" size={22} />
                            </div>

                            <div>
                                <h2 className="text-xl font-semibold">
                                    Attendance Rules
                                </h2>

                                <p className="text-sm text-gray-500">
                                    Configure attendance timings
                                </p>
                            </div>

                        </div>

                        {openCard === "attendance" ? (
                            <ChevronUp size={22} className="text-gray-500" />
                        ) : (
                            <ChevronDown size={22} className="text-gray-500" />
                        )}

                    </div>

                    {/* Body */}

                    <div
                        className={`overflow-hidden transition-all duration-500 ease-in-out ${openCard === "attendance"
                            ? "max-h-screen opacity-100 mt-6"
                            : "max-h-0 opacity-0"
                            }`}
                    >

                        <div className="space-y-5">

                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Office Start Time
                                </label>

                                <input
                                    type="time"
                                    value={officeStart}
                                    onChange={(e) => setOfficeStart(e.target.value)}
                                    className="h-11 w-full rounded-xl border border-gray-300 px-4 outline-none transition focus:border-purple-500 focus:ring-4 focus:ring-purple-100"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Office End Time
                                </label>

                                <input
                                    type="time"
                                    value={officeEnd}
                                    onChange={(e) => setOfficeEnd(e.target.value)}
                                    className="h-11 w-full rounded-xl border border-gray-300 px-4 outline-none transition focus:border-purple-500 focus:ring-4 focus:ring-purple-100"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Late After
                                </label>

                                <div className="grid grid-cols-2 gap-4">

                                    <div>
                                        <label className="mb-2 block text-xs text-gray-500">
                                            Hours
                                        </label>

                                        <input
                                            type="number"
                                            min="0"
                                            value={lateAfterHours}
                                            onChange={(e) =>
                                                setLateAfterHours(
                                                    Number(e.target.value)
                                                )
                                            }
                                            placeholder="0"
                                            className="h-11 w-full rounded-xl border border-gray-300 px-4 outline-none transition focus:border-purple-500 focus:ring-4 focus:ring-purple-100"
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-xs text-gray-500">
                                            Minutes
                                        </label>

                                        <input
                                            type="number"
                                            min="0"
                                            max="59"
                                            value={lateAfterMinutes}
                                            onChange={(e) =>
                                                setLateAfterMinutes(
                                                    Number(e.target.value)
                                                )
                                            }
                                            placeholder="0"
                                            className="h-11 w-full rounded-xl border border-gray-300 px-4 outline-none transition focus:border-purple-500 focus:ring-4 focus:ring-purple-100"
                                        />
                                    </div>

                                </div>

                                <p className="mt-1 text-xs text-gray-500">
                                    Example: 1 hour 30 minutes
                                </p>
                            </div>

                            <button
                                onClick={saveAttendanceRules}
                                className="cursor-pointer h-11 rounded-xl bg-purple-600 px-5 text-sm font-medium text-white transition hover:bg-purple-700">
                                Save Rules
                            </button>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}
