import React from "react";

export default function MiniCard({ title, description, icon: Icon, color = "blue" }) {
  // keep styling similar to your theme
  return (
    <div className="bg-white dark:bg-[#0B1221] p-4 rounded-xl shadow flex items-center gap-4">
      <div className="p-2 rounded-full bg-blue-50">
        {Icon ? <Icon size={20} /> : null}
      </div>
      <div>
        <div className="text-sm font-semibold text-gray-800 dark:text-gray-100">{title}</div>
        <div className="text-xs text-gray-500 dark:text-gray-400">{description}</div>
      </div>
    </div>
  );
}
