import React, { useState } from "react";
import { NavLink, useNavigate, Outlet } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
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
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Sidebar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const { logout } = useAuth();
  const handleLogout = () => {
    logout();
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Mobile topbar */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-white dark:bg-[#111827] shadow-md">
        <h1 className="text-lg font-bold text-primary">Edu-Guardian</h1>
        <button
          onClick={() => setOpen(true)}
          className="text-gray-700 dark:text-gray-200"
        >
          <Menu size={26} />
        </button>
      </div>

      <div className="flex">
        {/* Sidebar (Desktop) */}
        <aside
          className={`hidden lg:flex flex-col bg-white dark:bg-[#111827] text-gray-800 dark:text-gray-200 min-h-screen shadow-lg transition-all duration-200 ${
            collapsed ? "w-20" : "w-64"
          }`}
        >
          <div className="p-4 flex items-center justify-between">
            <h1 className={`text-xl font-bold text-primary transition-opacity ${collapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
              Edu-Guardian
            </h1>
            <button
              onClick={() => setCollapsed((s) => !s)}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              className="text-gray-600 dark:text-gray-200 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 z-50"
              title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>
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
                <span className={`${collapsed ? "hidden" : "block"}`}>{label}</span>
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

        {/* Main content area where child routes render */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>

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
                  <h1 className="text-xl font-bold text-primary">Edu-Guardian</h1>
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
    </div>
  );
}
