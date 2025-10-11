import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ClipboardList,
  Users,
  Calendar,
  MessageSquare,
  BarChart2,
  Settings,
  LogOut,
  BookOpen,
  Menu,
  X,
} from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../../../context/AuthContext";
import { useTheme } from "../../../context/ThemeContext";

export default function TeacherSidebar() {
  const [open, setOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/teacher" },
    { name: "Attendance", icon: Users, path: "/teacher/attendance" },
    { name: "Assignments", icon: ClipboardList, path: "/teacher/assignments" },
    { name: "Performance", icon: BarChart2, path: "/teacher/performance" },
    { name: "Messages", icon: MessageSquare, path: "/teacher/messages" },
    { name: "Timetable", icon: Calendar, path: "/teacher/timetable" },
    { name: "Mentorship", icon: BookOpen, path: "/teacher/mentorship-requests" },
    { name: "Settings", icon: Settings, path: "/teacher/settings" },
  ];

  return (
    <> 
    <div className="flex min-h-screen bg-[#F3F4F6] dark:bg-[#0F172A] text-[#111827] dark:text-gray-100">
      {/* Sidebar */}
      <motion.aside
        animate={{ width: open ? 230 : 70 }}
        transition={{ duration: 0.3 }}
        className="bg-[#0f172a] dark:bg-[#1E293B] flex flex-col justify-between shadow-lg z-50"
      >
        <div>
          {/* Top section */}
          <div className="flex items-center justify-between p-4 border-b border-blue-600">
            <h2
              className={`text-white font-bold text-lg transition-all duration-300 ${
                !open && "opacity-0 hidden"
              }`}
            >
              Edu-Guardian
            </h2>
            <button
              onClick={() => setOpen(!open)}
              className="text-white focus:outline-none"
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

          {/* Nav Links */}
          <nav className="mt-6 flex flex-col space-y-2">
            {navItems.map(({ name, icon: Icon, path }) => (
              <NavLink
                key={name}
                to={path}
                end
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2 text-sm rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-[#226eeb] text-white"
                      : "text-gray-200 hover:bg-[#38BDF8]/20"
                  }`
                }
              >
                <Icon size={20} />
                {open && <span>{name}</span>}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Bottom section */}
        <div className="flex flex-col gap-2 p-4 border-t border-blue-600">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 text-sm text-gray-200 rounded-lg hover:bg-red-600/80 transition-all"
          >
            <LogOut size={20} />
            {open && <span>Logout</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
    </>
  );
}
