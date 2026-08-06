"use client";

import { useState } from "react";
import { toast } from "sonner";

interface Employee {
    _id: string;
    name: string;
    email: string;
    employeeId: string;
}

interface FormData {
    name: string;
    email: string;
    password?: string;
}
interface EmployeeFormProps {
    employee?: Employee | null;
    onSuccess?: () => void;
}

export default function EmployeeForm({
    employee,
    onSuccess,
}: EmployeeFormProps) {
    const [formData, setFormData] = useState<FormData>({
        name: employee?.name ?? "",
        email: employee?.email ?? "",
        password: employee ? undefined : "",
    });

    const [loading, setLoading] = useState(false);

    function handleChange(
        e: React.ChangeEvent<HTMLInputElement>
    ) {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    }

    async function handleSubmit(
        e: React.FormEvent<HTMLFormElement>
    ) {
        e.preventDefault();

        setLoading(true);

        try {
            const url = employee
                ? `/api/users/${employee._id}`
                : "/api/users";

            const method = employee ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.message);
                return;
            }

            toast.success(data.message);

            setFormData({
                name: "",
                email: "",
                password: "",
            });

            onSuccess?.();
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-4"
        >
            <input
                name="name"
                value={formData.name}
                disabled={!!employee}
                onChange={handleChange}
                placeholder="Name"
                className={`w-full rounded-lg border p-3 ${employee
                    ? "cursor-not-allowed bg-gray-100 text-gray-500"
                    : ""
                    }`}
                required
            />

            <input
                name="email"
                type="email"
                value={formData.email}
                disabled={!!employee}
                onChange={handleChange}
                placeholder="Email"
                className={`w-full rounded-lg border p-3 ${employee
                    ? "cursor-not-allowed bg-gray-100 text-gray-500"
                    : ""
                    }`}
                required
            />

            {!employee && (
                <input
                    name="password"
                    type="password"
                    value={formData.password ?? ""}
                    onChange={handleChange}
                    placeholder="Password"
                    className="w-full rounded-lg border p-3"
                    required
                />
            )}

            <button
                type="submit"
                disabled={loading}
                className="w-full cursor-pointer rounded-lg bg-blue-600 py-3 text-white transition hover:bg-blue-700 disabled:opacity-50"
            >
                {loading
                    ? employee
                        ? "Updating..."
                        : "Adding..."
                    : employee
                        ? "Update Employee"
                        : "Add Employee"}
            </button>
        </form>
    );
}