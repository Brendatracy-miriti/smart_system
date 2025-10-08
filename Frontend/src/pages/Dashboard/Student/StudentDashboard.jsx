import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../../../utils/api";
import { useMessage } from "../../../context/MessageContext";
import ProgressRing from "../../../ui/ProgressRing";
import MiniCard from "../../../ui/MiniCard";
import { BookOpen, Clock, ClipboardList } from "lucide-react";

export default function StudentDashboard() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [upcoming, setUpcoming] = useState([]);
  const { setMessage } = useMessage();

  useEffect(() => {
    let mounted = true;
    const fetchStudentData = async () => {
      setLoading(true);
      try {
        const [profileRes, upcomingRes] = await Promise.all([
          api.get("student/me/"),
          api.get("student/upcoming/"),
        ]);
        if (!mounted) return;
        setProfile(profileRes.data);
        setUpcoming(upcomingRes.data || []);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setMessage({ type: "error", text: "Could not fetch student dashboard data." });
        setLoading(false);
      }
    };
    fetchStudentData();
    return () => (mounted = false);
  }, [setMessage]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-blue-600">Welcome back 👋</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Here’s your progress overview for today.
        </p>
      </div>

      {/* Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-md flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Attendance</p>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
              {profile?.attendance_rate ?? "--"}%
            </h3>
          </div>
          <ProgressRing percentage={profile?.attendance_rate || 0} color="#3B82F6" />
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-md flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Average Score</p>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
              {profile?.average_score ?? "--"}%
            </h3>
          </div>
          <ProgressRing percentage={profile?.average_score || 0} color="#10B981" />
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-md flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Courses</p>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
              {profile?.courses_count ?? 0}
            </h3>
          </div>
          <BookOpen className="text-blue-500" size={32} />
        </div>
      </div>

      {/* Upcoming Lessons */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-md">
        <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-100 mb-4">
          Upcoming Lessons
        </h3>
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : upcoming.length ? (
          <ul className="space-y-3">
            {upcoming.map((lesson) => (
              <li key={lesson.id} className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-2">
                <div>
                  <p className="font-medium text-gray-800 dark:text-gray-200">{lesson.subject}</p>
                  <p className="text-sm text-gray-500">{lesson.time}</p>
                </div>
                <Clock className="text-blue-500" size={18} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No upcoming lessons for today.</p>
        )}
      </div>

      {/* Quick Access */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <MiniCard title="Assignments" description="View pending work" icon={ClipboardList} color="blue" />
        <MiniCard title="Grades" description="Check term results" icon={BarChart2} color="green" />
        <MiniCard title="Timetable" description="See daily schedule" icon={Clock} color="purple" />
      </div>
    </motion.div>
  );
}
