import { ReactNode } from "react";

interface StatCardProps {
    title: string;
    value: number;
    icon: ReactNode;
    color: string;
}

export default function StatCard({
    title,
    value,
    icon,
    color,
}: StatCardProps) {
    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 shadow-sm transition hover:shadow-md">

            <div className="flex items-center justify-between">

                <div>

                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                        {value}
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        {title}
                    </p>

                </div>

                <div
                    className={`flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-xl ${color}`}
                >
                    {icon}
                </div>

            </div>

        </div>
    );
}