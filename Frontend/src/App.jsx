import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { AnimatePresence } from "framer-motion";

// auth pages
import Login from "./pages/Login";
import Signup from "./pages/Signup";

// dashboards + layout
import DashboardLayout from "./components/DashboardLayout";
import AdminDashboard from "./pages/Dashboard/AdminDashboard";
import TeacherDashboard from "./pages/Dashboard/TeacherDashboard";
import ParentDashboard from "./pages/Dashboard/ParentDashboard";
import StudentDashboard from "./pages/Dashboard/StudentDashboard";

// contexts
import { MessageProvider } from "./context/MessageContext";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* auth routes */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* dashboard routes */}
        <Route element={<DashboardLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
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
