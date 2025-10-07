import React, { useEffect, useState } from "react";

import { motion } from "framer-motion";
import api from "../../utils/api";
import { useMessage } from "../../hooks/useMessage";
import AreaSpark from "../../components/AreaSpark";

export default function TeacherDashboard() {
  const [loading, setLoading] = useState(true);
  const [classes, setClasses] = useState([]); // expected from backend: classes list
  const [studentsPerformance, setStudentsPerformance] = useState([]);
  const { setMessage } = useMessage();

  useEffect(() => {
    let mounted = true;
    const fetchTeacherData = async () => {
      setLoading(true);
      try {
        // endpoints depend on backend — adjust as needed
        const [classesRes, perfRes] = await Promise.all([
          api.get("classes/"), // expected: teacher's classes
          api.get("students/performance/"), // expected: list of {label, value}
        ]);
        if (!mounted) return;
        setClasses(Array.isArray(classesRes.data) ? classesRes.data : []);
        setStudentsPerformance(Array.isArray(perfRes.data) ? perfRes.data : []);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        console.error(err);
        setMessage({ type: "error", text: "Could not fetch teacher data" });
      }
    };

    fetchTeacherData();
    return () => { mounted = false; };
  }, [setMessage]);

  return (
    <div>
      <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-2xl font-bold text-primary mb-4">
        Teacher Dashboard
      </motion.h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-[#071027] p-5 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-textBody dark:text-gray-200">Class performance</h3>
            <div className="text-sm text-gray-500 dark:text-gray-400">Overview</div>
          </div>

          <AreaSpark data={studentsPerformance} color="#38BDF8" />
        </div>

        <div className="bg-white dark:bg-[#071027] p-5 rounded-2xl shadow-sm">
          <h3 className="font-semibold text-textBody dark:text-gray-200 mb-3">My classes</h3>
          {loading ? (
            <div className="text-gray-500">Loading classes...</div>
          ) : classes.length ? (
            <ul className="space-y-2">
              {classes.map((c) => (
                <li key={c.id} className="p-2 rounded-md border border-gray-100 dark:border-gray-700">
                  <div className="font-medium">{c.name}</div>
                  <div className="text-sm text-gray-500">{c.schedule || c.section}</div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-gray-500">No classes assigned yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}
