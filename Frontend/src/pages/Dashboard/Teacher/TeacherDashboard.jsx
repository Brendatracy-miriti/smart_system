import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useData } from "../../../context/DataContext";
import { useAuth } from "../../../context/AuthContext";
import MiniChart from "../../../ui/MiniChart";
import StatCard from "../../../ui/StatCard";
import { AlertTriangle } from "lucide-react";

export default function TeacherDashboard() {
  const { data, calculateRisk } = useData();
  const { current: currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [classes, setClasses] = useState([]);
  const [performance, setPerformance] = useState([]);

  const students = data?.students || [];
  const assignments = data?.assignments || [];
  const timetables = data?.timetable || [];

  const myStudents = students.filter(s => s.teacherId === currentUser?.id);
  const myAssignments = assignments.filter(a => a.teacherId === currentUser?.id);
  const myTimetables = timetables.filter(t => t.teacherId === currentUser?.id);
  const myAtRisk = myStudents.filter(s => calculateRisk(s) === "At-Risk");

  useEffect(() => {
    // Simulate loading for local data
    setLoading(true);
    setTimeout(() => {
      setClasses(myTimetables);
      setPerformance(myStudents.map(s => ({ label: s.name, value: s.avgScore || 0 })));
      setLoading(false);
    }, 500);
  }, [myStudents, myTimetables]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="p-6 space-y-8"
    >
      <div>
        <h2 className="text-3xl font-bold text-primary mb-2">Teacher Dashboard</h2>
        <p className="text-gray-500 dark:text-gray-400">
          Welcome back! Monitor your classes and performance insights here.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="My Classes" value={classes.length} color="blue-500" />
        <StatCard title="My Students" value={myStudents.length} color="green-500" />
        <StatCard title="Active Assignments" value={myAssignments.length} color="cyan-500" />
      </div>

      <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl shadow mt-6">
      <h3 className="text-lg font-semibold flex items-center gap-2 text-red-600">
        <AlertTriangle size={20} /> Your At-Risk Students
      </h3>
      {myAtRisk.length ? (
        <ul className="mt-3 space-y-2 text-sm">
          {myAtRisk.map((s) => (
            <li key={s.id} className="border-b border-gray-100 dark:border-gray-800 pb-1">
              {s.name} — {s.course} ({s.attendanceRate}% attendance, {s.avgScore} avg)
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No at-risk students in your classes.</p>
      )}
    </div>;

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-[#1F2937] p-5 rounded-2xl shadow-sm">
          <h3 className="font-semibold mb-3 text-gray-800 dark:text-gray-100">
            Student Performance Trend
          </h3>
          <MiniChart data={performance} color="#10B981" height={150} />
        </div>

        <div className="bg-white dark:bg-[#1F2937] p-5 rounded-2xl shadow-sm">
          <h3 className="font-semibold mb-3 text-gray-800 dark:text-gray-100">My Classes</h3>
          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : classes.length ? (
            <ul className="space-y-2">
              {classes.map((c) => (
                <li
                  key={c.id}
                  className="p-2 border border-gray-100 dark:border-gray-700 rounded-lg"
                >
                  <div className="font-medium">{c.name}</div>
                  <div className="text-sm text-gray-500">{c.schedule || "No schedule"}</div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No classes assigned yet.</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
