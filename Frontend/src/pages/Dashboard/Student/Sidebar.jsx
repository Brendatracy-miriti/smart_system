import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import { Sun, Moon, LogOut, Home, BookOpen, Award, Calendar, Settings, Menu } from "lucide-react";
import { useTheme } from "../../../context/ThemeContext";

export default function StudentSidebar() {
  const [open, setOpen] = useState(true);
  const { theme, toggleTheme } = useTheme();

  const links = [
    { to: "/student", label: "Dashboard", icon: Home },
    { to: "/student/assignments", label: "Assignments", icon: BookOpen },
    { to: "/student/grades", label: "Grades", icon: Award },
    { to: "/student/timetable", label: "Timetable", icon: Calendar },
    { to: "/student/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-[#0D1117]">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className={`${
          open ? "w-64" : "w-20"
        } bg-white dark:bg-[#1F2937] p-4 shadow-lg flex flex-col justify-between transition-all`}
      >
        <div>
          <div className="flex items-center gap-2 mb-6">
            <button
              onClick={() => setOpen((s) => !s)}
              aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
              className="text-gray-500 dark:text-gray-300 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
              title={open ? "Collapse sidebar" : "Expand sidebar"}
            >
              <Menu size={22} />
            </button>
            {open && <span className="text-lg font-bold text-primary ml-2">Edu-Guardian</span>}
          </div>
          <nav className="space-y-2">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md text-sm font-medium ${
                    isActive
                      ? "bg-primary text-white"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`
                }
              >
                {open ? link.label : <link.icon size={18} />}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="space-y-3">
          <button
            onClick={toggleTheme}
            className="w-full flex items-center justify-center gap-2 text-gray-600 dark:text-gray-300"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            {open && (theme === "dark" ? "Light Mode" : "Dark Mode")}
          </button>

          <button
            onClick={() => {
              localStorage.removeItem("currentUser");
              window.location.href = "/login";
            }}
            className="w-full flex items-center justify-center gap-2 text-red-500 hover:text-red-600"
          >
            <LogOut size={18} />
            {open && "Logout"}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
