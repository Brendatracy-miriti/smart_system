import React, { useState } from "react";
import { motion } from "framer-motion";
import { useMessage } from "../../../hooks/useMessage";

export default function Settings() {
  const [theme, setTheme] = useState("light");
  const [notifications, setNotifications] = useState(true);
  const { setMessage } = useMessage();

  const handleSave = () => {
    setMessage({ type: "success", text: "Settings saved successfully!" });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
      <h2 className="text-2xl font-bold text-blue-600 mb-4">Settings</h2>

      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-800 dark:text-gray-200">
            Theme
          </label>
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={notifications}
            onChange={() => setNotifications(!notifications)}
          />
          <label className="text-gray-800 dark:text-gray-200">Enable Notifications</label>
        </div>

        <button
          onClick={handleSave}
          className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
        >
          Save Changes
        </button>
      </div>
    </motion.div>
  );
}
