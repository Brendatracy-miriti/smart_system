import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

// Auth pages
import Login from "./pages/Login";
import Signup from "./pages/Signup";

// Layouts & dashboards
import DashboardLayout from "./components/DashboardLayout";
import AdminDashboard from "./pages/Dashboard/Admin/AdminDashboard";
import Funds from "./pages/Dashboard/Admin/Funds";
import Notifications from "./pages/Dashboard/Admin/Notifications";
import AcademicInsights from "./pages/Dashboard/Admin/AcademicInsights";
import Settings from "./pages/Dashboard/Admin/Settings";
import Users from "./pages/Dashboard/Admin/Users";
import Transport from "./pages/Dashboard/Admin/Transport";
import TeacherDashboard from "./pages/Dashboard/TeacherDashboard";
import ParentDashboard from "./pages/Dashboard/ParentDashboard";
import StudentDashboard from "./pages/Dashboard/StudentDashboard";

// Contexts
import { MessageProvider } from "./context/MessageContext";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Auth routes */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Admin dashboard routes */}
        <Route element={<DashboardLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<Users />} />
          <Route path="/admin/transport" element={<Transport />} />
          <Route path="/admin/funds" element={<Funds />} />
          <Route path="/admin/notifications" element={<Notifications />} />
          <Route path="/admin/academic-insights" element={<AcademicInsights />} />
          <Route path="/admin/settings" element={<Settings />} />

          {/* Other roles */}
          <Route path="/teacher" element={<TeacherDashboard />} />
          <Route path="/parent" element={<ParentDashboard />} />
          <Route path="/student" element={<StudentDashboard />} />
        </Route>
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
