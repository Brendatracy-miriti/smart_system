import React, { useEffect, useState } from "react";
import AreaSpark from "../../components/AreaSpark";
import api from "../../utils/api";
import { useMessage } from "../../context/MessageContext";
import { motion } from "framer-motion";

export default function StudentDashboard() {
  const [loading, setLoading] = useState(true);
  const [performance, setPerformance] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const { setMessage } = useMessage();

  useEffect(() => {
    let mounted = true;
    const fetchStudent = async () => {
      setLoading(true);
      try {
        const [perfRes, tasksRes] = await Promise.all([
          api.get("my/performance/"), // expects array {label, value}
          api.get("my/upcoming/"), // expects array of upcoming tasks/assignments
        ]);
        if (!mounted) return;
        setPerformance(Array.isArray(perfRes.data) ? perfRes.data : []);
        setUpcoming(Array.isArray(tasksRes.data) ? tasksRes.data : []);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
        setMessage({ type: "error", text: "Could not fetch student data" });
      }
    };

    fetchStudent();
    return () => { mounted = false; };
  }, [setMessage]);

  return (
    <div>
      <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-2xl font-bold text-primary mb-4">
        Student Dashboard
      </motion.h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-[#071027] p-5 rounded-2xl shadow-sm">
          <h3 className="font-semibold text-textBody dark:text-gray-200 mb-3">Performance</h3>
          <AreaSpark data={performance} color="#1E3A8A" />
          <div className="mt-4">
            <h4 className="font-semibold text-textBody dark:text-gray-200 mb-2">Upcoming</h4>
            {loading ? (
              <div className="text-gray-500">Loading...</div>
            ) : upcoming.length ? (
              <ul className="space-y-2">
                {upcoming.map((u) => (
                  <li key={u.id} className="p-3 rounded-lg border border-gray-100 dark:border-gray-700">
                    <div className="font-medium">{u.title}</div>
                    <div className="text-xs text-gray-500">{u.due_date ? new Date(u.due_date).toLocaleDateString() : "No date"}</div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-gray-500">No upcoming tasks found.</div>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-[#071027] p-5 rounded-2xl shadow-sm">
          <h4 className="font-semibold text-textBody dark:text-gray-200 mb-3">Mentorship</h4>
          <div className="text-sm text-gray-500">Request a mentor or join study groups from the mentorship hub.</div>
        </div>
      </div>
    </div>
  );
}
