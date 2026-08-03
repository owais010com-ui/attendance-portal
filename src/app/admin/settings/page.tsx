"use client";

import { User, Building2, Lock, Clock, ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useState } from "react";


export default function SettingsPage() {

    const [openCard, setOpenCard] = useState("profile");
    const [adminName, setAdminName] = useState("");
    const [adminEmail, setAdminEmail] = useState("");
    const [adminPhone, setAdminPhone] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [companyEmail, setCompanyEmail] = useState("");
    const [companyAddress, setCompanyAddress] = useState("");
    const [officeStart, setOfficeStart] = useState("");
    const [officeEnd, setOfficeEnd] = useState("");
    const [lateAfter, setLateAfter] = useState(10);
    const [workingHours, setWorkingHours] = useState(8);

    useEffect(() => {
        async function getSettings() {
            try {
                const res = await fetch("/api/settings");
                const data = await res.json();

                if (data.success) {
                    setAdminName(data.settings.adminName);
                    setAdminEmail(data.settings.adminEmail);
                    setAdminPhone(data.settings.adminPhone);
                    setCompanyName(data.settings.companyName || "");
                    setCompanyEmail(data.settings.companyEmail || "");
                    setCompanyAddress(data.settings.companyAddress || "");
                    setOfficeStart(data.settings.officeStart || "09:00");
                    setOfficeEnd(data.settings.officeEnd || "18:00");
                    setLateAfter(data.settings.lateAfter || 10);
                    setWorkingHours(data.settings.workingHours || 8);

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
                alert("Profile Updated Successfully");
            }
        } catch (error) {
            console.log(error);
        }
    };
    const saveCompany = async () => {
        try {
            const res = await fetch("/api/settings", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    companyName,
                    companyEmail,
                    companyAddress,
                }),
            });

            const data = await res.json();

            if (data.success) {
                alert("Company Information Updated");
            }
        } catch (error) {
            console.log(error);
        }
    };
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
                    lateAfter,
                    workingHours,
                }),
            });

            const data = await res.json();

            if (data.success) {
                alert("Attendance Rules Updated");
            }
        } catch (error) {
            console.log(error);
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
                                className="h-11 rounded-xl bg-blue-600 px-5 text-sm font-medium text-white transition hover:bg-blue-700"
                            >
                                Save Changes
                            </button>

                        </div>

                    </div>

                </div>
                {/* Company */}

                <div className="rounded-2xl bg-white p-6 shadow">

                    {/* Header */}

                    <div
                        onClick={() =>
                            setOpenCard(openCard === "company" ? "" : "company")
                        }
                        className="flex cursor-pointer items-center justify-between"
                    >

                        <div className="flex items-center gap-3">

                            <div className="rounded-xl bg-green-100 p-3">
                                <Building2 className="text-green-600" size={22} />
                            </div>

                            <div>
                                <h2 className="text-xl font-semibold">
                                    Company Information
                                </h2>

                                <p className="text-sm text-gray-500">
                                    Manage company details
                                </p>
                            </div>

                        </div>

                        {openCard === "company" ? (
                            <ChevronUp size={22} className="text-gray-500" />
                        ) : (
                            <ChevronDown size={22} className="text-gray-500" />
                        )}

                    </div>

                    {/* Body */}

                    <div
                        className={`overflow-hidden transition-all duration-500 ease-in-out ${openCard === "company"
                            ? "max-h-137 opacity-100 mt-6"
                            : "max-h-0 opacity-0"
                            }`}
                    >

                        <div className="space-y-5">

                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Company Name
                                </label>

                                <input
                                    type="text"
                                    value={companyName}
                                    onChange={(e) => setCompanyName(e.target.value)}
                                    placeholder="Enter company name"
                                    className="h-11 w-full rounded-xl border border-gray-300 px-4 outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-100"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Company Email
                                </label>

                                <input
                                    type="email"
                                    value={companyEmail}
                                    onChange={(e) => setCompanyEmail(e.target.value)}
                                    placeholder="company@example.com"
                                    className="h-11 w-full rounded-xl border border-gray-300 px-4 outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-100"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Company Address
                                </label>

                                <textarea
                                    rows={3}
                                    value={companyAddress}
                                    onChange={(e) => setCompanyAddress(e.target.value)}
                                    placeholder="Enter company address"
                                    className="w-full rounded-xl border border-gray-300 p-4 outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-100"
                                />
                            </div>

                            <button
                                onClick={saveCompany}
                                className="h-11 rounded-xl bg-green-600 px-5 text-sm font-medium text-white transition hover:bg-green-700"
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
                                    placeholder="Enter current password"
                                    className="h-11 w-full rounded-xl border border-gray-300 px-4 outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    New Password
                                </label>

                                <input
                                    type="password"
                                    placeholder="Enter new password"
                                    className="h-11 w-full rounded-xl border border-gray-300 px-4 outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Confirm Password
                                </label>

                                <input
                                    type="password"
                                    placeholder="Confirm new password"
                                    className="h-11 w-full rounded-xl border border-gray-300 px-4 outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
                                />
                            </div>

                            <button className="h-11 rounded-xl bg-orange-600 px-5 text-sm font-medium text-white transition hover:bg-orange-700">
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
                                    Late After (Minutes)
                                </label>

                                <input
                                    type="number"
                                    value={lateAfter}
                                    onChange={(e) => setLateAfter(Number(e.target.value))}
                                    className="h-11 w-full rounded-xl border border-gray-300 px-4 outline-none transition focus:border-purple-500 focus:ring-4 focus:ring-purple-100"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Working Hours
                                </label>

                                <input
                                    type="number"
                                    value={workingHours}
                                    onChange={(e) => setWorkingHours(Number(e.target.value))}
                                    className="h-11 w-full rounded-xl border border-gray-300 px-4 outline-none transition focus:border-purple-500 focus:ring-4 focus:ring-purple-100"
                                />
                            </div>

                            <button
                                onClick={saveAttendanceRules}
                                className="h-11 rounded-xl bg-purple-600 px-5 text-sm font-medium text-white transition hover:bg-purple-700">
                                Save Rules
                            </button>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}
