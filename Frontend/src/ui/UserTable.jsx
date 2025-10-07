import React from "react";
import { motion } from "framer-motion";
import { Pencil, Trash2 } from "lucide-react";

export default function UserTable({ users, onEdit, onDelete, loading }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white dark:bg-[#1F2937] rounded-2xl shadow p-5 overflow-x-auto"
    >
      <h3 className="text-lg font-semibold text-[#111827] dark:text-gray-100 mb-4">
        User Management
      </h3>

      {loading ? (
        <div className="text-center py-6 text-gray-500 dark:text-gray-400">
          Loading users...
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-6 text-gray-500 dark:text-gray-400">
          No users found.
        </div>
      ) : (
        <table className="min-w-full text-left border-collapse">
          <thead>
            <tr className="text-gray-600 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
              <th className="py-3 px-4">#</th>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Role</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, i) => (
              <tr
                key={u.id || i}
                className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >
                <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{i + 1}</td>
                <td className="py-3 px-4 text-gray-900 dark:text-gray-100 font-medium">
                  {u.name}
                </td>
                <td className="py-3 px-4 text-gray-600 dark:text-gray-300">{u.email}</td>
                <td className="py-3 px-4 capitalize text-gray-600 dark:text-gray-300">{u.role}</td>
                <td className="py-3 px-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      u.is_active
                        ? "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300"
                        : "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300"
                    }`}
                  >
                    {u.is_active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <button
                    onClick={() => onEdit(u)}
                    className="text-blue-500 hover:text-blue-600 mr-3"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => onDelete(u)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash2 size={18} />
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
