import React from "react";
import { motion } from "framer-motion";

export default function Transport() {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-primary">Transport Tracking</h2>
      <div className="bg-white dark:bg-[#1F2937] p-6 rounded-2xl shadow-sm">
        <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded-xl flex items-center justify-center text-gray-500">
          Live Map Placeholder
        </div>
        <div className="mt-4 flex justify-between items-center">
          <p className="text-gray-700 dark:text-gray-300">
            Bus A23 – <span className="font-medium">On Route</span>
          </p>
          <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
            Emergency Alert
          </button>
        </div>
      </div>
    </motion.div>
  );
}
