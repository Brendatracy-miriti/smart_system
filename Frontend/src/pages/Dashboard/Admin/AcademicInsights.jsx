import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import api from "../../../utils/api";
import { useMessage } from "../../../context/MessageContext";
import { TrendingUp, AlertTriangle, BookOpen } from "lucide-react";

export default function AcademicInsights() {
  const [loading, setLoading] = useState(true);
  const [subjectAverages, setSubjectAverages] = useState([]);
  const [classPerformance, setClassPerformance] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const { setMessage } = useMessage();

  const fetchInsights = async () => {
    setLoading(true);
    try {
      const [subjectRes, classRes, trendRes, alertRes] = await Promise.all([
        api.get("academics/subjects/averages/"),
        api.get("academics/classes/averages/"),
        api.get("academics/trends/"),
        api.get("academics/alerts/"),
      ]);

      setSubjectAverages(subjectRes.data || []);
      setClassPerformance(classRes.data || []);
      setTrendData(trendRes.data || []);
      setAlerts(alertRes.data || []);
    } catch (err) {
      console.error(err);
      setMessage({
        type: "error",
        text: "Failed to fetch academic insights. Check backend connection.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="p-6 space-y-6"
    >
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-primary">
            Academic Insights
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Analyze student performance across subjects and classes.
          </p>
        </div>
        <button
          onClick={fetchInsights}
          className="py-2 px-4 rounded-lg bg-primary text-white hover:bg-accent transition"
        >
          Refresh Data
        </button>
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-500 dark:text-gray-400">
          Loading academic analytics...
        </div>
      ) : (
        <>
          {/* Subject Average Chart */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-[#1F2937] p-5 rounded-2xl shadow"
          >
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="text-blue-500" />
              <h3 className="text-lg font-semibold text-textBody dark:text-gray-200">
                Average Performance per Subject
              </h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={subjectAverages}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="subject" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip />
                <Legend />
                <Bar dataKey="average_score" fill="#1E3A8A" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Performance Trend Chart */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-[#1F2937] p-5 rounded-2xl shadow"
          >
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="text-green-500" />
              <h3 className="text-lg font-semibold text-textBody dark:text-gray-200">
                Academic Trend (Last 6 Months)
              </h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="average_score"
                  stroke="#10B981"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Class Averages */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-[#1F2937] p-5 rounded-2xl shadow"
          >
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="text-indigo-500" />
              <h3 className="text-lg font-semibold text-textBody dark:text-gray-200">
                Average Scores per Class
              </h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={classPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="class_name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip />
                <Bar dataKey="average_score" fill="#38BDF8" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Alerts for low performance */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-[#1F2937] p-5 rounded-2xl shadow"
          >
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="text-red-500" />
              <h3 className="text-lg font-semibold text-textBody dark:text-gray-200">
                Students Requiring Attention
              </h3>
            </div>

            {alerts.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">
                No alerts at the moment — all students performing well 🎉
              </p>
            ) : (
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {alerts.map((a) => (
                  <li
                    key={a.id}
                    className="py-3 flex justify-between items-center text-sm text-gray-700 dark:text-gray-300"
                  >
                    <span>
                      <strong>{a.student_name}</strong> — {a.subject} ({a.score}%)
                    </span>
                    <span className="text-red-500">Needs Support</span>
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        </>
      )}
    </motion.div>
  );
}
