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

            <div className="mb-6 flex items-center justify-between">

                <h2 className="text-xl font-semibold text-gray-800">
                    Employees
                </h2>

                <div className="flex items-center gap-3">

                    <div className="relative">

                        <Search
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />

                        <input
                            type="text"
                            placeholder="Search employee..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="h-11 w-72 rounded-xl border border-gray-300 bg-white pl-10 pr-4 text-sm shadow-sm transition-all duration-300 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                        />

                    </div>

                    <button
                        onClick={() => setIsOpen(true)}
                        className="flex h-11 items-center gap-2 rounded-xl bg-blue-600 px-5 text-white transition-all duration-300 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200"
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