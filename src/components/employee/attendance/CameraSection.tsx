"use client";

import Image from "next/image";
import {
    Camera,
    RotateCcw,
    RefreshCw,
} from "lucide-react";

type CameraMode = "user" | "environment";

interface CameraSectionProps {

    captured: boolean;

    capturedImage: string;

    videoRef:
    React.RefObject<HTMLVideoElement | null>;

    canvasRef:
    React.RefObject<HTMLCanvasElement | null>;

    cameraActive: boolean;

    cameraLoading: boolean;

    cameraMode: CameraMode;

    capturePhoto: () => void;

    retakePhoto: () => void;

    startCamera: (
        mode?: CameraMode
    ) => Promise<void>;

    switchCamera: () => Promise<void>;
}

export default function CameraSection({

    captured,

    capturedImage,

    videoRef,

    canvasRef,

    cameraActive,

    cameraLoading,

    cameraMode,

    capturePhoto,

    retakePhoto,

    startCamera,

    switchCamera,

}: CameraSectionProps) {

    return (

        <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">

            {/* Header */}

            <div>

                <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                    Mark Attendance
                </h1>

                <p className="mt-1 text-sm text-slate-500 sm:text-base">
                    Capture your live photo before marking today attendance.
                </p>

            </div>


            {/* Camera */}

            <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">

                {!captured ? (

                    <div>

                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            className={`h-64 w-full object-cover sm:h-80 lg:h-[450px] ${cameraActive
                                    ? "block"
                                    : "hidden"
                                }`}
                        />


                        {!cameraActive && (

                            <div className="flex min-h-[260px] flex-col items-center justify-center px-6 py-10 text-center sm:min-h-[320px]">

                                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 text-blue-600">

                                    <Camera size={38} />

                                </div>

                                <h2 className="mt-5 text-lg font-bold text-slate-800">
                                    Camera Ready
                                </h2>

                                <p className="mt-2 max-w-md text-sm text-slate-500">
                                    Click the button below to start your camera and preview your attendance photo.
                                </p>

                            </div>
                        )}

                    </div>

                ) : (

                    <Image
                        src={capturedImage}
                        alt="Captured attendance photo"
                        width={900}
                        height={700}
                        priority
                        className="h-64 w-full object-cover sm:h-80 lg:h-[450px]"
                    />

                )}

            </div>


            {/* Hidden Canvas */}

            <canvas
                ref={canvasRef}
                className="hidden"
            />


            {/* Buttons */}

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">

                {!captured ? (

                    <>

                        {!cameraActive ? (

                            <button
                                onClick={() =>
                                    startCamera(
                                        cameraMode
                                    )
                                }
                                disabled={
                                    cameraLoading
                                }
                                type="button"
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                            >

                                <Camera size={20} />

                                {cameraLoading
                                    ? "Starting Camera..."
                                    : "Start Camera"}

                            </button>

                        ) : (

                            <>

                                <button
                                    onClick={
                                        capturePhoto
                                    }
                                    type="button"
                                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 active:scale-[0.98] sm:w-auto"
                                >

                                    <Camera size={20} />

                                    Capture Photo

                                </button>


                                <button
                                    onClick={
                                        switchCamera
                                    }
                                    disabled={
                                        cameraLoading
                                    }
                                    type="button"
                                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-700 px-6 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60 sm:w-auto"
                                >

                                    <RefreshCw
                                        size={19}
                                    />

                                    {cameraMode === "user"
                                        ? "Back Camera"
                                        : "Front Camera"}

                                </button>

                            </>

                        )}

                    </>

                ) : (

                    <button
                        onClick={
                            retakePhoto
                        }
                        type="button"
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-700 px-6 py-3 font-semibold text-white transition hover:bg-slate-800 active:scale-[0.98] sm:w-auto"
                    >

                        <RotateCcw
                            size={20}
                        />

                        Retake Photo

                    </button>

                )}

            </div>

        </div>
    );
}