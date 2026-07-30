"use client";

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
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">

            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">

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
                        className="cursor-pointer rounded-lg border px-5 py-2 hover:bg-gray-100"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className="cursor-pointer rounded-lg bg-red-600 px-5 py-2 text-white hover:bg-red-700 disabled:opacity-50"
                    >
                        {loading ? "Deleting..." : "Delete"}
                    </button>

                </div>

            </div>

        </div>
    );
}
