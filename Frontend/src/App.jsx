import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

// Auth Pages
import Login from "./pages/Login";
import Signup from "./pages/Signup";

// Admin Section
import AdminDashboard from "./pages/Dashboard/Admin/AdminDashboard";
import Users from "./pages/Dashboard/Admin/Users";
import Transport from "./pages/Dashboard/Admin/Transport";
import Funds from "./pages/Dashboard/Admin/Funds";
import Notifications from "./pages/Dashboard/Admin/Notifications";
import AcademicInsights from "./pages/Dashboard/Admin/AcademicInsights";
import AdminSettings from "./pages/Dashboard/Admin/Settings";

// Teacher Section
import TeacherSidebar from "./pages/Dashboard/Teacher/Sidebar";
import TeacherDashboard from "./pages/Dashboard/Teacher/TeacherDashboard";
import Attendance from "./pages/Dashboard/Teacher/Attendance";
import Assignments from "./pages/Dashboard/Teacher/Assignments";
import TeacherPerformance from "./pages/Dashboard/Teacher/Performance";
import TeacherMessages from "./pages/Dashboard/Teacher/Messages";
import Timetable from "./pages/Dashboard/Teacher/Timetable";
import TeacherSettings from "./pages/Dashboard/Teacher/Settings";

// Parent Section
import ParentSidebar from "./pages/Dashboard/Parent/Sidebar";
import ParentDashboard from "./pages/Dashboard/Parent/ParentDashboard";
import ParentPerformance from "./pages/Dashboard/Parent/Performance";
import ParentTransport from "./pages/Dashboard/Parent/Transport";
import ParentMessages from "./pages/Dashboard/Parent/Messages";
import Payments from "./pages/Dashboard/Parent/Payments";
import ParentSettings from "./pages/Dashboard/Parent/Settings";

// Student Section
import StudentDashboard from "./pages/Dashboard/Student/StudentDashboard";

// Contexts
import { MessageProvider } from "./context/MessageContext";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>

        {/* Auth Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* ==================== ADMIN SECTION ==================== */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<Users />} />
        <Route path="/admin/transport" element={<Transport />} />
        <Route path="/admin/funds" element={<Funds />} />
        <Route path="/admin/notifications" element={<Notifications />} />
        <Route path="/admin/academic-insights" element={<AcademicInsights />} />
        <Route path="/admin/settings" element={<AdminSettings />} />

        {/* ==================== TEACHER SECTION ==================== */}
        <Route path="/teacher/*" element={<TeacherSidebar />}>
          <Route index element={<TeacherDashboard />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="assignments" element={<Assignments />} />
          <Route path="performance" element={<TeacherPerformance />} />
          <Route path="messages" element={<TeacherMessages />} />
          <Route path="timetable" element={<Timetable />} />
          <Route path="settings" element={<TeacherSettings />} />
        </Route>

        {/* ==================== PARENT SECTION ==================== */}
        <Route path="/parent/*" element={<ParentSidebar />}>
          <Route index element={<ParentDashboard />} />
          <Route path="performance" element={<ParentPerformance />} />
          <Route path="transport" element={<ParentTransport />} />
          <Route path="messages" element={<ParentMessages />} />
          <Route path="payments" element={<Payments />} />
          <Route path="settings" element={<ParentSettings />} />
        </Route>

        {/* ==================== STUDENT SECTION ==================== */}
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
