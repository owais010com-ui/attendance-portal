"use client";

import { Clock, MapPin } from "lucide-react";

interface AttendanceInfoProps {
    latitude: number | null;
    longitude: number | null;
    locationLink: string;
    loading: boolean;
    handleAttendance: () => void;
}

export default function AttendanceInfo({
    latitude,
    longitude,
    locationLink,
    loading,
    handleAttendance,
}: AttendanceInfoProps) {

    return (
        <div className="mt-6 rounded-3xl border bg-white p-5 shadow-sm sm:p-8">

            <h2 className="text-xl font-bold text-slate-800">
                Attendance Details
            </h2>

            <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">

                <div className="flex items-start gap-4 rounded-2xl border p-5">

                    <div className="rounded-xl bg-blue-100 p-3">
                        <Clock className="text-blue-600" />
                    </div>

                    <div>

                        <p className="text-sm text-gray-500">
                            Current Time
                        </p>

                        <h3 className="mt-1 text-lg font-semibold text-slate-800">
                            {new Date().toLocaleTimeString()}
                        </h3>

                    </div>

                </div>

                <div className="flex items-start gap-4 rounded-2xl border p-5">

                    <div className="rounded-xl bg-red-100 p-3">
                        <MapPin className="text-red-600" />
                    </div>

                    <div className="flex-1">

                        <p className="text-sm text-gray-500">
                            Current Location
                        </p>

                        {latitude && longitude ? (

                            <>

                                <h3 className="mt-1 font-semibold text-green-600">
                                    Location Detected
                                </h3>

                                <p className="text-sm text-gray-500">
                                    {latitude.toFixed(5)}, {longitude.toFixed(5)}
                                </p>

                                <a
                                    href={locationLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-2 inline-block text-sm font-medium text-blue-600 hover:underline"
                                >
                                    View on Google Maps
                                </a>

                            </>

                        ) : (

                            <p className="mt-1 text-gray-500">
                                Location not captured
                            </p>

                        )}

                    </div>

                </div>

            </div>

            <button
                onClick={handleAttendance}
                disabled={loading}
                className="mt-8 h-14 w-full cursor-pointer rounded-2xl bg-blue-600 text-lg font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
            >
                {loading ? "Uploading..." : "Mark Attendance"}
            </button>

        </div>
    );
}