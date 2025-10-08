import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../../../utils/api";
import { useMessage } from "../../../hooks/useMessage";

export default function Courses() {
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const { setMessage } = useMessage();

  useEffect(() => {
    let mounted = true;
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const res = await api.get("student/courses/");
        if (!mounted) return;
        setCourses(res.data || []);
      } catch (err) {
        console.error(err);
        setMessage({ type: "error", text: "Could not fetch courses." });
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
    return () => (mounted = false);
  }, [setMessage]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-3xl font-bold text-primary mb-2">My Courses</h2>
        <p className="text-gray-500 dark:text-gray-400">
          View and manage your enrolled courses.
        </p>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading courses...</p>
      ) : courses.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-md"
            >
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
                {course.name}
              </h3>
              <p className="text-gray-500 text-sm mb-4">{course.description}</p>
              <div className="text-sm text-gray-400">
                <p>Instructor: {course.instructor}</p>
                <p>Credits: {course.credits}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No courses enrolled yet.</p>
      )}
    </motion.div>
  );
}
