import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  Home,
  Users,
  Truck,
  DollarSign,
  Bell,
  BookOpen,
  Settings,
  LogOut,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Sidebar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  const links = [
    { to: "/admin/dashboard", label: "Overview", icon: Home },
    { to: "/admin/users", label: "Users", icon: Users },
    { to: "/admin/transport", label: "Transport", icon: Truck },
    { to: "/admin/funds", label: "Funds", icon: DollarSign },
    { to: "/admin/notifications", label: "Notifications", icon: Bell },
    { to: "/admin/academic-insights", label: "Insights", icon: BookOpen },
    { to: "/admin/settings", label: "Settings", icon: Settings },
  ];

  return (
    <>
      {/* Mobile topbar */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-white dark:bg-[#111827] shadow-md">
        <h1 className="text-lg font-bold text-primary">SmartEdu360</h1>
        <button
          onClick={() => setOpen(true)}
          className="text-gray-700 dark:text-gray-200"
        >
          <Menu size={26} />
        </button>
      </div>

      {/* Sidebar (Desktop) */}
      <aside className="hidden lg:flex flex-col w-64 bg-white dark:bg-[#111827] text-gray-800 dark:text-gray-200 min-h-screen shadow-lg">
        <div className="p-5">
          <h1 className="text-xl font-bold text-primary">SmartEdu360</h1>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? "bg-primary text-white"
                    : "hover:bg-gray-100 dark:hover:bg-gray-800"
                }`
              }
            >
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 w-full rounded-lg text-sm font-medium text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 transition"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Sidebar (Mobile Drawer) */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm lg:hidden"
          >
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              className="w-64 h-full bg-white dark:bg-[#111827] shadow-xl p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <h1 className="text-xl font-bold text-primary">SmartEdu360</h1>
                  <button
                    onClick={() => setOpen(false)}
                    className="text-gray-700 dark:text-gray-200"
                  >
                    <X size={22} />
                  </button>
                </div>

                <nav className="space-y-1">
                  {links.map(({ to, label, icon: Icon }) => (
                    <NavLink
                      key={to}
                      to={to}
                      onClick={() => setOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition ${
                          isActive
                            ? "bg-primary text-white"
                            : "hover:bg-gray-100 dark:hover:bg-gray-800"
                        }`
                      }
                    >
                      <Icon size={18} />
                      <span>{label}</span>
                    </NavLink>
                  ))}
                </nav>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 w-full rounded-lg text-sm font-medium text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 transition"
              >
                <LogOut size={18} />
                Logout
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
