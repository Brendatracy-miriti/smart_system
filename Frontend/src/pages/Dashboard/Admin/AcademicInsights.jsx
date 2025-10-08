import React from "react";
import { useLive } from "../../../context/LiveContext";
import { approveTimetable } from "../../../utils/localData";

export default function AcademicInsights() {
  const { timetables } = useLive();

  const pending = timetables.filter(t => !t.approved);

  const handleApprove = (id) => {
    approveTimetable(id);
    window.dispatchEvent(new Event("storage"));
    alert("Approved");
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-primary mb-4">Timetable Approvals</h2>
      {pending.length ? pending.map(t => (
        <div key={t.id} className="bg-white dark:bg-[#071027] p-3 rounded mb-2 flex justify-between">
          <div>
            <div className="font-semibold">{t.subject}</div>
            <div className="text-xs text-gray-500">{t.course} • {t.day} {t.time}</div>
          </div>
          <button onClick={()=>handleApprove(t.id)} className="px-3 py-1 bg-primary text-white rounded">Approve</button>
        </div>
      )) : <div className="text-gray-500">No pending timetables</div>}
    </div>
  );
}
