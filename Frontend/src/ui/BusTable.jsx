import React from "react";
import { motion } from "framer-motion";
import { MapPin, AlertTriangle } from "lucide-react";

export default function BusTable({ buses = [], onView, onSOS, loading }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white dark:bg-[#1F2937] rounded-2xl shadow p-5 overflow-x-auto"
    >
      <h3 className="text-lg font-semibold text-[#111827] dark:text-gray-100 mb-4">
        Registered Buses
      </h3>

      {loading ? (
        <div className="text-center py-6 text-gray-500 dark:text-gray-400">
          Loading buses...
        </div>
      ) : buses.length === 0 ? (
        <div className="text-center py-6 text-gray-500 dark:text-gray-400">
          No buses found.
        </div>
      ) : (
        <table className="min-w-full text-left border-collapse">
          <thead>
            <tr className="text-gray-600 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
              <th className="py-3 px-4">Bus ID</th>
              <th className="py-3 px-4">Plate</th>
              <th className="py-3 px-4">Driver</th>
              <th className="py-3 px-4">Capacity</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {buses.map((b, i) => (
              <tr
                key={i}
                className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >
                <td className="py-3 px-4 font-semibold text-gray-800 dark:text-gray-100">
                  {b.bus_id || b.id}
                </td>
                <td className="py-3 px-4 text-gray-600 dark:text-gray-300">{b.plate}</td>
                <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                  {b.driver?.name || "Unassigned"}
                </td>
                <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                  {b.capacity || "N/A"}
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      b.active
                        ? "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300"
                        : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {b.active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="py-3 px-4 text-right space-x-2">
                  <button
                    onClick={() => onView(b)}
                    className="text-blue-500 hover:text-blue-600"
                    title="View location"
                  >
                    <MapPin size={18} />
                  </button>
                  <button
                    onClick={() => onSOS(b)}
                    className="text-red-500 hover:text-red-600"
                    title="Send SOS"
                  >
                    <AlertTriangle size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </motion.div>
  );
}
