import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../../../utils/api";
import { useMessage } from "../../../hooks/useMessage";

export default function Grades() {
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const { setMessage } = useMessage();

  useEffect(() => {
    let mounted = true;
    const fetchGrades = async () => {
      try {
        const res = await api.get("student/grades/");
        if (!mounted) return;
        setGrades(res.data || []);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setMessage({ type: "error", text: "Failed to fetch grades." });
        setLoading(false);
      }
    };
    fetchGrades();
    return () => (mounted = false);
  }, [setMessage]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
      <h2 className="text-2xl font-bold text-blue-600 mb-4">My Grades</h2>

      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6">
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : grades.length ? (
          <table className="w-full text-sm text-left text-gray-700 dark:text-gray-300">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <th className="py-2">Subject</th>
                <th className="py-2">Grade</th>
                <th className="py-2">Term</th>
              </tr>
            </thead>
            <tbody>
              {grades.map((g) => (
                <tr key={g.id} className="border-b border-gray-50 dark:border-gray-800">
                  <td className="py-2">{g.subject}</td>
                  <td className="py-2 font-semibold">{g.grade}</td>
                  <td className="py-2">{g.term}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500">No grades available yet.</p>
        )}
      </div>
    </motion.div>
  );
}
