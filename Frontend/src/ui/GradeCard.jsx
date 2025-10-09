import React from "react";

export default function GradeCard({ subject, score, type }) {
  return (
    <div className="p-4 bg-white dark:bg-gray-900 rounded-xl shadow flex justify-between items-center">
      <div>
        <p className="font-medium text-gray-700 dark:text-gray-200">
          {subject}
        </p>
        <p className="text-xs text-gray-500">{type}</p>
      </div>
      <span
        className={`px-3 py-1 rounded-lg text-sm ${
          score >= 70
            ? "bg-green-100 text-green-700"
            : score >= 50
            ? "bg-yellow-100 text-yellow-700"
            : "bg-red-100 text-red-700"
        }`}
      >
        {score}%
      </span>
    </div>
  );
}
