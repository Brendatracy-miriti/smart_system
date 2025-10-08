import React from "react";
import { motion } from "framer-motion";
import MiniChart from "../../../ui/MiniChart";

export default function Performance() {
  const data = [
    { label: "Term 1", value: 82 },
    { label: "Term 2", value: 85 },
    { label: "Term 3", value: 88 },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-primary">Academic Performance</h2>
      <div className="bg-white dark:bg-[#1F2937] p-5 rounded-2xl shadow-sm">
        <h3 className="font-semibold mb-3 text-gray-800 dark:text-gray-100">Termly Progress</h3>
        <MiniChart data={data} color="#10B981" height={180} />
      </div>
    </motion.div>
  );
}
