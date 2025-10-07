import React, { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import { Sun, Moon, Menu, X } from "lucide-react";

export default function DashboardLayout() {
  const [open, setOpen] = useState(true);
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const links = [
    { name: "Admin", path: "/admin" },
    { name: "Teacher", path: "/teacher" },
    { name: "Parent", path: "/parent" },
    { name: "Student", path: "/student" },
  ];

  return (
    <div
      className={`min-h-screen flex transition-colors duration-300 ${
        theme === "dark"
          ? "bg-[#111827] text-white"
          : "bg-[#F3F4F6] text-[#111827]"
      }`}
    >
      {/* Sidebar */}
      <motion.aside
        animate={{ width: open ? 230 : 70 }}
        transition={{ duration: 0.3 }}
        className={`h-screen flex flex-col border-r ${
          theme === "dark" ? "border-gray-700" : "border-gray-200"
        }`}
      >
        <div className="flex items-center justify-between p-4">
          <h1
            className={`font-bold text-lg ${
              open ? "block" : "hidden"
            } text-primary`}
          >
            SmartEdu360
          </h1>
          <button
            onClick={() => setOpen(!open)}
            className="text-accent hover:text-primary"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        <nav className="mt-6 flex-1">
          {links.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`block px-5 py-3 rounded-lg m-2 text-sm font-medium transition-colors duration-200 ${
                location.pathname === link.path
                  ? "bg-primary text-white"
                  : "hover:bg-accent/30"
              }`}
            >
              {open ? link.name : link.name.charAt(0)}
            </Link>
          ))}
        </nav>

        <div className="p-4 flex justify-center">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-accent hover:bg-primary text-white transition"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}
