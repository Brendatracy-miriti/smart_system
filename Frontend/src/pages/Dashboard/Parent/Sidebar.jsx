import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Home, BarChart3, Bus, MessageSquare, CreditCard, Settings, LogOut, Menu, X } from "lucide-react";
import { useTheme } from "../../../hooks/useTheme";

export default function ParentSidebar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const links = [
    { to: "/parent", icon: <Home size={18} />, label: "Dashboard" },
    { to: "/parent/performance", icon: <BarChart3 size={18} />, label: "Performance" },
    { to: "/parent/transport", icon: <Bus size={18} />, label: "Transport" },
    { to: "/parent/messages", icon: <MessageSquare size={18} />, label: "Messages" },
    { to: "/parent/payments", icon: <CreditCard size={18} />, label: "Payments" },
    { to: "/parent/settings", icon: <Settings size={18} />, label: "Settings" },
  ];

  return (
    <>
      {/* Mobile toggle */}
      <button onClick={() => setOpen(!open)} className="lg:hidden fixed top-4 left-4 z-50 bg-primary text-white p-2 rounded-lg">
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed lg:static top-0 left-0 h-full w-64 bg-white dark:bg-[#111827] shadow-xl p-5 flex flex-col justify-between transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div>
          <h2 className="text-xl font-bold text-primary mb-6">Edu-Guardian</h2>
          <nav className="flex flex-col gap-2">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg ${
                    isActive
                      ? "bg-primary text-white"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800"
                  }`
                }
              >
                {link.icon}
                <span>{link.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="mt-8 flex flex-col gap-3">
          <button
            onClick={toggleTheme}
            className="py-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-sm"
          >
            Toggle {theme === "dark" ? "Light" : "Dark"} Mode
          </button>
          <button
            onClick={handleLogout}
            className="py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center gap-2"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>
    </>
  );
}
