import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { Home, Truck, MessageCircle, Settings, Menu, X, LogOut } from "lucide-react";
import { motion } from "framer-motion";

export default function ParentSidebar() {
  const [open, setOpen] = useState(() => {
    try {
      const v = localStorage.getItem("parent_sidebar_open");
      return v === null ? true : v === "true";
    } catch (e) {
      return true;
    }
  });
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const links = [
    { to: "/parent", label: "Dashboard", icon: Home },
    { to: "/parent/transport", label: "Transport", icon: Truck },
    { to: "/parent/messages", label: "Messages", icon: MessageCircle },
    { to: "/parent/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <motion.aside
        animate={{ width: open ? 256 : 72 }}
        transition={{ duration: 0.25 }}
        className="bg-[#0f172a] text-white p-4 flex flex-col min-h-screen shadow-lg z-50"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className={`text-white font-bold text-lg transition-all duration-300 ${!open && "opacity-0 hidden"}`}>
            Edu-Guardian
          </h2>
          <button
            onClick={() => {
              const next = !open;
              try {
                localStorage.setItem("parent_sidebar_open", String(next));
              } catch (e) {}
              setOpen(next);
            }}
            className="text-white"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="space-y-2 flex-1">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded ${
                    isActive ? "bg-[#226eeb] text-white" : "text-gray-200 hover:bg-[#38BDF8]/20"
                  }`
              }
            >
              <Icon size={18} />
              {open && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto">
          <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2 mb-2 text-sm text-red-600 dark:text-red-400 rounded hover:bg-gray-100 dark:hover:bg-[#111827] w-full">
            <LogOut size={18} />
            {open && <span>Logout</span>}
          </button>
        </div>
      </motion.aside>

      <main className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
