"use client";

import EmployeeForm from "./EmployeeForm";
import { motion, AnimatePresence } from "framer-motion";

interface Employee {
    _id: string;
    name: string;
    email: string;
    employeeId: string;
}

interface EmployeeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    employee: Employee | null;
}
export default function EmployeeModal({
    isOpen,
    onClose,
    onSuccess,
    employee,
}: EmployeeModalProps) {

    return (

        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35 }}
                >
                    <motion.div
                        initial={{
                            opacity: 0,
                            scale: 0.94,
                        }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                        }}
                        exit={{
                            opacity: 0,
                            scale: 0.94,
                        }}
                        transition={{
                            duration: 0.38,
                            ease: [0.22, 1, 0.36, 1],
                        }}
                        className="w-full max-w-xl rounded-2xl bg-white shadow-xl"
                    >
                        <div className="flex items-center justify-between border-b p-6">
                            <h2 className="text-2xl font-bold text-gray-800">
                                {employee ? "Edit Employee" : "Add Employee"}
                            </h2>

                            <button
                                onClick={onClose}
                                className="cursor-pointer text-2xl text-gray-500 hover:text-red-600"
                            >
                                ×
                            </button>
                        </div>

                        <div className="p-6">
                            <EmployeeForm
                                key={employee?._id ?? "new"}
                                employee={employee}
                                onSuccess={() => {
                                    onSuccess();
                                    onClose();
                                }}
                            />
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}