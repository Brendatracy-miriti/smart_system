import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../../../utils/api";
import { useMessage } from "../../../hooks/useMessage";
import MiniChart from "../../../ui/MiniChart";
import StatCard from "../../../ui/StatCard";

export default function TeacherDashboard() {
  const [loading, setLoading] = useState(true);
  const [classes, setClasses] = useState([]);
  const [performance, setPerformance] = useState([]);
  const { setMessage } = useMessage();

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      setLoading(true);
      try {
        const [classRes, perfRes] = await Promise.all([
          api.get("classes/"),
          api.get("students/performance/"),
        ]);
        if (!mounted) return;
        setClasses(classRes.data || []);
        setPerformance(perfRes.data || []);
      } catch (e) {
        setMessage({ type: "error", text: "Failed to fetch teacher data" });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    return () => (mounted = false);
  }, [setMessage]);

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
        <StatCard title="Average Attendance" value="91%" color="green-500" />
        <StatCard title="Active Assignments" value="6" color="cyan-500" />
      </div>

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
