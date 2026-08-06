"use client";

import { useEffect, useState } from "react";
import { Eye, MapPin } from "lucide-react";

type Attendance = {
  _id: string;
  date: string;
  checkIn: string;
  status: "Present" | "Late" | "Absent";
  locationLink: string;
  photo: string;
};

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export default function AttendanceHistoryTable() {
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [year, setYear] = useState(today.getFullYear());
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAttendance() {
      setLoading(true);
      try {
        const response = await fetch(`/api/attendance/monthly?month=${month}&year=${year}`, {
          cache: "no-store",
        });
        const data = await response.json();
        setAttendance(data.success ? data.attendance : []);
      } catch {
        setAttendance([]);
      } finally {
        setLoading(false);
      }
    }

    loadAttendance();
  }, [month, year]);

  return (
    <section className="overflow-hidden rounded-xl border bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b p-5 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-semibold text-slate-800">Attendance records</h2>
        <div className="flex gap-2">
          <select value={month} onChange={(event) => setMonth(Number(event.target.value))} className="rounded-md border px-3 py-2 text-sm">
            {months.map((name, index) => <option key={name} value={index + 1}>{name}</option>)}
          </select>
          <select value={year} onChange={(event) => setYear(Number(event.target.value))} className="rounded-md border px-3 py-2 text-sm">
            {[today.getFullYear(), today.getFullYear() - 1].map((value) => <option key={value} value={value}>{value}</option>)}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-600">
            <tr><th className="px-5 py-3">Date</th><th className="px-5 py-3">Check in</th><th className="px-5 py-3">Status</th><th className="px-5 py-3 text-center">Location</th><th className="px-5 py-3 text-center">Photo</th></tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="px-5 py-10 text-center text-slate-500">Loading attendance...</td></tr>
            ) : attendance.length === 0 ? (
              <tr><td colSpan={5} className="px-5 py-10 text-center text-slate-500">No attendance history found.</td></tr>
            ) : attendance.map((item) => (
              <tr key={item._id} className="border-t">
                <td className="px-5 py-3">{item.date}</td>
                <td className="px-5 py-3">{item.checkIn}</td>
                <td className="px-5 py-3"><span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">{item.status}</span></td>
                <td className="px-5 py-3 text-center">{item.locationLink && <a href={item.locationLink} target="_blank" rel="noreferrer" className="inline-flex rounded-md bg-blue-600 p-2 text-white"><MapPin size={16} /></a>}</td>
                <td className="px-5 py-3 text-center">{item.photo && <button type="button" onClick={() => window.open(item.photo, "_blank")} className="inline-flex rounded-md bg-slate-800 p-2 text-white"><Eye size={16} /></button>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
