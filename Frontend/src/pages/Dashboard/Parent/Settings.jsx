import React, { useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../../context/ThemeContext";

export default function Settings() {
  const { theme, toggleTheme } = useTheme();
  const [email, setEmail] = useState("parent@gmail.com");

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-primary">Settings</h2>
      <div className="bg-white dark:bg-[#1F2937] p-6 rounded-2xl shadow-sm space-y-4">
        <div>
          <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 border rounded-lg dark:border-gray-700 bg-transparent" />
        </div>
        <div className="flex justify-between items-center">
          <button onClick={toggleTheme} className="px-4 py-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
            Toggle {theme === "dark" ? "Light" : "Dark"} Mode
          </button>
          <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-accent">Save Changes</button>
        </div>
      </div>
    </motion.div>
  );
}
