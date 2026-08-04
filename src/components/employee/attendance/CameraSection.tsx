"use client";

import Image from "next/image";

interface CameraSectionProps {
    captured: boolean;
    capturedImage: string;
    videoRef: React.RefObject<HTMLVideoElement | null>;
    canvasRef: React.RefObject<HTMLCanvasElement | null>;
    capturePhoto: () => void;
    retakePhoto: () => void;
}

export default function CameraSection({
    captured,
    capturedImage,
    videoRef,
    canvasRef,
    capturePhoto,
    retakePhoto,
}: CameraSectionProps) {
    return (
        <div className="rounded-3xl border bg-white p-5 shadow-sm sm:p-8">

            <div>

                <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                    Mark Attendance
                </h1>

                <p className="mt-2 text-sm text-slate-500 sm:text-base">
                    Capture your live photo before marking todays attendance.
                </p>

            </div>

            <div className="mt-8 overflow-hidden rounded-2xl border bg-slate-100">

                {!captured ? (

                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="h-64 w-full object-cover sm:h-80 lg:h-96"
                    />

                ) : (

                    <Image
                        src={capturedImage}
                        alt="Captured"
                        width={900}
                        height={700}
                        className="h-64 w-full object-cover sm:h-80 lg:h-96"
                    />

                )}

            </div>

            <canvas
                ref={canvasRef}
                className="hidden"
            />

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">

                {!captured ? (

                    <button
                        onClick={capturePhoto}
                        className="w-full cursor-pointer rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 sm:w-auto"
                    >
                        📸 Capture Photo
                    </button>

                ) : (

                    <button
                        onClick={retakePhoto}
                        className="w-full cursor-pointer rounded-xl bg-slate-700 px-6 py-3 font-semibold text-white transition hover:bg-slate-800 sm:w-auto"
                    >
                        🔄 Retake Photo
                    </button>

                )}

            </div>

        </div>
    );
}