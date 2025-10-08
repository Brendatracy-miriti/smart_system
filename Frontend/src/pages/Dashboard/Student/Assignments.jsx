import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ClipboardList, Clock } from "lucide-react";
import api from "../../../utils/api";
import { useMessage } from "../../../context/MessageContext";

export default function Assignments() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { setMessage } = useMessage();

  useEffect(() => {
    let mounted = true;
    const fetchAssignments = async () => {
      setLoading(true);
      try {
        const res = await api.get("student/assignments/");
        if (!mounted) return;
        setAssignments(res.data || []);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setMessage({ type: "error", text: "Could not fetch assignments." });
        setLoading(false);
      }
    };
    fetchAssignments();
    return () => (mounted = false);
  }, [setMessage]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
      <h2 className="text-2xl font-bold text-blue-600 mb-4">My Assignments</h2>

      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6">
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : assignments.length ? (
          <ul className="space-y-3">
            {assignments.map((a) => (
              <li
                key={a.id}
                className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-2"
              >
                <div>
                  <p className="font-medium text-gray-800 dark:text-gray-200">{a.title}</p>
                  <p className="text-sm text-gray-500">{a.subject}</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Clock size={16} /> {a.due_date ? new Date(a.due_date).toLocaleDateString() : "N/A"}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No assignments found.</p>
        )}
      </div>
    </motion.div>
  );
}
