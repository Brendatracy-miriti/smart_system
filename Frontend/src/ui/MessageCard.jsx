import React from "react";

export default function MessageCard({ sender, message, date }) {
  return (
    <div className="bg-white dark:bg-[#1F2937] p-4 rounded-xl shadow-sm mb-3 border border-gray-100 dark:border-gray-700">
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-semibold text-[#111827] dark:text-gray-100">{sender}</h4>
        <span className="text-xs text-gray-400">{date}</span>
      </div>
      <p className="text-gray-700 dark:text-gray-300 text-sm">{message}</p>
    </div>
  );
}
