import React from "react";

export default function MiniCard({ title, description, icon: Icon, color = "blue" }) {
  return (
    <div className={`flex items-center p-4 rounded-xl bg-${color}-50 dark:bg-gray-800 shadow-sm`}>
      <div className={`p-2 rounded-full bg-${color}-100 text-${color}-600`}>
        <Icon size={20} />
      </div>
      <div className="ml-3">
        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{title}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
      </div>
    </div>
  );
}
