import ProfileCard from "@/components/employee/ProfileCard";

export default function EmployeeProfilePage() {
    return (
        <div className="space-y-6">

            <div>
                <h1 className="text-3xl font-bold text-slate-800">
                    My Profile
                </h1>

                <p className="mt-2 text-slate-500">
                    View your personal information.
                </p>
            </div>

            <ProfileCard />

        </div>
    );
}