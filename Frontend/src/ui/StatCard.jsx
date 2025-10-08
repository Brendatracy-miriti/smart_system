import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

export default function StatCard({ title, value, change, icon: Icon, color }) {
  const isPositive = change >= 0;

  return (
    <motion.div
      whileHover={{ y: -3 }}
      className="bg-white dark:bg-[#1F2937] p-5 rounded-2xl shadow hover:shadow-lg transition-all duration-200"
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300">{title}</h3>
        {Icon && <Icon className={`text-${color} w-5 h-5`} />}
      </div>
      <p className="text-2xl font-bold text-[#111827] dark:text-white">{value}</p>
      <div className="flex items-center text-sm mt-2">
        {isPositive ? (
          <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
        ) : (
          <ArrowDownRight className="w-4 h-4 text-red-500 mr-1" />
        )}
        <span className={`${isPositive ? "text-green-500" : "text-red-500"}`}>
          {Math.abs(change)}%
        </span>
        <span className="text-gray-500 ml-1">from last month</span>
      </div>
    </motion.div>
  );
}
