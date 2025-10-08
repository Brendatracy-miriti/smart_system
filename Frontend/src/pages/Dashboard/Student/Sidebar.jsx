import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Home, BookOpen, ClipboardList, BarChart2, Calendar, MessageCircle, Settings, LogOut } from "lucide-react";

export default function StudentSidebar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  const links = [
    { name: "Dashboard", path: "/student", icon: Home },
    { name: "Courses", path: "/student/courses", icon: BookOpen },
    { name: "Assignments", path: "/student/assignments", icon: ClipboardList },
    { name: "Grades", path: "/student/grades", icon: BarChart2 },
    { name: "Timetable", path: "/student/timetable", icon: Calendar },
    { name: "Messages", path: "/student/messages", icon: MessageCircle },
    { name: "Settings", path: "/student/settings", icon: Settings },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className={`bg-white dark:bg-gray-900 p-5 border-r border-gray-200 dark:border-gray-700 
        ${open ? "w-64" : "w-20"} transition-all duration-300 flex flex-col`}>
        
        <div className="flex items-center justify-between mb-8">
          <h1 className={`text-lg font-bold text-blue-600 transition-all ${!open && "hidden"}`}>
            Edu-Guardian
          </h1>
          <button onClick={() => setOpen(!open)} className="p-2 text-gray-600 dark:text-gray-300">
            ☰
          </button>
        </div>

        <nav className="flex-1 space-y-2">
          {links.map(({ name, path, icon: Icon }) => (
            <NavLink
              key={name}
              to={path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-800 
                 ${isActive ? "bg-blue-100 text-blue-700 dark:bg-gray-800" : "text-gray-700 dark:text-gray-300"}`
              }
            >
              <Icon size={18} />
              {open && <span className="text-sm font-medium">{name}</span>}
            </NavLink>
          ))}
        </nav>

        <button
          onClick={handleLogout}
          className="mt-auto flex items-center gap-3 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-gray-800"
        >
          <LogOut size={18} />
          {open && <span className="text-sm font-medium">Logout</span>}
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 bg-gray-50 dark:bg-gray-950 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}
