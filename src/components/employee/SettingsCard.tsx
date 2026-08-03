"use client";

import {
    User,
    Lock,
    Globe,
    Moon,
    LogOut,
    ChevronRight,
} from "lucide-react";

const settings = [
    {
        title: "Account Information",
        description: "View and update your profile.",
        icon: User,
    },
    {
        title: "Change Password",
        description: "Update your account password.",
        icon: Lock,
    },
    {
        title: "Language",
        description: "English",
        icon: Globe,
    },
    {
        title: "Dark Mode",
        description: "Coming Soon",
        icon: Moon,
    },
];

export default function SettingsCard() {
    return (
        <div className="space-y-6">

            <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">

                <div className="border-b px-6 py-5">

                    <h2 className="text-2xl font-bold text-gray-800">
                        Settings
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        Manage your account settings
                    </p>

                </div>

                <div className="divide-y">

                    {settings.map((item) => {

                        const Icon = item.icon;

                        return (

                            <button
                                key={item.title}
                                className="flex w-full items-center justify-between p-6 transition hover:bg-gray-50"
                            >

                                <div className="flex items-center gap-4">

                                    <div className="rounded-xl bg-blue-50 p-3 text-blue-600">

                                        <Icon size={22} />

                                    </div>

                                    <div className="text-left">

                                        <h3 className="font-semibold text-gray-800">
                                            {item.title}
                                        </h3>

                                        <p className="text-sm text-gray-500">
                                            {item.description}
                                        </p>

                                    </div>

                                </div>

                                <ChevronRight className="text-gray-400" />

                            </button>

                        );

                    })}

                </div>

            </div>

            <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-600 py-4 font-semibold text-white transition hover:bg-red-700">

                <LogOut size={20} />

                Logout

            </button>

        </div>
    );
}