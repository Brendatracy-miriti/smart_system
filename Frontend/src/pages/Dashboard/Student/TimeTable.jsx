import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../../../utils/api";
import { useMessage } from "../../../context/MessageContext";

export default function Timetable() {
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(true);
  const { setMessage } = useMessage();

  useEffect(() => {
    let mounted = true;
    const fetchTimetable = async () => {
      try {
        const res = await api.get("student/timetable/");
        if (!mounted) return;
        setTimetable(res.data || []);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setMessage({ type: "error", text: "Could not fetch timetable." });
        setLoading(false);
      }
    };
    fetchTimetable();
    return () => (mounted = false);
  }, [setMessage]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
      <h2 className="text-2xl font-bold text-blue-600 mb-4">My Timetable</h2>

      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6">
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : timetable.length ? (
          <table className="w-full text-sm text-gray-700 dark:text-gray-300">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <th className="py-2">Day</th>
                <th className="py-2">Subject</th>
                <th className="py-2">Time</th>
              </tr>
            </thead>
            <tbody>
              {timetable.map((item, i) => (
                <tr key={i} className="border-b border-gray-50 dark:border-gray-800">
                  <td className="py-2">{item.day}</td>
                  <td className="py-2">{item.subject}</td>
                  <td className="py-2">{item.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500">No timetable entries yet.</p>
        )}
      </div>
    </motion.div>
  );
}
