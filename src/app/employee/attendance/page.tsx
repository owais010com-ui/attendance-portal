"use client";

import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

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
        // Example: 09:00 -> 18:00
        if (endMinutes > startMinutes) {

            return (
                currentMinutes >= startMinutes &&
                currentMinutes < endMinutes
            );
        }

        // Overnight timing
        // Example: 21:00 -> 01:00
        return (
            currentMinutes >= startMinutes ||
            currentMinutes < endMinutes
        );
    }

    /* =========================
       Stop Camera
    ========================= */

    function stopCamera() {

        const stream =
            videoRef.current
                ?.srcObject as
            | MediaStream
            | null;

        if (stream) {

            stream
                .getTracks()
                .forEach(
                    (track) => {
                        track.stop();
                    }
                );
        }

        if (videoRef.current) {
            videoRef.current.srcObject =
                null;
        }
    }

    /* =========================
       Start Camera
       Hidden Camera
    ========================= */

    async function startCamera() {

        if (!attendanceAllowed) {
            return;
        }

        try {

            stopCamera();

            const stream =
                await navigator.mediaDevices.getUserMedia(
                    {
                        video: {
                            facingMode: "user",
                        },
                    }
                );

            if (videoRef.current) {

                videoRef.current.srcObject =
                    stream;

                /*
                 * Wait until camera actually
                 * has video dimensions.
                 */
                await new Promise<void>(
                    (resolve) => {

                        const video =
                            videoRef.current;

                        if (!video) {
                            resolve();
                            return;
                        }

                        if (video.readyState >= 2) {
                            resolve();
                            return;
                        }

                        video.onloadedmetadata =
                            () => {
                                resolve();
                            };
                    }
                );
            }

        } catch (error) {

            console.log(
                "Camera Error:",
                error
            );

            toast.error(
                "Unable to access camera."
            );
        }
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

                setAttendanceHistory(
                    data.attendance.filter(
                        (item: Attendance) =>
                            item.employeeId ===
                            employeeId
                    )
                );
            }

        } catch (error) {

            console.log(
                "History Error:",
                error
            );
        }
    }

    /* =========================
       Upload Image
    ========================= */

    async function handleImageUpload() {

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

        if (
            !videoRef.current ||
            !canvasRef.current
        ) {

            toast.error(
                "Camera is not ready."
            );

            return;
        }

        const video =
            videoRef.current;

        const canvas =
            canvasRef.current;

        if (
            video.readyState < 2 ||
            !video.videoWidth
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
                "image/jpeg"
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

        if (!attendanceAllowed) {
            return;
        }

        setCaptured(false);

        setCapturedImage("");

        await startCamera();
    }

    /* =========================
       Load Page
    ========================= */

    useEffect(() => {

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

                if (data.success) {

                    setUser(
                        data.user
                    );

                    await getAttendanceHistory(
                        data.user.employeeId
                    );
                }

                const allowed =
                    await getAttendanceSettings();

                if (allowed) {

                    await startCamera();
                }

            } catch (error) {

                console.log(error);

                toast.error(
                    "Unable to load attendance page."
                );

            } finally {

                setPageLoading(false);
            }
        }

        loadPage();

        return () => {
            stopCamera();
        };

    }, []);

    /* =========================
       Monitor Office Time
       Every 30 Seconds
    ========================= */

    useEffect(() => {

        const interval =
            setInterval(
                async () => {

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

                },
                30000
            );

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

        if (!captured) {

            toast.error(
                "Please capture your photo."
            );

            return;
        }

        if (!navigator.geolocation) {

            toast.error(
                "Geolocation is not supported."
            );

            return;
        }

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
                            "Attendance Marked Successfully ✅"
                        );

                        stopCamera();

                        setCaptured(false);

                        setCapturedImage("");

                        await getAttendanceHistory(
                            user.employeeId
                        );

                    } else {

                        toast.error(
                            data.message
                        );
                    }

                } catch (error) {

                    console.log(error);

                    toast.error(
                        "Something went wrong."
                    );
                }
            },

            () => {

                toast.error(
                    "Please allow location access."
                );
            },

            {
                enableHighAccuracy:
                    true,

                timeout:
                    15000,

                maximumAge:
                    0,
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

                            capturePhoto={
                                capturePhoto
                            }

                            retakePhoto={
                                retakePhoto
                            }

                            onBack={() => {

                                stopCamera();

                                window.history.back();
                            }}
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