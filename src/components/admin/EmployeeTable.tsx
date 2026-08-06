"use client";

import { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import DeleteModal from "./DeleteModal";
import { toast } from "sonner";

interface User {
    _id: string;
    name: string;
    email: string;
    employeeId: string;
    role: string;
    isActive: boolean;
}

interface EmployeeTableProps {
    refreshKey: number;
    search: string;
    onEdit: (employee: User) => void;
}

export default function EmployeeTable({
    refreshKey,
    search,
    onEdit,
}: EmployeeTableProps) {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const ITEMS_PER_PAGE = 10;
    const [currentPage, setCurrentPage] = useState(1);


    async function handleDelete() {
        if (!deleteId) return;

        try {
            setDeleteLoading(true);

            const res = await fetch(`/api/users/${deleteId}`, {
                method: "DELETE",
            });

            const data = await res.json();

            if (data.success) {
                setUsers((prev) =>
                    prev.filter((user) => user._id !== deleteId)
                );

                toast.success(data.message);

                setDeleteOpen(false);
                setDeleteId(null);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong");
        } finally {
            setDeleteLoading(false);
        }
    }

    async function handleToggleStatus(userId: string) {
        try {
            const res = await fetch(`/api/users/${userId}`, {
                method: "PATCH",
            });

            const data = await res.json();

            if (!data.success) {
                toast.error(data.message);
                return;
            }

            setUsers((prev) =>
                prev.map((user) =>
                    user._id === userId ? { ...user, isActive: data.isActive, } : user
                )
            );

            toast.success(data.message);
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong");
        }
    }

    useEffect(() => {
        async function getUsers() {
            try {
                const res = await fetch("/api/users", {
                    cache: "no-store",
                });

                const data = await res.json();

                if (data.success) {
                    setUsers(data.users);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }

        getUsers();
    }, [refreshKey]);

    if (loading) {
        return (
            <div className="rounded-xl bg-white p-6 shadow animate-pulse">

                {/* Desktop Skeleton */}
                <div className="hidden lg:block overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <th key={i} className="px-6 py-4">
                                        <div className="h-4 w-24 rounded bg-gray-200"></div>
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody>
                            {Array.from({ length: 8 }).map((_, i) => (
                                <tr key={i} className="border-b">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-gray-200"></div>

                                            <div>
                                                <div className="mb-2 h-4 w-32 rounded bg-gray-200"></div>
                                                <div className="h-3 w-20 rounded bg-gray-200"></div>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4">
                                        <div className="h-4 w-44 rounded bg-gray-200"></div>
                                    </td>

                                    <td className="px-6 py-4">
                                        <div className="h-7 w-20 rounded-full bg-gray-200"></div>
                                    </td>

                                    <td className="px-6 py-4 text-center">
                                        <div className="mx-auto h-5 w-10 rounded-full bg-gray-200"></div>
                                    </td>

                                    <td className="px-6 py-4">
                                        <div className="flex justify-center gap-3">
                                            <div className="h-10 w-10 rounded-xl bg-gray-200"></div>
                                            <div className="h-10 w-10 rounded-xl bg-gray-200"></div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Skeleton */}
                <div className="space-y-4 lg:hidden">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div
                            key={i}
                            className="rounded-2xl border p-4"
                        >
                            <div className="flex items-center gap-3">
                                <div className="h-12 w-12 rounded-full bg-gray-200"></div>

                                <div className="flex-1">
                                    <div className="mb-2 h-4 w-32 rounded bg-gray-200"></div>
                                    <div className="h-3 w-20 rounded bg-gray-200"></div>
                                </div>
                            </div>

                            <div className="mt-4 space-y-2">
                                <div className="h-3 w-full rounded bg-gray-200"></div>
                                <div className="h-3 w-2/3 rounded bg-gray-200"></div>
                            </div>

                            <div className="mt-4 flex justify-between">
                                <div className="h-5 w-10 rounded-full bg-gray-200"></div>

                                <div className="flex gap-2">
                                    <div className="h-10 w-10 rounded-xl bg-gray-200"></div>
                                    <div className="h-10 w-10 rounded-xl bg-gray-200"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        );
    }
    const filteredUsers = users.filter((user) =>
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase()) ||
        user.employeeId.toLowerCase().includes(search.toLowerCase())
    );

    const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
    const paginatedUsers = filteredUsers.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    return (


        <div className="rounded-xl bg-white shadow">
            {/* Mobile Cards */}

            <div className="block lg:hidden space-y-4 p-4">

                {paginatedUsers.map((user) => (

                    <div
                        key={user._id}
                        className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
                    >

                        <div className="flex items-center gap-3">

                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-600">
                                {user.name.charAt(0).toUpperCase()}
                            </div>

                            <div>

                                <h3 className="font-semibold text-slate-800">
                                    {user.name}
                                </h3>

                                <p className="text-sm text-gray-500">
                                    {user.employeeId}
                                </p>

                            </div>

                        </div>

                        <div className="mt-4 space-y-2">

                            <p className="text-sm text-gray-600">
                                <span className="font-semibold">
                                    Email:
                                </span>{" "}
                                {user.email}
                            </p>

                            <p className="text-sm">
                                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                                    {user.role}
                                </span>
                            </p>

                        </div>

                        <div className="mt-4 flex items-center justify-between">

                            <button
                                onClick={() => handleToggleStatus(user._id)}
                                className={`relative h-5 w-9 rounded-full transition ${user.isActive
                                    ? "bg-green-500"
                                    : "bg-gray-300"
                                    }`}
                            >

                                <span
                                    className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition ${user.isActive
                                        ? "left-5"
                                        : "left-0.5"
                                        }`}
                                />

                            </button>

                            <div className="flex gap-2">

                                <button
                                    onClick={() => onEdit(user)}
                                    className="rounded-lg bg-blue-50 p-2 text-blue-600 hover:bg-blue-600 hover:text-white transition"
                                >
                                    <Pencil size={18} />
                                </button>

                                <button
                                    onClick={() => {
                                        setDeleteId(user._id);
                                        setDeleteOpen(true);
                                    }}
                                    className="rounded-lg bg-red-50 p-2 text-red-600 hover:bg-red-600 hover:text-white transition"
                                >
                                    <Trash2 size={18} />
                                </button>

                            </div>

                        </div>

                    </div>

                ))}

            </div>
            <div className="hidden lg:block overflow-x-auto">
                <table className="w-full table-auto border-collapse">
                    <thead>
                        <tr className="border-b bg-gray-50">
                            <th className="px-4 md:px-6 py-4 text-left text-sm font-semibold text-gray-600 whitespace-nowrap">Name</th>
                            <th className="px-4 md:px-6 py-4 text-left text-sm font-semibold text-gray-600 whitespace-nowrap">Email</th>
                            <th className="px-4 md:px-6 py-4 text-left text-sm font-semibold text-gray-600 whitespace-nowrap">Role</th>
                            <th className="px-4 md:px-6 py-4 text-center text-sm font-semibold text-gray-600 whitespace-nowrap">
                                Status
                            </th>
                            <th className="px-4 md:px-6 py-4 text-center text-sm font-semibold text-gray-600 whitespace-nowrap">
                                Actions
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredUsers.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="px-4 md:px-6 py-4"
                                >
                                    No employees found.
                                </td>
                            </tr>
                        ) : (
                            paginatedUsers.map((user) => (
                                <tr
                                    key={user._id}
                                    className="border-t transition-colors hover:bg-blue-50/40"
                                >
                                    <td className="px-4 md:px-6 py-4">
                                        <div className="flex items-center gap-3">

                                            <div
                                                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold"
                                                style={{
                                                    backgroundColor: "#DBEAFE",
                                                    color: "#2563EB",
                                                }}
                                            >
                                                {user.name.charAt(0).toUpperCase()}
                                            </div>

                                            <div className="leading-tight">
                                                <p className="font-medium text-gray-900 whitespace-nowrap">
                                                    {user.name}
                                                </p>

                                                <span className="text-xs text-gray-500">
                                                    {user.employeeId}
                                                </span>
                                            </div>

                                        </div>
                                    </td>
                                    <td className="px-4 md:px-6 py-4 text-sm text-gray-600 whitespace-nowrap">{user.email}</td>

                                    <td className="px-4 md:px-6 py-4">
                                        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-4 md:px-6 py-4 text-center">
                                        <button
                                            onClick={() => handleToggleStatus(user._id)}
                                            className={`relative h-5 w-9 cursor-pointer rounded-full shadow-inner transition-all duration-300  ${user.isActive
                                                ? "bg-green-500"
                                                : "bg-gray-300"
                                                }`}
                                        >
                                            <span
                                                className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-md transition-all duration-300 ${user.isActive
                                                    ? "left-5"
                                                    : "left-0.5"
                                                    }`}
                                            />
                                        </button>
                                    </td>
                                    <td className="px-4 md:px-6 py-4">
                                        <div className="flex items-center justify-center gap-3">

                                            <button
                                                onClick={() => onEdit(user)}
                                                className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-600 hover:text-white hover:shadow-lg hover:shadow-blue-200"
                                            >
                                                <Pencil size={16} />
                                            </button>

                                            <button
                                                onClick={() => {
                                                    setDeleteId(user._id);
                                                    setDeleteOpen(true);
                                                }}
                                                className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-xl bg-red-50 text-red-600 transition-all duration-300 hover:-translate-y-0.5 hover:bg-red-600 hover:text-white hover:shadow-lg hover:shadow-red-200"
                                            >
                                                <Trash2 size={16} />
                                            </button>

                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>


            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-t px-4 md:px-6 py-4">
                <p className="text-sm text-gray-500">
                    Page {currentPage} of {totalPages}
                </p>

                <div className="flex w-full sm:w-auto gap-2">
                    <button
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="flex-1 sm:flex-none cursor-pointer rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-all duration-200 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-gray-300 disabled:hover:bg-white disabled:hover:text-gray-700"
                    >
                        Previous
                    </button>
                    <button
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="flex-1 sm:flex-none cursor-pointer rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-all duration-200 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-gray-300 disabled:hover:bg-white disabled:hover:text-gray-700"
                    >
                        Next
                    </button>
                </div>
            </div>

            <DeleteModal
                isOpen={deleteOpen}
                onClose={() => {
                    setDeleteOpen(false);
                    setDeleteId(null);
                }}
                onConfirm={handleDelete}
                loading={deleteLoading}
            />

        </div>
    );
}