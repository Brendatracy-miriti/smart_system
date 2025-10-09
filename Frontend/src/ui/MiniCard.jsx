import React from "react";

export default function MessageCard({ from, content, time }) {
  return (
    <div className="p-3 bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-lg">
      <p className="text-sm text-gray-700 dark:text-gray-200">{content}</p>
      <div className="text-xs text-gray-500 mt-2">
        From: {from} • {time}
      </div>
    </div>
  );
}
