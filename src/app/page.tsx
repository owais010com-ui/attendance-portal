

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="rounded-2xl bg-white p-10 shadow-xl text-center">
        <h1 className="text-4xl font-bold text-slate-800">
          Attendance Portal
        </h1>

        <p className="mt-3 text-gray-500">
          Employee Attendance Management System
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <div className="rounded-xl bg-blue-50 px-6 py-4">
            <p className="text-sm text-gray-500">Employees</p>
            <h2 className="text-3xl font-bold text-blue-600">0</h2>
          </div>

          <div className="rounded-xl bg-green-50 px-6 py-4">
            <p className="text-sm text-gray-500">Present</p>
            <h2 className="text-3xl font-bold text-green-600">0</h2>
          </div>

          <div className="rounded-xl bg-red-50 px-6 py-4">
            <p className="text-sm text-gray-500">Absent</p>
            <h2 className="text-3xl font-bold text-red-600">0</h2>
          </div>
        </div>

        <p className="mt-8 text-sm text-gray-400">
          System is ready 🚀
        </p>
      </div>
    </main>
  );
}