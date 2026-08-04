"use client";

import { useEffect, useRef, useState } from "react";

import CameraSection from "@/components/employee/attendance/CameraSection";
import AttendanceInfo from "@/components/employee/attendance/AttendanceInfo";
import AttendanceHistory from "@/components/employee/attendance/AttendanceHistory";

interface Attendance {
    _id: string;
    employeeId: string;
    employeeName: string;
    email: string;
    photo: string;
    locationLink: string;
    date: string;
    checkIn: string;
    status: string;
}

interface User {
    employeeId: string;
    name: string;
    email: string;
}

export default function EmployeeAttendancePage() {
    const [pageLoading, setPageLoading] = useState(true);

    const [loading, setLoading] = useState(false);

    const [imageUrl, setImageUrl] = useState("");

    const [latitude, setLatitude] = useState<number | null>(null);

    const [longitude, setLongitude] = useState<number | null>(null);

    const [locationLink, setLocationLink] = useState("");

    const [capturedImage, setCapturedImage] = useState("");

    const [captured, setCaptured] = useState(false);

    const [attendanceHistory, setAttendanceHistory] = useState<Attendance[]>([]);

    const [user, setUser] = useState<User | null>(null);

    const videoRef = useRef<HTMLVideoElement>(null);

    const canvasRef = useRef<HTMLCanvasElement>(null);

    function dataURLtoBlob(dataUrl: string) {

        const arr = dataUrl.split(",");

        const mime = arr[0].match(/:(.*?);/)![1];

        const bstr = atob(arr[1]);

        let n = bstr.length;

        const u8arr = new Uint8Array(n);

        while (n--) {

            u8arr[n] = bstr.charCodeAt(n);

        }

        return new Blob([u8arr], {
            type: mime,
        });

    }

    async function getAttendanceHistory(employeeId: string) {

        try {

            const res = await fetch("/api/attendance", {
                cache: "no-store",
            });

            const data = await res.json();

            if (data.success) {

                setAttendanceHistory(

                    data.attendance.filter(
                        (item: Attendance) =>
                            item.employeeId === employeeId
                    )

                );

            }

        } catch (error) {

            console.log(error);

        }

    }

    async function handleImageUpload() {

        const blob = dataURLtoBlob(capturedImage);

        const formData = new FormData();

        formData.append("file", blob);

        formData.append("upload_preset", "employ-image");

        setLoading(true);

        try {

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

            throw new Error("Upload Failed");

        } finally {

            setLoading(false);

        }

    }

    async function startCamera() {

        try {

            const stream = await navigator.mediaDevices.getUserMedia({

                video: {
                    facingMode: "user",
                },

            });

            if (videoRef.current) {

                videoRef.current.srcObject = stream;

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

        const stream = video.srcObject as MediaStream;

        stream?.getTracks().forEach(track => track.stop());

    }

    async function retakePhoto() {

        setCaptured(false);

        setCapturedImage("");

        await startCamera();

    }

    useEffect(() => {

        async function loadPage() {

            try {

                setPageLoading(true);

                await startCamera();

                const res = await fetch("/api/auth/me", {
                    cache: "no-store",
                });

                const data = await res.json();

                if (data.success) {

                    setUser(data.user);

                    await getAttendanceHistory(data.user.employeeId);

                }

            } catch (error) {

                console.log(error);

            } finally {

                setPageLoading(false);

            }

        }

        loadPage();

        return () => {

            const stream = videoRef.current?.srcObject as MediaStream | null;

            stream?.getTracks().forEach(track => track.stop());

        };

    }, []);


    async function handleAttendance() {

        if (!user) {
            alert("User data is loading.");
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

                    setLatitude(lat);
                    setLongitude(lng);

                    const mapLink = `https://www.google.com/maps?q=${lat},${lng}`;

                    setLocationLink(mapLink);

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

                        await getAttendanceHistory(user.employeeId);

                    } else {

                        alert(data.message);

                    }

                } catch (error) {

                    console.log(error);

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

    if (pageLoading) {

        return (

            <div className="space-y-6 animate-pulse">

                <div className="h-[520px] rounded-3xl bg-gray-200"></div>

                <div className="grid gap-4 md:grid-cols-2">

                    <div className="h-28 rounded-2xl bg-gray-200"></div>

                    <div className="h-28 rounded-2xl bg-gray-200"></div>

                </div>

                <div className="h-14 rounded-2xl bg-gray-200"></div>

                <div className="rounded-3xl border bg-white p-6">

                    <div className="mb-6 h-8 w-56 rounded bg-gray-200"></div>

                    {[...Array(5)].map((_, index) => (

                        <div
                            key={index}
                            className="mb-4 h-16 rounded-xl bg-gray-200"
                        />

                    ))}

                </div>

            </div>

        );

    }

    return (

        <div className="min-h-screen bg-slate-50 p-3 sm:p-5 lg:p-6">

            <div className="mx-auto max-w-6xl space-y-6">

                <CameraSection
                    captured={captured}
                    capturedImage={capturedImage}
                    videoRef={videoRef}
                    canvasRef={canvasRef}
                    capturePhoto={capturePhoto}
                    retakePhoto={retakePhoto}
                />

                <AttendanceInfo
                    latitude={latitude}
                    longitude={longitude}
                    locationLink={locationLink}
                    loading={loading}
                    handleAttendance={handleAttendance}
                />

                <AttendanceHistory
                    attendanceHistory={attendanceHistory}
                />

            </div>

        </div>

    );

}
