"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

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

type CameraMode = "user" | "environment";

export default function EmployeeAttendancePage() {

    /* =========================
       States
    ========================= */

    const [pageLoading, setPageLoading] =
        useState(true);

    const [loading, setLoading] =
        useState(false);

    const [cameraLoading, setCameraLoading] =
        useState(false);

    const [cameraActive, setCameraActive] =
        useState(false);

    const [cameraMode, setCameraMode] =
        useState<CameraMode>("user");

    const [latitude, setLatitude] =
        useState<number | null>(null);

    const [longitude, setLongitude] =
        useState<number | null>(null);

    const [locationLink, setLocationLink] =
        useState("");

    const [capturedImage, setCapturedImage] =
        useState("");

    const [captured, setCaptured] =
        useState(false);

    const [attendanceHistory, setAttendanceHistory] =
        useState<Attendance[]>([]);

    const [user, setUser] =
        useState<User | null>(null);

    const [attendanceAllowed, setAttendanceAllowed] =
        useState(false);

    const [officeStart, setOfficeStart] =
        useState("09:00");

    const [officeEnd, setOfficeEnd] =
        useState("18:00");

    const videoRef =
        useRef<HTMLVideoElement>(null);

    const canvasRef =
        useRef<HTMLCanvasElement>(null);


    /* =========================
       Convert Image To Blob
    ========================= */

    function dataURLtoBlob(dataUrl: string) {

        const arr = dataUrl.split(",");

        const mime =
            arr[0].match(/:(.*?);/)?.[1] ||
            "image/jpeg";

        const bstr = atob(arr[1]);

        let n = bstr.length;

        const u8arr = new Uint8Array(n);

        while (n--) {
            u8arr[n] =
                bstr.charCodeAt(n);
        }

        return new Blob(
            [u8arr],
            {
                type: mime,
            }
        );
    }


    /* =========================
       Pakistan Current Time
    ========================= */

    function getPakistanTimeInMinutes() {

        const parts =
            new Intl.DateTimeFormat(
                "en-GB",
                {
                    timeZone: "Asia/Karachi",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                }
            ).formatToParts(new Date());

        const hour =
            Number(
                parts.find(
                    (part) =>
                        part.type === "hour"
                )?.value || 0
            );

        const minute =
            Number(
                parts.find(
                    (part) =>
                        part.type === "minute"
                )?.value || 0
            );

        return hour * 60 + minute;
    }


    /* =========================
       HH:mm -> Minutes
    ========================= */

    function timeToMinutes(time: string) {

        const [hour, minute] =
            time.split(":").map(Number);

        return hour * 60 + minute;
    }


    /* =========================
       Check Attendance Time
    ========================= */

    function checkAttendanceTime(
        startTime: string,
        endTime: string
    ) {

        const currentMinutes =
            getPakistanTimeInMinutes();

        const startMinutes =
            timeToMinutes(startTime);

        const endMinutes =
            timeToMinutes(endTime);

        // Normal timing
        // 09:00 -> 18:00
        if (endMinutes > startMinutes) {

            return (
                currentMinutes >= startMinutes &&
                currentMinutes < endMinutes
            );
        }

        // Overnight timing
        // 21:00 -> 01:00
        return (
            currentMinutes >= startMinutes ||
            currentMinutes < endMinutes
        );
    }


    /* =========================
       Stop Camera
    ========================= */

    function stopCamera() {

        const video =
            videoRef.current;

        if (!video) {
            return;
        }

        const stream =
            video.srcObject as
            | MediaStream
            | null;

        if (stream) {

            stream
                .getTracks()
                .forEach((track) => {
                    track.stop();
                });
        }

        video.srcObject = null;

        setCameraActive(false);
    }


    /* =========================
       Start Camera
    ========================= */

    async function startCamera(
        mode: CameraMode = cameraMode
    ) {

        if (!attendanceAllowed) {

            toast.error(
                `Attendance is available only between ${officeStart} and ${officeEnd}.`
            );

            return;
        }

        if (
            !navigator.mediaDevices ||
            !navigator.mediaDevices.getUserMedia
        ) {

            toast.error(
                "Camera is not supported by this browser."
            );

            return;
        }

        try {

            setCameraLoading(true);

            stopCamera();

            const stream =
                await navigator.mediaDevices.getUserMedia(
                    {
                        video: {
                            facingMode: {
                                ideal: mode,
                            },
                            width: {
                                ideal: 1280,
                            },
                            height: {
                                ideal: 720,
                            },
                        },
                        audio: false,
                    }
                );

            if (!videoRef.current) {

                stream
                    .getTracks()
                    .forEach(
                        (track) =>
                            track.stop()
                    );

                return;
            }

            videoRef.current.srcObject =
                stream;

            await videoRef.current.play();

            setCameraMode(mode);

            setCameraActive(true);

        } catch (error) {

            console.log(
                "Camera Error:",
                error
            );

            toast.error(
                "Unable to access camera. Please allow camera permission."
            );

            setCameraActive(false);

        } finally {

            setCameraLoading(false);
        }
    }


    /* =========================
       Switch Front / Back Camera
    ========================= */

    async function switchCamera() {

        if (!cameraActive) {
            return;
        }

        const newMode: CameraMode =
            cameraMode === "user"
                ? "environment"
                : "user";

        await startCamera(newMode);
    }


    /* =========================
       Get Attendance Settings
    ========================= */

    async function getAttendanceSettings() {

        try {

            const res =
                await fetch(
                    "/api/settings",
                    {
                        cache: "no-store",
                    }
                );

            const data =
                await res.json();

            if (!data.success) {

                setAttendanceAllowed(false);

                return false;
            }

            const start =
                data.settings.officeStart ||
                "09:00";

            const end =
                data.settings.officeEnd ||
                "18:00";

            setOfficeStart(start);

            setOfficeEnd(end);

            const allowed =
                checkAttendanceTime(
                    start,
                    end
                );

            setAttendanceAllowed(
                allowed
            );

            if (!allowed) {

                stopCamera();

                setCaptured(false);

                setCapturedImage("");
            }

            return allowed;

        } catch (error) {

            console.log(
                "Settings Error:",
                error
            );

            setAttendanceAllowed(false);

            return false;
        }
    }


    /* =========================
       Get Employee History
    ========================= */

    async function getAttendanceHistory(
        employeeId: string
    ) {

        try {

            const now =
                new Date();

            const month =
                now.getMonth() + 1;

            const year =
                now.getFullYear();

            const res =
                await fetch(
                    `/api/attendance/monthly?month=${month}&year=${year}`,
                    {
                        cache: "no-store",
                    }
                );

            const data =
                await res.json();

            if (data.success) {

                const employeeAttendance =
                    data.attendance.filter(
                        (item: Attendance) =>
                            item.employeeId ===
                            employeeId
                    );

                setAttendanceHistory(
                    employeeAttendance
                );
            }

        } catch (error) {

            console.log(
                "History Error:",
                error
            );

            toast.error(
                "Unable to load attendance history."
            );
        }
    }


    /* =========================
       Upload Image
    ========================= */

    async function handleImageUpload() {

        if (!capturedImage) {
            throw new Error(
                "No image captured."
            );
        }

        const blob =
            dataURLtoBlob(
                capturedImage
            );

        const formData =
            new FormData();

        formData.append(
            "file",
            blob
        );

        formData.append(
            "upload_preset",
            "employ-image"
        );

        setLoading(true);

        try {

            const res =
                await fetch(
                    "https://api.cloudinary.com/v1_1/dpcvy4xll/image/upload",
                    {
                        method: "POST",
                        body: formData,
                    }
                );

            const data =
                await res.json();

            if (data.secure_url) {

                return data.secure_url;
            }

            throw new Error(
                "Upload Failed"
            );

        } finally {

            setLoading(false);
        }
    }


    /* =========================
       Capture Photo
    ========================= */

    function capturePhoto() {

        if (!attendanceAllowed) {

            toast.error(
                `Attendance is available only between ${officeStart} and ${officeEnd}.`
            );

            return;
        }

        if (!cameraActive) {

            toast.error(
                "Please start the camera first."
            );

            return;
        }

        const video =
            videoRef.current;

        const canvas =
            canvasRef.current;

        if (!video || !canvas) {

            toast.error(
                "Camera is not ready."
            );

            return;
        }

        if (
            video.readyState < 2 ||
            !video.videoWidth ||
            !video.videoHeight
        ) {

            toast.error(
                "Camera is still starting. Please try again."
            );

            return;
        }

        canvas.width =
            video.videoWidth;

        canvas.height =
            video.videoHeight;

        const ctx =
            canvas.getContext("2d");

        if (!ctx) {

            toast.error(
                "Unable to capture photo."
            );

            return;
        }

        ctx.drawImage(
            video,
            0,
            0,
            canvas.width,
            canvas.height
        );

        const image =
            canvas.toDataURL(
                "image/jpeg",
                0.9
            );

        setCapturedImage(image);

        setCaptured(true);

        stopCamera();

        toast.success(
            "Photo captured successfully."
        );
    }


    /* =========================
       Retake Photo
    ========================= */

    async function retakePhoto() {

        setCaptured(false);

        setCapturedImage("");

        setCameraActive(false);

        await startCamera(cameraMode);
    }


    /* =========================
       Load Page
    ========================= */

    useEffect(() => {

        let mounted = true;

        async function loadPage() {

            try {

                setPageLoading(true);

                const res =
                    await fetch(
                        "/api/auth/me",
                        {
                            cache: "no-store",
                        }
                    );

                const data =
                    await res.json();

                if (!mounted) {
                    return;
                }

                if (!data.success) {

                    toast.error(
                        "Unable to load user information."
                    );

                    return;
                }

                setUser(data.user);

                await getAttendanceHistory(
                    data.user.employeeId
                );

                await getAttendanceSettings();

            } catch (error) {

                console.log(error);

                toast.error(
                    "Unable to load attendance page."
                );

            } finally {

                if (mounted) {
                    setPageLoading(false);
                }
            }
        }

        loadPage();

        return () => {

            mounted = false;

            stopCamera();
        };

    }, []);


    /* =========================
       Monitor Office Time
       Every 30 Seconds
    ========================= */

    useEffect(() => {

        const interval =
            setInterval(() => {

                const allowed =
                    checkAttendanceTime(
                        officeStart,
                        officeEnd
                    );

                setAttendanceAllowed(
                    allowed
                );

                if (!allowed) {

                    stopCamera();

                    setCaptured(false);

                    setCapturedImage("");
                }

            }, 30000);

        return () => {

            clearInterval(
                interval
            );
        };

    }, [
        officeStart,
        officeEnd,
    ]);


    /* =========================
       Mark Attendance
    ========================= */

    async function handleAttendance() {

        if (!attendanceAllowed) {

            toast.error(
                `Attendance is available only between ${officeStart} and ${officeEnd}.`
            );

            return;
        }

        if (!user) {

            toast.error(
                "User data is loading."
            );

            return;
        }

        if (!captured || !capturedImage) {

            toast.error(
                "Please capture your photo first."
            );

            return;
        }

        if (!navigator.geolocation) {

            toast.error(
                "Geolocation is not supported."
            );

            return;
        }

        setLoading(true);

        toast.loading(
            "Getting your location...",
            {
                id: "attendance-location",
            }
        );

        navigator.geolocation.getCurrentPosition(

            async (position) => {

                try {

                    const lat =
                        position.coords.latitude;

                    const lng =
                        position.coords.longitude;

                    setLatitude(lat);

                    setLongitude(lng);

                    const mapLink =
                        `https://www.google.com/maps?q=${lat},${lng}`;

                    setLocationLink(
                        mapLink
                    );

                    toast.loading(
                        "Uploading photo...",
                        {
                            id: "attendance-location",
                        }
                    );

                    const uploadedImage =
                        await handleImageUpload();

                    const attendanceData = {

                        employeeId:
                            user.employeeId,

                        employeeName:
                            user.name,

                        email:
                            user.email,

                        photo:
                            uploadedImage,

                        latitude:
                            lat,

                        longitude:
                            lng,

                        locationLink:
                            mapLink,
                    };

                    toast.loading(
                        "Marking attendance...",
                        {
                            id: "attendance-location",
                        }
                    );

                    const res =
                        await fetch(
                            "/api/attendance",
                            {
                                method: "POST",

                                headers: {
                                    "Content-Type":
                                        "application/json",
                                },

                                body:
                                    JSON.stringify(
                                        attendanceData
                                    ),
                            }
                        );

                    const data =
                        await res.json();

                    if (data.success) {

                        toast.success(
                            "Attendance marked successfully ✅",
                            {
                                id: "attendance-location",
                            }
                        );

                        stopCamera();

                        setCaptured(false);

                        setCapturedImage("");

                        await getAttendanceHistory(
                            user.employeeId
                        );

                    } else {

                        toast.error(
                            data.message ||
                            "Unable to mark attendance.",
                            {
                                id: "attendance-location",
                            }
                        );
                    }

                } catch (error) {

                    console.log(error);

                    toast.error(
                        "Something went wrong while marking attendance.",
                        {
                            id: "attendance-location",
                        }
                    );

                } finally {

                    setLoading(false);
                }
            },

            (error) => {

                console.log(
                    "Location Error:",
                    error
                );

                setLoading(false);

                toast.error(
                    "Please allow location access.",
                    {
                        id: "attendance-location",
                    }
                );
            },

            {
                enableHighAccuracy: true,
                timeout: 15000,
                maximumAge: 0,
            }
        );
    }


    /* =========================
       Loading UI
    ========================= */

    if (pageLoading) {

        return (

            <div className="space-y-6 animate-pulse">

                <div className="h-[520px] rounded-3xl bg-gray-200" />

                <div className="grid gap-4 md:grid-cols-2">

                    <div className="h-28 rounded-2xl bg-gray-200" />

                    <div className="h-28 rounded-2xl bg-gray-200" />

                </div>

                <div className="h-14 rounded-2xl bg-gray-200" />

                <div className="rounded-3xl border bg-white p-6">

                    <div className="mb-6 h-8 w-56 rounded bg-gray-200" />

                    {[...Array(5)].map(
                        (_, index) => (

                            <div
                                key={index}
                                className="mb-4 h-16 rounded-xl bg-gray-200"
                            />

                        )
                    )}

                </div>

            </div>
        );
    }


    /* =========================
       Page
    ========================= */

    return (

        <div className="min-h-screen bg-slate-50 p-3 sm:p-5 lg:p-6">

            <div className="mx-auto max-w-6xl space-y-6">

                {attendanceAllowed ? (

                    <>

                        <CameraSection

                            captured={
                                captured
                            }

                            capturedImage={
                                capturedImage
                            }

                            videoRef={
                                videoRef
                            }

                            canvasRef={
                                canvasRef
                            }

                            cameraActive={
                                cameraActive
                            }

                            cameraLoading={
                                cameraLoading
                            }

                            cameraMode={
                                cameraMode
                            }

                            capturePhoto={
                                capturePhoto
                            }

                            retakePhoto={
                                retakePhoto
                            }

                            startCamera={
                                startCamera
                            }

                            switchCamera={
                                switchCamera
                            }
                        />


                        <AttendanceInfo

                            latitude={
                                latitude
                            }

                            longitude={
                                longitude
                            }

                            locationLink={
                                locationLink
                            }

                            loading={
                                loading
                            }

                            handleAttendance={
                                handleAttendance
                            }
                        />

                    </>

                ) : (

                    <div className="rounded-3xl border bg-white p-8 text-center shadow-sm sm:p-12">

                        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100 text-4xl">
                            🔒
                        </div>

                        <h1 className="mt-6 text-2xl font-bold text-slate-900 sm:text-3xl">
                            Attendance Closed
                        </h1>

                        <p className="mx-auto mt-3 max-w-lg text-slate-500">

                            Attendance can only be
                            marked between{" "}

                            <span className="font-semibold text-slate-800">
                                {officeStart}
                            </span>

                            {" "}and{" "}

                            <span className="font-semibold text-slate-800">
                                {officeEnd}
                            </span>

                            .

                        </p>

                        <p className="mt-2 text-sm text-red-500">
                            Camera and location
                            access are currently
                            disabled.
                        </p>

                    </div>
                )}


                <AttendanceHistory
                    attendanceHistory={
                        attendanceHistory
                    }
                />

            </div>

        </div>
    );
}