import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import { LiveProvider } from "./context/LiveContext";
import { AuthProvider } from "./context/AuthContext";
import { MessageProvider } from "./context/MessageContext";
import { ThemeProvider } from "./context/ThemeContext";
import { DataProvider } from "./context/DataContext";

import Login from "./pages/Login";
import Signup from "./pages/Signup";

// Admin
import AdminDashboard from "./pages/Dashboard/Admin/AdminDashboard";
import AcademicInsights from "./pages/Dashboard/Admin/AcademicInsights";
import AdminSettings from "./pages/Dashboard/Admin/Settings";

// Teacher
import TeacherSidebar from "./pages/Dashboard/Teacher/Sidebar";
import TeacherDashboard from "./pages/Dashboard/Teacher/TeacherDashboard";
import TeacherAssignments from "./pages/Dashboard/Teacher/Assignments";
import TeacherAttendance from "./pages/Dashboard/Teacher/Attendance";
import TeacherTimetable from "./pages/Dashboard/Teacher/Timetable";
import TeacherSettings from "./pages/Dashboard/Teacher/Settings";

// Parent
import ParentSidebar from "./pages/Dashboard/Parent/Sidebar";
import ParentDashboard from "./pages/Dashboard/Parent/ParentDashboard";
import ParentTransport from "./pages/Dashboard/Parent/Transport";
import ParentSettings from "./pages/Dashboard/Parent/Settings";

// Student
import StudentSidebar from "./pages/Dashboard/Student/Sidebar";
import StudentDashboard from "./pages/Dashboard/Student/StudentDashboard";
import StudentAssignments from "./pages/Dashboard/Student/Assignments";
import StudentGrades from "./pages/Dashboard/Student/Grades";
import StudentTimetable from "./pages/Dashboard/Student/Timetable";
import StudentSettings from "./pages/Dashboard/Student/Settings";

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Admin */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/academic-insights" element={<AcademicInsights />} />
        <Route path="/admin/settings" element={<AdminSettings />} />

        {/* Teacher */}
        <Route path="/teacher/*" element={<TeacherSidebar />}>
          <Route index element={<TeacherDashboard />} />
          <Route path="assignments" element={<TeacherAssignments />} />
          <Route path="attendance" element={<TeacherAttendance />} />
          <Route path="timetable" element={<TeacherTimetable />} />
          <Route path="settings" element={<TeacherSettings />} />
        </Route>

        {/* Parent */}
        <Route path="/parent/*" element={<ParentSidebar />}>
          <Route index element={<ParentDashboard />} />
          <Route path="transport" element={<ParentTransport />} />
          <Route path="settings" element={<ParentSettings />} />
        </Route>

        {/* Student */}
        <Route path="/student/*" element={<StudentSidebar />}>
          <Route index element={<StudentDashboard />} />
          <Route path="assignments" element={<StudentAssignments />} />
          <Route path="grades" element={<StudentGrades />} />
          <Route path="timetable" element={<StudentTimetable />} />
          <Route path="settings" element={<StudentSettings />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <LiveProvider>
        <ThemeProvider>
          <MessageProvider>
            <AuthProvider>
              <DataProvider>
                <AnimatedRoutes />
              </DataProvider>
            </AuthProvider>
          </MessageProvider>
        </ThemeProvider>
      </LiveProvider>
    </BrowserRouter>
  );
}
