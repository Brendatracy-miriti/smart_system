import React from "react";
import { ClipboardList } from "lucide-react";

export default function AssignmentCard({ title, course, due, submitted }) {
  return (
    <div className="p-4 bg-white dark:bg-gray-900 rounded-xl shadow-md flex justify-between items-center">
      <div>
        <h3 className="font-semibold text-gray-800 dark:text-gray-100">
          {title}
        </h3>
        <p className="text-sm text-gray-500">{course}</p>
        <p className="text-xs text-gray-400 mt-1">Due: {due}</p>
      </div>
      <ClipboardList
        size={28}
        className={submitted ? "text-green-500" : "text-blue-500"}
      />
    </div>
  );
}
