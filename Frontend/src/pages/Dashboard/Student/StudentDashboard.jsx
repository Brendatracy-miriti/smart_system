// src/pages/Dashboard/Student/StudentDashboard.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ProgressRing from "../../../ui/ProgressRing";
import Papa from "papaparse";
import MiniCard from "../../../ui/MiniCard";
import { BookOpen, Clock, ClipboardList, BarChart2 } from "lucide-react";
import { useLive } from "../../../context/LiveContext";

export default function StudentDashboard() {
  const liveData = useLive();
  // Defensive: fallback to empty arrays if context is not ready
  const timetables = liveData?.timetables || [];
  const assignments = liveData?.assignments || [];
  const submissions = liveData?.submissions || [];
  const grades = liveData?.grades || [];
  const [profile, setProfile] = useState(null);
  const [upcoming, setUpcoming] = useState([]);
  const [dropoutRisk, setDropoutRisk] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("eg_current_user"));
    if (!user) return;

    // build profile object from local user and live data
    const userAssignments = assignments.filter(a => a.course === user.course);
    const completedCount = submissions.filter(s => s.userEmail === user.email).length;
    const myGrades = grades.filter(g => g.studentEmail === user.email);
    const gpa = myGrades.length ? (myGrades.reduce((s,x)=>s+Number(x.score||0),0)/myGrades.length).toFixed(2) : (user.gpa || "N/A");

    setProfile({
      name: user.name || "Student Name",
      avatar: user.avatarBase64 || user.photo || "https://i.pravatar.cc/100?img=3",
      course: user.course || "Course name",
      level: user.level || "Undergraduate",
      attendance_rate: user.attendance_rate || 85,
      average_score: user.average_score || 78,
      courses_count: user.courses_count || (user.course ? 1 : 0),
      completed_assignments: completedCount,
      gpa,
    });

    const myLessons = timetables.filter(t => t.course === user.course && t.approved).map(t => ({
      id: t.id, subject: t.subject, time: `${t.day}, ${t.time}`
    }));
    setUpcoming(myLessons);

    // Fetch and parse dropout data
    fetch("/Data/student_dropout_data.csv")
      .then(res => res.text())
      .then(csv => {
        Papa.parse(csv, {
          header: true,
          complete: (results) => {
            const studentRow = results.data.find(row => row.student_id === String(user.id));
            if (studentRow) {
              setDropoutRisk({
                risk: studentRow.dropout_risk === "1" ? "High" : "Low",
                percentage: studentRow.dropout_risk === "1" ? 80 : 20
              });
            } else {
              setDropoutRisk(null);
            }
          }
        });
      });
  }, [timetables, assignments, submissions, grades]);

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="space-y-6">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <img src={profile?.avatar} alt="Student Avatar" className="w-20 h-20 rounded-full border-4 border-blue-100 object-cover" />
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{profile?.name}</h2>
            <p className="text-gray-500 text-sm">{profile?.course}</p>
            <p className="text-gray-400 text-xs mt-1">Level: {profile?.level}</p>
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
          {dropoutRisk && (
            <div className="text-center">
              <ProgressRing percentage={dropoutRisk.percentage} color="#EF4444" />
              <p className="text-xs text-gray-500 mt-1">Dropout Risk: {dropoutRisk.risk}</p>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-md flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Total Courses</p>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{profile?.courses_count}</h3>
          </div>
          <BookOpen className="text-blue-500" size={32} />
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-md flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Completed Assignments</p>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{profile?.completed_assignments}</h3>
          </div>
          <ClipboardList className="text-emerald-500" size={32} />
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-md flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Current GPA</p>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{profile?.gpa}</h3>
          </div>
          <BarChart2 className="text-indigo-500" size={32} />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-md">
        <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-100 mb-4">Upcoming Lessons</h3>
        {upcoming.length ? (
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
        ) : (<p className="text-gray-500">No upcoming lessons for today.</p>)}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <MiniCard title="Assignments" description="View pending work" icon={ClipboardList} color="blue" />
        <MiniCard title="Grades" description="Check term results" icon={BarChart2} color="green" />
        <MiniCard title="Timetable" description="See daily schedule" icon={Clock} color="purple" />
      </div>

            {/* QUICK ACCESS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MiniCard
          title="Assignments"
          description="View pending work"
          icon={ClipboardList}
          color="blue"
        />
        <MiniCard
          title="Grades"
          description="Check term results"
          icon={BarChart2}
          color="green"
        />
        <MiniCard
          title="Timetable"
          description="See daily schedule"
          icon={Clock}
          color="purple"
        />
        <MiniCard
          title="Find Mentor"
          description="Connect with teachers"
          icon={BookOpen}
          color="emerald"
          link="/student/mentorship"
        />
      </div>
    </motion.div>
  );
}
