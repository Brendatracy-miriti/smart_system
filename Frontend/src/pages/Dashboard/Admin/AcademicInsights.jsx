import React, { useMemo } from "react";
import { useData } from "../../../context/DataContext";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function AcademicInsights() {
  const { data } = useData();
  const grades = data.grades || [];
  const attendance = data.attendance || [];

  // Prepare average grade per course (simple)
  const gradeByCourse = useMemo(() => {
    const map = {};
    grades.forEach((g) => {
      map[g.course] = map[g.course] || { sum: 0, count: 0 };
      map[g.course].sum += Number(g.score || 0);
      map[g.course].count += 1;
    });
    return Object.entries(map).map(([course, v]) => ({ course, avg: Math.round(v.sum / v.count) || 0 }));
  }, [grades]);

  // simple at-risk detection: attendance < 70%
  const atRisk = useMemo(() => {
    const students = (data.users || []).filter((u) => u.role === "student");
    const list = students.filter((s) => (s.attendance_rate || 100) < 70);
    return list;
  }, [data.users]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-primary">Academic Insights</h2>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-[#071027] p-4 rounded-2xl shadow">
          <h3 className="font-semibold mb-3">Average grades by course</h3>
          <div style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gradeByCourse}>
                <XAxis dataKey="course" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="avg" fill="#1E3A8A" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-[#071027] p-4 rounded-2xl shadow">
          <h3 className="font-semibold mb-3">At-risk students</h3>
          {atRisk.length ? (
            <ul className="space-y-2">
              {atRisk.map((s) => (
                <li key={s.id} className="p-3 rounded border dark:border-gray-700">
                  <div className="font-medium">{s.name}</div>
                  <div className="text-sm text-gray-500">Attendance: {s.attendance_rate ?? "N/A"}%</div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No at-risk students detected.</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
