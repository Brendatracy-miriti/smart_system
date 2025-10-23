import React, { useEffect, useState } from "react";
import { useData } from "../../../context/DataContext";
import { useAuth } from "../../../context/AuthContext";
import Papa from "papaparse";
import { AlertTriangle, ShieldCheck } from "lucide-react";

export default function ParentDashboard() {
  const { data, calculateRisk } = useData();
  const { current: user } = useAuth();

  // Defensive: fallback to empty arrays if context is not ready
  const parents = data?.parents || [];
  const students = data?.students || [];
  const assignments = data?.assignments || [];
  const timetables = data?.timetable || [];
  const attendance = data?.attendance || [];
  const grades = data?.grades || [];

  const parent = parents.find(p => p.userId === user?.id);
  const child = students.find(s => s.admission_number === parent?.childStudentId);

  if (!parent || !parent.childStudentId) return <div className="p-4">No child linked. Link in Settings.</div>;

  const childAssignments = assignments.filter(a => a.course === child?.course);
  const childGrades = grades.filter(g => g.studentEmail === child?.email);
  const childAttendance = attendance.filter(a => a.studentId === child?.id);

  const risk = child ? calculateRisk(child) : "Unknown";

  // Finance transparency state
  const [financeRows, setFinanceRows] = useState([]);
  const [financeSummary, setFinanceSummary] = useState({ totalAllocated: 0, totalSpent: 0, avgUtilization: 0 });

  useEffect(() => {
    // load finance CSV for transparency view
    fetch('/Data/finance_data.csv')
      .then(res => {
        if (!res.ok) throw new Error(`Finance CSV fetch failed: ${res.status}`);
        return res.text();
      })
      .then(csv => {
        Papa.parse(csv, {
          header: true,
          skipEmptyLines: true,
          transformHeader: h => h && h.trim(),
          transform: v => (typeof v === 'string' ? v.trim() : v),
          complete: (results) => {
            const rows = results.data.map(r => ({
              month: r.month,
              allocated: Number(r.allocated_budget) || 0,
              actual: Number(r.actual_spent) || 0,
              utilization: Number(r.utilization_pct) || 0,
              flag: r.flag || ''
            }));
            setFinanceRows(rows);
            const totalAllocated = rows.reduce((s, x) => s + x.allocated, 0);
            const totalSpent = rows.reduce((s, x) => s + x.actual, 0);
            const avgUtil = rows.length ? (rows.reduce((s,x)=>s+x.utilization,0)/rows.length) : 0;
            setFinanceSummary({ totalAllocated, totalSpent, avgUtilization: avgUtil });
          },
          error: (err) => {
            console.error('Error parsing finance CSV', err);
          }
        });
      })
      .catch(err => console.error('Failed to load finance CSV', err));
  }, []);

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
        <div className="mt-6 bg-white dark:bg-[#071027] p-4 rounded">
          <h3 className="font-semibold">Finance Transparency</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
            <div>
              <div className="text-xs text-gray-500">Total Allocated</div>
              <div className="font-semibold">KSh {financeSummary.totalAllocated.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Total Spent</div>
              <div className="font-semibold">KSh {financeSummary.totalSpent.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Avg Utilization</div>
              <div className="font-semibold">{financeSummary.avgUtilization.toFixed(2)}%</div>
            </div>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="text-gray-500 dark:text-gray-400">
                  <th className="py-2 px-2">Month</th>
                  <th className="py-2 px-2">Spent (KSh)</th>
                  <th className="py-2 px-2">Utilization</th>
                  <th className="py-2 px-2">Flag</th>
                </tr>
              </thead>
              <tbody>
                {financeRows.slice(0,6).map((r, i) => (
                  <tr key={i} className="border-t border-gray-100 dark:border-gray-800">
                    <td className="py-2 px-2">{r.month}</td>
                    <td className="py-2 px-2">{r.actual.toLocaleString()}</td>
                    <td className="py-2 px-2">{r.utilization}%</td>
                    <td className="py-2 px-2">{r.flag}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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

