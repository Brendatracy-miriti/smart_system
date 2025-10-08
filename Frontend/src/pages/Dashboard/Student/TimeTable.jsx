import React from "react";
import { useLive } from "../../../context/LiveContext";

export default function StudentTimetable() {
  const { timetables } = useLive();
  const user = JSON.parse(localStorage.getItem("eg_current_user"));
  const my = timetables.filter(t => t.course === user?.course && t.approved);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-primary mb-4">My Timetable</h2>
      {my.length ? my.map((t) => (
        <div key={t.id} className="bg-white dark:bg-[#071027] p-3 rounded-lg mb-2">
          <div className="font-semibold">{t.subject}</div>
          <div className="text-xs text-gray-500">{t.day} • {t.time}</div>
        </div>
      )) : <div className="text-gray-500">No approved timetable yet.</div>}
    </div>
  );
}
