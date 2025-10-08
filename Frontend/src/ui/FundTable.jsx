import React from "react";
import { motion } from "framer-motion";
import { Pencil, Trash2 } from "lucide-react";

export default function FundTable({ funds = [], onEdit, onDelete, loading }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white dark:bg-[#1F2937] rounded-2xl shadow p-5 overflow-x-auto"
    >
      <h3 className="text-lg font-semibold text-[#111827] dark:text-gray-100 mb-4">
        Fund Records
      </h3>

      {loading ? (
        <div className="text-center py-6 text-gray-500 dark:text-gray-400">
          Loading funds...
        </div>
      ) : funds.length === 0 ? (
        <div className="text-center py-6 text-gray-500 dark:text-gray-400">
          No fund records available.
        </div>
      ) : (
        <table className="min-w-full text-left border-collapse">
          <thead>
            <tr className="text-gray-600 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
              <th className="py-3 px-4">#</th>
              <th className="py-3 px-4">Title</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Amount (KSh)</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {funds.map((f, i) => (
              <tr
                key={f.id || i}
                className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >
                <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{i + 1}</td>
                <td className="py-3 px-4 font-semibold text-gray-900 dark:text-gray-100">
                  {f.title}
                </td>
                <td className="py-3 px-4 text-gray-600 dark:text-gray-300 capitalize">
                  {f.category}
                </td>
                <td className="py-3 px-4 text-gray-800 dark:text-gray-100 font-medium">
                  {Number(f.amount).toLocaleString()}
                </td>
                <td className="py-3 px-4 text-gray-500 dark:text-gray-400">
                  {new Date(f.date || f.created_at).toLocaleDateString()}
                </td>
                <td className="py-3 px-4 text-right">
                  <button
                    onClick={() => onEdit(f)}
                    className="text-blue-500 hover:text-blue-600 mr-3"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => onDelete(f)}
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
