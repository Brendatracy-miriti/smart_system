import React, { useState } from "react";
import { addTimetable } from "../../../utils/localData";
import { v4 as uuidv4 } from "uuid";
import { useLive } from "../../../context/LiveContext";

export default function TeacherTimetable() {
  const { refresh } = useLive();
  const [subject, setSubject] = useState("");
  const [day, setDay] = useState("");
  const [time, setTime] = useState("");
  const [course, setCourse] = useState("");

  const create = () => {
    if (!subject || !day || !time || !course) return alert("Fill all");
    const t = { id: uuidv4(), subject, day, time, course, createdBy: "teacher", approved: false };
    addTimetable(t);
    alert("Timetable created, pending admin approval");
    setSubject(""); setDay(""); setTime(""); setCourse("");
    window.dispatchEvent(new Event("storage")); setTimeout(()=>refresh && refresh(), 300);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-primary mb-4">Create Timetable (requires admin approval)</h2>
      <div className="bg-white dark:bg-[#071027] p-4 rounded mb-4">
        <input value={subject} onChange={e=>setSubject(e.target.value)} placeholder="Subject" className="w-full p-2 border rounded mb-2" />
        <input value={course} onChange={e=>setCourse(e.target.value)} placeholder="Course (e.g. Form 2A)" className="w-full p-2 border rounded mb-2" />
        <div className="flex gap-2">
          <input value={day} onChange={e=>setDay(e.target.value)} placeholder="Day (Mon)" className="flex-1 p-2 border rounded" />
          <input value={time} onChange={e=>setTime(e.target.value)} placeholder="Time (09:00 - 10:00)" className="flex-1 p-2 border rounded" />
        </div>
        <button onClick={create} className="mt-2 px-3 py-1 bg-primary text-white rounded">Save</button>
      </div>
    </div>
  );
}
