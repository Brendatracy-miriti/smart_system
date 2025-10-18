import React from "react";
import { useData } from "../../../context/DataContext";
import { useAuth } from "../../../context/AuthContext";
import { v4 as uuidv4 } from "uuid";

export default function TeacherAttendance() {
  const { data, addAttendance, refresh } = useData();
  const students = data?.students || [];
  const { current } = useAuth();
  const [message, setMessage] = React.useState(null);

  // For simplicity, present list of students to mark present
  const handleMark = (student) => {
    addAttendance({ id: uuidv4(), classId: "manual", studentId: student.id, date: new Date().toISOString().slice(0,10), status: "present" });
    setMessage({ type: "success", text: `Marked ${student.admission_number || student.email} present` });
    window.dispatchEvent(new Event("storage")); setTimeout(()=>refresh && refresh(), 300);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-primary mb-4">Attendance</h2>
      <div className="space-y-2">
        {students.length ? students.map(s => (
          <div key={s.id} className="bg-white dark:bg-[#071027] p-3 rounded flex justify-between">
            <div>
              <div className="font-medium">{s.admission_number || s.email}</div>
              <div className="text-xs text-gray-500">{s.course}</div>
            </div>
            <button onClick={()=>handleMark(s)} className="px-3 py-1 bg-primary text-white rounded">Mark Present</button>
          </div>
        )) : <div className="text-gray-500">No students found.</div>}
      </div>
    </div>
  );
}
