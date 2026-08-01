import Image from "next/image";

const attendance = [
    {
        id: 1,
        name: "Ali Khan",
        employeeId: "EMP001",
        time: "09:02 AM",
        location: "Karachi",
        status: "Present",
        image: "https://i.pravatar.cc/100?img=1",
    },
    {
        id: 2,
        name: "Ahmed Raza",
        employeeId: "EMP002",
        time: "09:10 AM",
        location: "Lahore",
        status: "Present",
        image: "https://i.pravatar.cc/100?img=2",
    },
    {
        id: 3,
        name: "Usman Ali",
        employeeId: "EMP003",
        time: "--",
        location: "--",
        status: "Absent",
        image: "https://i.pravatar.cc/100?img=3",
    },
];

export default function RecentAttendance() {
    return (
        <div className="mt-8 rounded-2xl border border-gray-200 bg-white shadow-sm">

            <div className="border-b p-5">

                <h2 className="text-lg sm:text-xl font-bold text-slate-800">
                    Recent Attendance
                </h2>

            </div>

            {/* Mobile Cards */}

            <div className="block lg:hidden space-y-4 p-4">
                {attendance.map((item) => (
                    <div
                        key={item.id}
                        className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
                    >
                        <div className="flex items-center gap-3">

                            <Image
                                src={item.image}
                                alt={item.name}
                                width={50}
                                height={50}
                                className="rounded-full"
                            />

                            <div>
                                <h3 className="font-semibold text-gray-800">
                                    {item.name}
                                </h3>

                                <p className="text-sm text-gray-500">
                                    {item.employeeId}
                                </p>
                            </div>

                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">

                            <div>
                                <p className="text-gray-500">Time</p>
                                <p className="font-medium">{item.time}</p>
                            </div>

                            <div>
                                <p className="text-gray-500">Location</p>
                                <p className="font-medium">{item.location}</p>
                            </div>

                        </div>

                        <div className="mt-4">

                            <span
                                className={`rounded-full px-3 py-1 text-xs font-semibold ${item.status === "Present"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                                    }`}
                            >
                                {item.status}
                            </span>

                        </div>

                    </div>
                ))}
            </div>
            <div className="hidden lg:block overflow-x-auto">


                <table className="min-w-[700px] w-full">

                    <thead className="bg-gray-50">

                        <tr>

                            <th className="p-4 text-left text-sm font-semibold">
                                Employee
                            </th>

                            <th className="p-4 text-left text-sm font-semibold">
                                ID
                            </th>

                            <th className="p-4 text-left text-sm font-semibold">
                                Time
                            </th>

                            <th className="p-4 text-left text-sm font-semibold">
                                Location
                            </th>

                            <th className="p-4 text-left text-sm font-semibold">
                                Status
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {attendance.map((item) => (

                            <tr
                                key={item.id}
                                className="border-t transition hover:bg-gray-50"
                            >

                                <td className="p-4">

                                    <div className="flex items-center gap-3">

                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            width={42}
                                            height={42}
                                            className="rounded-full"
                                        />

                                        <span className="font-medium">
                                            {item.name}
                                        </span>

                                    </div>

                                </td>

                                <td className="p-4">{item.employeeId}</td>

                                <td className="p-4">{item.time}</td>

                                <td className="p-4">{item.location}</td>

                                <td className="p-4">

                                    <span
                                        className={`rounded-full px-3 py-1 text-xs font-semibold ${item.status === "Present"
                                            ? "bg-green-100 text-green-700"
                                            : "bg-red-100 text-red-700"
                                            }`}
                                    >
                                        {item.status}
                                    </span>

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

        </div>
    );
}