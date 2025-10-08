import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import Login from "./pages/Login";
import Signup from "./pages/Signup";

import AdminDashboard from "./pages/Dashboard/Admin/AdminDashboard";
import Users from "./pages/Dashboard/Admin/Users";
import Transport from "./pages/Dashboard/Admin/Transport";
import Funds from "./pages/Dashboard/Admin/Funds";
import Notifications from "./pages/Dashboard/Admin/Notifications";
import AcademicInsights from "./pages/Dashboard/Admin/AcademicInsights";
import Settings from "./pages/Dashboard/Admin/Settings";

import TeacherSidebar from "./pages/Dashboard/Teacher/Sidebar";
import TeacherDashboard from "./pages/Dashboard/Teacher/TeacherDashboard";
import Attendance from "./pages/Dashboard/Teacher/Attendance";
import Assignments from "./pages/Dashboard/Teacher/Assignments";
import Performance from "./pages/Dashboard/Teacher/Performance";
import Messages from "./pages/Dashboard/Teacher/Messages";
import Timetable from "./pages/Dashboard/Teacher/Timetable";
import TeacherSettings from "./pages/Dashboard/Teacher/Settings";

import ParentDashboard from "./pages/Dashboard/Parent/ParentDashboard";
import StudentDashboard from "./pages/Dashboard/Student/StudentDashboard";

import { MessageProvider } from "./context/MessageContext";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Admin Section */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<Users />} />
        <Route path="/admin/transport" element={<Transport />} />
        <Route path="/admin/funds" element={<Funds />} />
        <Route path="/admin/notifications" element={<Notifications />} />
        <Route path="/admin/academic-insights" element={<AcademicInsights />} />
        <Route path="/admin/settings" element={<Settings />} />

        {/* Teacher Section */}
        <Route path="/teacher/*" element={<TeacherSidebar />}>
          <Route index element={<TeacherDashboard />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="assignments" element={<Assignments />} />
          <Route path="performance" element={<Performance />} />
          <Route path="messages" element={<Messages />} />
          <Route path="timetable" element={<Timetable />} />
          <Route path="settings" element={<TeacherSettings />} />
        </Route>

        {/* Other roles */}
        <Route path="/parent" element={<ParentDashboard />} />
        <Route path="/student" element={<StudentDashboard />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <MessageProvider>
          <AuthProvider>
            <AnimatedRoutes />
          </AuthProvider>
        </MessageProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
