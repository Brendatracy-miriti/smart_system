import React from "react";

export default function StatCard({ title, value, subtitle, icon }) {
  // icon may be a React component (constructor) or an already-created element
  const renderIcon = () => {
    if (!icon) return null;
    // if it's a valid React element, return it
    if (React.isValidElement(icon)) return icon;
    // if it's a component (function or class), render it
    if (typeof icon === "function") {
      const Icon = icon;
      return <Icon className="w-8 h-8 text-gray-400" />;
    }
    // fallback: render nothing
    return null;
  };

  return (
    <div className="bg-white dark:bg-[#0B1221] p-4 rounded-2xl shadow flex items-center justify-between">
      <div>
        <div className="text-sm text-gray-500">{title}</div>
        <div className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{value}</div>
        {subtitle && <div className="text-xs text-gray-400">{subtitle}</div>}
      </div>
      <div>{renderIcon()}</div>
    </div>
  );
}
