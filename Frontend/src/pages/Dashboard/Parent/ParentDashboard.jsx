import React from "react";
import { useLive } from "../../../context/LiveContext";

import { useContext } from "react";
import { DataContext } from "../../../context/DataContext";
import { AlertTriangle, ShieldCheck } from "lucide-react";

export default function ParentDashboard() {
  const liveData = useLive();
  // Defensive: fallback to empty arrays if context is not ready
  const parents = liveData?.parents || [];
  const students = liveData?.students || [];
  const assignments = liveData?.assignments || [];
  const timetables = liveData?.timetables || [];
  const attendance = liveData?.attendance || [];
  const grades = liveData?.grades || [];

  const user = JSON.parse(localStorage.getItem("eg_current_user"));
  const parent = parents.find(p => p.userId === user?.id);
  const child = students.find(s => s.id === parent?.childStudentId);

  if (!parent) return <div className="p-4">No child linked. Link in Settings.</div>;

  const childAssignments = assignments.filter(a => a.course === child?.course);
  const childGrades = grades.filter(g => g.studentEmail === child?.email);
  const childAttendance = attendance.filter(a => a.studentId === child?.id);

  const { calculateRisk } = useContext(DataContext);
  const risk = child ? calculateRisk(child) : "Unknown";

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-primary">Parent Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <div className="bg-white dark:bg-[#071027] p-4 rounded">
          <div className="font-semibold">Child</div>
          <div>{child?.admission_number || child?.email}</div>
          <div className="text-xs text-gray-500">{child?.course}</div>
        </div>
        <div className="bg-white dark:bg-[#071027] p-4 rounded">
          <div className="font-semibold">Assignments</div>
          <div>{childAssignments.length}</div>
        </div>
        <div className="bg-white dark:bg-[#071027] p-4 rounded">
          <div className="font-semibold">Attendance records</div>
          <div>{childAttendance.length}</div>
        </div>
      </div>

      <div className="mt-4 bg-white dark:bg-[#071027] p-4 rounded">
        <h3 className="font-semibold">Recent Grades</h3>
        {childGrades.length ? childGrades.map(g=> <div key={g.id} className="py-2 border-b">{g.course} — {g.score}</div>) : <div className="text-gray-500">No grades yet.</div>}
      </div>
      <div className="mt-4 p-3 rounded-xl border dark:border-gray-700">
      <h4 className="font-semibold text-gray-700 dark:text-gray-200">Risk Status</h4>
      {risk === "At-Risk" ? (
        <p className="flex items-center gap-2 text-red-600 mt-2">
          <AlertTriangle size={18} /> Your child might be struggling. Please contact their teacher.
        </p>
      ) : (
        <p className="flex items-center gap-2 text-green-600 mt-2">
          <ShieldCheck size={18} /> Your child is performing well.
        </p>
      )}
    </div>
    </div>
  );
}
