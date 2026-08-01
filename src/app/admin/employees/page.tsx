"use client";

import { useState } from "react";
import { Plus, Search } from "lucide-react";

import EmployeeTable from "@/components/admin/EmployeeTable";
import EmployeeModal from "@/components/admin/EmployeeModal";

export default function EmployeesPage() {

    interface Employee {
        _id: string;
        name: string;
        email: string;
        employeeId: string;
        role: string;
        isActive: boolean;
    }
    const [refreshKey, setRefreshKey] = useState(0);
    const [search, setSearch] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] =
        useState<Employee | null>(null);

    return (
        <div className="space-y-6">

            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                <h2 className="text-2xl font-bold text-gray-800">
                    Employees
                </h2>

                <div className="flex w-full flex-col gap-3 sm:flex-row md:w-auto">

                    <div className="relative w-full sm:flex-1 md:w-72">

                        <Search
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                        <input
                            type="text"
                            placeholder="Search employee..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="h-11 w-full rounded-xl border border-gray-300 bg-white pl-10 pr-4 text-sm shadow-sm outline-none transition-all duration-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                        />

                    </div>

                    <button
                        onClick={() => setIsOpen(true)}
                        className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-white transition-all duration-300 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200 sm:w-auto"
                    >
                        <Plus size={18} />
                        Add Employee
                    </button>

                </div>

            </div>

            <EmployeeTable
                refreshKey={refreshKey}
                search={search}
                onEdit={(employee) => {
                    setSelectedEmployee(employee);
                    setIsOpen(true);
                }}
            />

            <EmployeeModal
                isOpen={isOpen}
                employee={selectedEmployee}
                onClose={() => {
                    setSelectedEmployee(null);
                    setIsOpen(false);
                }}
                onSuccess={() => {
                    setSelectedEmployee(null);
                    setRefreshKey((prev) => prev + 1);
                }}
            />
        </div>
    );
}