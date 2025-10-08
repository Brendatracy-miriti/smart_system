import React from "react";

export default function StatCard({ title, value, subtitle, icon }) {
  return (
    <div className="bg-white dark:bg-[#0B1221] p-4 rounded-2xl shadow flex items-center justify-between">
      <div>
        <div className="text-sm text-gray-500">{title}</div>
        <div className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{value}</div>
        {subtitle && <div className="text-xs text-gray-400">{subtitle}</div>}
      </div>
      {icon && <div className="text-gray-400">{icon}</div>}
    </div>
  );
}
