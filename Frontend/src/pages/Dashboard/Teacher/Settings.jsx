import React, { useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../../hooks/useTheme";

export default function Settings() {
  const { theme, toggleTheme } = useTheme();
  const [name, setName] = useState("Mr. John Mwangi");
  const [email, setEmail] = useState("john.mwangi@eduguardian.com");

  const handleSave = () => alert("Profile saved successfully!");

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="p-6 space-y-6"
    >
      <h2 className="text-2xl font-bold text-primary">Settings & Preferences</h2>

      <div className="bg-white dark:bg-[#1F2937] p-6 rounded-2xl shadow-sm space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Full Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full mt-1 p-2 border rounded-lg bg-transparent dark:border-gray-700"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mt-1 p-2 border rounded-lg bg-transparent dark:border-gray-700"
          />
        </div>

        <div className="flex justify-between items-center">
          <button
            onClick={toggleTheme}
            className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Switch to {theme === "dark" ? "Light" : "Dark"} Mode
          </button>

          <button
            onClick={handleSave}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-accent"
          >
            Save Changes
          </button>
        </div>
      </div>
    </motion.div>
  );
}
