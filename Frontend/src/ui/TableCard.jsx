import React from "react";

export default function TableCard({ title, columns, data }) {
  return (
    <div className="bg-white dark:bg-[#1F2937] rounded-2xl p-5 shadow-sm overflow-x-auto">
      <h3 className="font-semibold text-lg mb-4 text-[#111827] dark:text-gray-100">{title}</h3>
      <table className="w-full text-sm text-left text-gray-700 dark:text-gray-300">
        <thead className="bg-gray-100 dark:bg-[#111827]">
          <tr>
            {columns.map((col) => (
              <th key={col} className="px-4 py-2 font-medium">{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data?.length ? (
            data.map((row, idx) => (
              <tr
                key={idx}
                className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >
                {Object.values(row).map((val, i) => (
                  <td key={i} className="px-4 py-2">{val}</td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="text-center py-4 text-gray-400">
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
