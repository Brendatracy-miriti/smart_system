import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sun,
  Moon,
  LogOut,
  Home,
  BookOpen,
  Award,
  Calendar,
  Settings,
  Menu,
  X,
} from "lucide-react";
import { useTheme } from "../../../context/ThemeContext";
import { useAuth } from "../../../context/AuthContext";

export default function StudentSidebar() {
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  const links = [
    { to: "/student", label: "Dashboard", icon: Home },
    { to: "/student/assignments", label: "Assignments", icon: BookOpen },
    { to: "/student/grades", label: "Grades", icon: Award },
    { to: "/student/courses", label: "Courses", icon: Calendar },
    { to: "/student/settings", label: "Settings", icon: Settings },
  ];

  return (
  <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Desktop Sidebar */}
      <motion.aside
        animate={{ width: open ? 230 : 70 }}
        transition={{ duration: 0.3 }}
        className="hidden md:flex bg-[#0f172a] flex-col justify-between shadow-lg z-50 min-h-screen"
      >
        <div>
          {/* Top Section */}
          <div className="flex items-center justify-between p-4 border-b border-blue-600">
            <h2 className={`text-white font-bold text-lg transition-all duration-300 ${!open && "opacity-0 hidden"}`}>
              Edu-Guardian
            </h2>
            <button onClick={() => setOpen(!open)} className="text-white focus:outline-none">
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="mt-6 flex-1 flex flex-col space-y-2 px-2 overflow-y-auto">
            {links.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2 text-sm rounded-lg transition-all duration-200 ${
                    isActive ? "bg-[#226eeb] text-white" : "text-gray-200 hover:bg-[#38BDF8]/20"
                  }`
                }
              >
                <Icon size={20} />
                {open && <span>{label}</span>}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Bottom Section */}
        {/* Bottom Section */}
<div className="px-4 border-t border-blue-600 mt-auto mb-4 flex flex-col gap-2">
  <button
    onClick={handleLogout}
    className=" items-center gap-3 px-4 py-2 w-full text-sm text-gray-200 rounded-lg hover:bg-red-600/80 transition-all"
  >
    <LogOut size={20} />
    {open && <span>Logout</span>}
  </button>
</div>

      </motion.aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/50 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              className="fixed top-0 left-0 h-full bg-[#0f172a] z-50 flex flex-col justify-between w-64 shadow-lg"
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ duration: 0.3 }}
            >
              <div>
                <div className="flex items-center justify-between p-4 border-b border-blue-600">
                  <h2 className="text-white font-bold text-lg">Edu-Guardian</h2>
                  <button onClick={() => setMobileOpen(false)} className="text-white focus:outline-none">
                    <X size={22} />
                  </button>
                </div>
                <nav className="mt-6 flex flex-col space-y-2 px-2">
                  {links.map(({ to, label, icon: Icon }) => (
                    <NavLink
                      key={to}
                      to={to}
                      end
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-2 text-sm rounded-lg transition-all duration-200 ${
                          isActive ? "bg-[#226eeb] text-white" : "text-gray-200 hover:bg-[#38BDF8]/20"
                        }`
                      }
                      onClick={() => setMobileOpen(false)}
                    >
                      <Icon size={20} />
                      <span>{label}</span>
                    </NavLink>
                  ))}
                </nav>
              </div>

              <div className="px-4 border-t border-blue-600 mt-auto mb-4 flex flex-col gap-2">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-2 text-sm text-gray-200 rounded-lg hover:bg-red-600/80 transition-all"
                >
                  <LogOut size={20} />
                  Logout
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className={`flex-1 p-6 overflow-y-auto transition-all duration-300 relative`}>
        {/* Mobile menu toggle button */}
        <button
          className="md:hidden mb-4 text-gray-900 dark:text-gray-100"
          onClick={() => setMobileOpen(true)}
        >
          <Menu size={24} />
        </button>
        <Outlet />
      </main>
    </div>
  );
}
