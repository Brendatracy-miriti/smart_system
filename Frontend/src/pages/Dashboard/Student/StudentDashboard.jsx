import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../../../utils/api";
import { useMessage } from "../../../hooks/useMessage";
import ProgressRing from "../../../ui/ProgressRing";
import MiniCard from "../../../ui/MiniCard";
import { BookOpen, Clock, ClipboardList, BarChart2 } from "lucide-react";

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
      {/* ================= PROFILE HEADER ================= */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <img
            src={profile?.avatar || "https://i.pravatar.cc/100?img=3"}
            alt="Student Avatar"
            className="w-20 h-20 rounded-full border-4 border-blue-100 object-cover"
          />
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              {profile?.name || "Student Name"}
            </h2>
            <p className="text-gray-500 text-sm">{profile?.course || "Course name"}</p>
            <p className="text-gray-400 text-xs mt-1">
              Level: {profile?.level || "Undergraduate"}
            </p>
          </div>
        </div>

        <div className="mt-4 md:mt-0 flex gap-4">
          <div className="text-center">
            <ProgressRing percentage={profile?.attendance_rate || 85} color="#3B82F6" />
            <p className="text-xs text-gray-500 mt-1">Attendance</p>
          </div>
          <div className="text-center">
            <ProgressRing percentage={profile?.average_score || 78} color="#10B981" />
            <p className="text-xs text-gray-500 mt-1">Avg Score</p>
          </div>
        </div>
      </div>

      {/* ================= STAT CARDS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-md flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Total Courses</p>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
              {profile?.courses_count ?? 6}
            </h3>
          </div>
          <BookOpen className="text-blue-500" size={32} />
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-md flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Completed Assignments</p>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
              {profile?.completed_assignments ?? 15}
            </h3>
          </div>
          <ClipboardList className="text-emerald-500" size={32} />
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-md flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Current GPA</p>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
              {profile?.gpa ?? "3.8"}
            </h3>
          </div>
          <BarChart2 className="text-indigo-500" size={32} />
        </div>
      </div>

      {/* ================= UPCOMING LESSONS ================= */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-md">
        <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-100 mb-4">
          Upcoming Lessons
        </h3>
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : upcoming.length ? (
          <ul className="space-y-3">
            {upcoming.map((lesson) => (
              <li
                key={lesson.id}
                className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-2"
              >
                <div>
                  <p className="font-medium text-gray-800 dark:text-gray-200">
                    {lesson.subject}
                  </p>
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

      {/* ================= QUICK ACCESS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <MiniCard title="Assignments" description="View pending work" icon={ClipboardList} color="blue" />
        <MiniCard title="Grades" description="Check term results" icon={BarChart2} color="green" />
        <MiniCard title="Timetable" description="See daily schedule" icon={Clock} color="purple" />
      </div>
    </motion.div>
  );
}
