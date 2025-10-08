import React from "react";
import { motion } from "framer-motion";

export default function TransportLogList({ logs = [] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white dark:bg-[#1F2937] p-5 rounded-2xl shadow"
    >
      <h3 className="text-lg font-semibold text-[#111827] dark:text-gray-100 mb-4">
        Recent Transport Logs
      </h3>

      {logs.length === 0 ? (
        <div className="text-center py-6 text-gray-500 dark:text-gray-400">
          No logs yet.
        </div>
      ) : (
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {logs.map((log, i) => (
            <li key={i} className="py-3 flex justify-between items-center">
              <div>
                <p className="text-gray-800 dark:text-gray-200">
                  {log.message}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {log.time}
                </p>
              </div>
              <span
                className={`px-2 py-1 text-xs rounded-full ${
                  log.status === "completed"
                    ? "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300"
                    : "bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300"
                }`}
              >
                {log.status}
              </span>
            </li>
          ))}
        </ul>
      )}
    </motion.div>
  );
}
