import AttendanceHistoryTable from "@/components/employee/AttendanceHistoryTable";

export default function EmployeeHistoryPage() {
    return (
        <div className="space-y-6">

            <div>
                <h1 className="text-3xl font-bold text-slate-800">
                    My Attendance
                </h1>

                <p className="mt-2 text-slate-500">
                    View your attendance history.
                </p>
            </div>

            <AttendanceHistoryTable />

        </div>
    );
}