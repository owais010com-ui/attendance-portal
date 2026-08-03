"use client";

import { MapPin, Clock } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import Image from "next/image";

export default function EmployeeAttendancePage() {

    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState("");
    const [latitude, setLatitude] = useState<number | null>(null);
    const [longitude, setLongitude] = useState<number | null>(null);
    const [locationLink, setLocationLink] = useState("");
    const [capturedImage, setCapturedImage] = useState("");
    const [captured, setCaptured] = useState(false);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    interface User {
        employeeId: string;
        name: string;
        email: string;
    }

    const [user, setUser] = useState<User | null>(null);



    function dataURLtoBlob(dataUrl: string) {
        const arr = dataUrl.split(",");
        const mime = arr[0].match(/:(.*?);/)![1];

        const bstr = atob(arr[1]);
        let n = bstr.length;

        const u8arr = new Uint8Array(n);

        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }

        return new Blob([u8arr], { type: mime });
    }

    async function handleImageUpload() {
        const blob = dataURLtoBlob(capturedImage);

        const formData = new FormData();

        formData.append("file", blob);
        formData.append("upload_preset", "employ-image");

        try {
            setLoading(true);

            const res = await fetch(
                "https://api.cloudinary.com/v1_1/dpcvy4xll/image/upload",
                {
                    method: "POST",
                    body: formData,
                }
            );

            const data = await res.json();

            if (data.secure_url) {
                setImageUrl(data.secure_url);
                return data.secure_url;
            }

            throw new Error("Upload failed");
        } finally {
            setLoading(false);
        }
    }
    async function startCamera() {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: "user",
                },
            });

            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
        } catch (error) {
            console.log(error);
            alert("Unable to access camera.");
        }
    }
    function capturePhoto() {
        if (!videoRef.current || !canvasRef.current) return;

        const video = videoRef.current;
        const canvas = canvasRef.current;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const ctx = canvas.getContext("2d");

        if (!ctx) return;

        ctx.drawImage(video, 0, 0);

        const image = canvas.toDataURL("image/jpeg");

        setCapturedImage(image);
        setCaptured(true);

        const mediaStream = videoRef.current?.srcObject as MediaStream;

        mediaStream?.getTracks().forEach(track => track.stop());
    }
    async function retakePhoto() {
        setCaptured(false);
        setCapturedImage("");

        await startCamera();
    }

    useEffect(() => {

        async function getCurrentUser() {
            try {
                const res = await fetch("/api/auth/me", {
                    cache: "no-store",
                });

                const data = await res.json();

                if (data.success) {
                    setUser(data.user);
                }

            } catch (error) {
                console.log(error);
            }
        }

        startCamera();

        getCurrentUser();

        const videoElement = videoRef.current;

        return () => {
            const mediaStream = videoElement?.srcObject as MediaStream | null;

            if (mediaStream) {
                mediaStream.getTracks().forEach((track) => track.stop());
            }
        };

    }, []);

    async function handleAttendance() {

        if (!user) {
            alert("User data is loading. Please try again.");
            return;
        }

        if (!captured) {
            alert("Please capture your photo.");
            return;
        }

        if (!navigator.geolocation) {
            alert("Geolocation is not supported.");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;

                    console.log("Latitude:", lat);
                    console.log("Longitude:", lng);
                    console.log("Accuracy:", position.coords.accuracy);

                    setLatitude(lat);
                    setLongitude(lng);

                    const mapLink = `https://www.google.com/maps?q=${lat},${lng}`;
                    setLocationLink(mapLink);

                    console.log("Google Maps:", mapLink);

                    const uploadedImage = await handleImageUpload();

                    const attendanceData = {
                        employeeId: user.employeeId,
                        employeeName: user.name,
                        email: user.email,

                        photo: uploadedImage,

                        latitude: lat,
                        longitude: lng,
                        locationLink: mapLink,

                        checkIn: new Date().toLocaleTimeString(),
                        date: new Date().toLocaleDateString("en-CA"),
                    };

                    const res = await fetch("/api/attendance", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(attendanceData),
                    });

                    const data = await res.json();

                    if (data.success) {
                        alert("Attendance Marked Successfully ✅");
                    } else {
                        alert(data.message);
                    }

                } catch (error) {
                    console.error(error);
                    alert("Something went wrong.");
                }
            },
            () => {
                alert("Please allow location access.");
            },
            {
                enableHighAccuracy: true,
                timeout: 15000,
                maximumAge: 0,
            }
        );
    }


    return (
        <div className="min-h-screen bg-slate-50 p-6">

            <div className="mx-auto max-w-2xl">

                <div className="rounded-3xl bg-white p-8 shadow-sm border">

                    <h1 className="text-3xl font-bold text-gray-900">
                        Mark Attendance
                    </h1>

                    <p className="mt-2 text-gray-500">
                        Upload your photo and mark today attendance.
                    </p>

                    {/* Upload */}

                    <div className="mt-8">

                        <label className="mb-3 block text-sm font-semibold text-gray-700">
                            Employee Photo
                        </label>

                        <div className="overflow-hidden rounded-2xl border">

                            {!captured ? (
                                <video
                                    ref={videoRef}
                                    autoPlay
                                    playsInline
                                    muted
                                    className="h-96 w-full object-cover"
                                />
                            ) : (
                                <Image
                                    src={capturedImage}
                                    alt="Captured"
                                    width={800}
                                    height={500}
                                    className="h-96 w-full object-cover"
                                />
                            )}

                        </div>

                        <canvas
                            ref={canvasRef}
                            className="hidden"
                        />
                        <div className="mt-5 flex justify-center gap-3">

                            {!captured ? (
                                <button
                                    onClick={capturePhoto}
                                    className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
                                >
                                    📸 Capture
                                </button>
                            ) : (
                                <button
                                    onClick={retakePhoto}
                                    className="rounded-xl bg-gray-700 px-6 py-3 font-semibold text-white hover:bg-gray-800"
                                >
                                    🔄 Retake
                                </button>
                            )}

                        </div>

                        {imageUrl && (
                            <Image
                                src={imageUrl}
                                alt="Employee"
                                width={160}
                                height={160}
                                className="mt-4 rounded-xl border object-cover"
                            />
                        )}
                    </div>

                    {/* Info */}

                    <div className="mt-8 grid gap-4 md:grid-cols-2">

                        <div className="flex items-center gap-3 rounded-xl border p-4">

                            <Clock className="text-blue-600" />

                            <div>

                                <p className="text-sm text-gray-500">
                                    Current Time
                                </p>

                                <p className="font-semibold">
                                    Auto Detect
                                </p>

                            </div>

                        </div>

                        <div className="flex items-center gap-3 rounded-xl border p-4">

                            <MapPin className="text-red-500" />
                            <div>
                                <p className="text-sm text-gray-500">Location</p>

                                {latitude && longitude ? (
                                    <>
                                        <p className="font-semibold text-green-600">
                                            Location Detected
                                        </p>

                                        <p className="text-xs text-gray-500">
                                            {latitude.toFixed(5)}, {longitude.toFixed(5)}
                                        </p>

                                        <a
                                            href={locationLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="mt-2 inline-block text-sm font-medium text-blue-600 hover:underline"
                                        >
                                            📍 View on Google Maps
                                        </a>
                                    </>
                                ) : (
                                    <p className="font-semibold text-gray-500">
                                        Location not captured
                                    </p>
                                )}
                            </div>

                        </div>

                    </div>

                    <button
                        onClick={handleAttendance}
                        disabled={loading}
                        className="mt-8 w-full cursor-pointer rounded-2xl bg-blue-600 py-4 text-lg font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading ? "Uploading..." : "Mark Attendance"}
                    </button>

                </div>

            </div>

        </div>
    );
}
