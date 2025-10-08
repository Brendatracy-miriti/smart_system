import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { Sun, Moon, LogOut } from "lucide-react";
import { useTheme } from "../../../context/ThemeContext";
import { useAuth } from "../../../context/AuthContext";

export default function TeacherSidebar() {
  const [open, setOpen] = useState(true);
  const { theme, toggleTheme } = useTheme();
  const { logout } = useAuth();

  const links = [
    { to: "/teacher", label: "Dashboard" },
    { to: "/teacher/assignments", label: "Assignments" },
    { to: "/teacher/attendance", label: "Attendance" },
    { to: "/teacher/timetable", label: "Timetable" },
    { to: "/teacher/settings", label: "Settings" },
  ];

  return (
    <div className="flex min-h-screen">
      <aside className={`${open ? "w-64" : "w-20"} bg-white dark:bg-[#1F2937] p-4 transition-all`}>
        <div className="mb-6">
          <button onClick={()=>setOpen(!open)} className="text-gray-500">{open ? "◀" : "▶"}</button>
        </div>
        <nav className="space-y-2">
          {links.map(l => (
            <NavLink key={l.to} to={l.to} className={({isActive})=>`block px-3 py-2 rounded ${isActive ? "bg-primary text-white" : "text-gray-600"}`}>
              {open ? l.label : l.label.charAt(0)}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto space-y-2">
          <button onClick={toggleTheme} className="w-full flex items-center justify-center gap-2 py-2 text-gray-600">
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />} {open && (theme === "dark" ? "Light" : "Dark")}
          </button>
          <button onClick={()=>{ logout(); window.location.href="/login"; }} className="w-full py-2 text-red-500">Logout</button>
        </div>
      </aside>

      <main className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
