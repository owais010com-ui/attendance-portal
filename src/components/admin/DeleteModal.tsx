"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";

interface DeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    loading: boolean;
}

export default function DeleteModal({
    isOpen,
    onClose,
    onConfirm,
    loading,
}: DeleteModalProps) {

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }

        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);


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
                        className="w-full max-w-md rounded-2xl bg-white shadow-xl"
                    >

                        <div className="p-6">

                            <h2 className="text-2xl font-bold text-gray-800">
                                Delete Employee
                            </h2>

                            <p className="mt-3 text-gray-500">
                                Are you sure you want to delete this employee?
                                This action cannot be undone.
                            </p>

                            <div className="mt-6 flex justify-end gap-3">

                                <button
                                    onClick={onClose}
                                    className="cursor-pointer rounded-lg border px-5 py-2 transition hover:bg-gray-100"
                                >
                                    Cancel
                                </button>

                                <button
                                    onClick={onConfirm}
                                    disabled={loading}
                                    className="cursor-pointer rounded-lg bg-red-600 px-5 py-2 text-white transition hover:bg-red-700 disabled:opacity-50"
                                >
                                    {loading ? "Deleting..." : "Delete"}
                                </button>

                            </div>

                        </div>

                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
