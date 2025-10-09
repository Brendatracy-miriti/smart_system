import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

// Contexts
import { DataProvider } from "./context/DataContext";
import { MessageProvider } from "./context/MessageContext";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { LiveProvider } from "./context/LiveContext";

// Pages / Dashboards / Layouts
import Login from "./pages/Login";
import Signup from "./pages/Signup";

// Admin
import AdminDashboard from "./pages/Dashboard/Admin/AdminDashboard";
import Users from "./pages/Dashboard/Admin/Users";
import Funds from "./pages/Dashboard/Admin/Funds";
import Notifications from "./pages/Dashboard/Admin/Notifications";
import AcademicInsights from "./pages/Dashboard/Admin/AcademicInsights";
import AdminSettings from "./pages/Dashboard/Admin/Settings";

// Teacher
import TeacherSidebar from "./pages/Dashboard/Teacher/Sidebar";
import TeacherDashboard from "./pages/Dashboard/Teacher/TeacherDashboard";
import Attendance from "./pages/Dashboard/Teacher/Attendance";
import Assignments from "./pages/Dashboard/Teacher/Assignments";
import TeacherPerformance from "./pages/Dashboard/Teacher/Performance";
import TeacherMessages from "./pages/Dashboard/Teacher/Messages";
import Timetable from "./pages/Dashboard/Teacher/Timetable";
import TeacherSettings from "./pages/Dashboard/Teacher/Settings";

// Parent
import ParentSidebar from "./pages/Dashboard/Parent/Sidebar";
import ParentDashboard from "./pages/Dashboard/Parent/ParentDashboard";
import ParentPerformance from "./pages/Dashboard/Parent/Performance";
import ParentMessages from "./pages/Dashboard/Parent/Messages";
import ParentSettings from "./pages/Dashboard/Parent/Settings";
import Transport from "./pages/Transport/Transport";

// Student
import StudentDashboard from "./pages/Dashboard/Student/StudentDashboard";

// UI / Extras
import ThemeToggle from "./ui/ThemeToggle";
import MentorshipList from "./pages/Mentorship/MentorshipList";
import MentorshipRequests from "./pages/Mentorship/MentorshipRequests";

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Auth */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Admin */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<Users />} />
        <Route path="/admin/funds" element={<Funds />} />
        <Route path="/admin/notifications" element={<Notifications />} />
        <Route path="/admin/academic-insights" element={<AcademicInsights />} />
        <Route path="/admin/settings" element={<AdminSettings />} />

        {/* Teacher */}
        <Route path="/teacher/*" element={<TeacherSidebar />}>
          <Route index element={<TeacherDashboard />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="assignments" element={<Assignments />} />
          <Route path="performance" element={<TeacherPerformance />} />
          <Route path="messages" element={<TeacherMessages />} />
          <Route path="timetable" element={<Timetable />} />
          <Route path="mentorship-requests" element={<MentorshipRequests />} />
          <Route path="settings" element={<TeacherSettings />} />
        </Route>

        {/* Parent */}
        <Route path="/parent/*" element={<ParentSidebar />}>
          <Route index element={<ParentDashboard />} />
          <Route path="performance" element={<ParentPerformance />} />
          <Route path="messages" element={<ParentMessages />} />
          <Route path="transport" element={<Transport />} />
          <Route path="settings" element={<ParentSettings />} />
        </Route>

        {/* Student */}
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/student/mentorship" element={<MentorshipList />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <DataProvider>
        <ThemeProvider>
          <MessageProvider>
            <AuthProvider>
              <LiveProvider>
                <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 relative">
                  {/* Theme toggle always visible */}
                  <div className="absolute top-4 right-4 z-50">
                    <ThemeToggle />
                  </div>

                  <AnimatedRoutes />
                </div>
              </LiveProvider>
            </AuthProvider>
          </MessageProvider>
        </ThemeProvider>
      </DataProvider>
    </BrowserRouter>
  );
}
