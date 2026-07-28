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
        <div className="mt-8 bg-white rounded-2xl border border-gray-200 shadow-sm">

            <div className="p-6 border-b">
                <h2 className="text-xl font-bold">
                    Recent Attendance
                </h2>
            </div>

            <div className="overflow-x-auto">

                <table className="w-full">

                    <thead className="bg-gray-50">

                        <tr>
                            <th className="text-left p-4">Employee</th>
                            <th className="text-left p-4">ID</th>
                            <th className="text-left p-4">Time</th>
                            <th className="text-left p-4">Location</th>
                            <th className="text-left p-4">Status</th>
                        </tr>

                    </thead>

                    <tbody>

                        {attendance.map((item) => (
                            <tr
                                key={item.id}
                                className="border-t hover:bg-gray-50"
                            >
                                <td className="p-4 flex items-center gap-3">

                                    <Image
                                        src={item.image}
                                        alt={item.name}
                                        width={40}
                                        height={40}
                                        className="rounded-full"
                                    />

                                    {item.name}

                                </td>

                                <td className="p-4">
                                    {item.employeeId}
                                </td>

                                <td className="p-4">
                                    {item.time}
                                </td>

                                <td className="p-4">
                                    {item.location}
                                </td>

                                <td className="p-4">

                                    <span
                                        className={`px-3 py-1 rounded-full text-sm font-medium ${item.status === "Present"
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