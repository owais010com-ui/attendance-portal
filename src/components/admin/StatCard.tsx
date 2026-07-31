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
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300">

            <div className="flex items-start justify-between">

                <div>
                    <h2 className="text-3xl font-medium text-gray-900">
                        {value}
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        {title}
                    </p>
                </div>

                <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl ${color}shadow-lg transition-all duration-300`}
                >
                    {icon}
                </div>

            </div>

        </div>
    );
}