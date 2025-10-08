import React, { useState } from "react";
import { motion } from "framer-motion";
import ThemeToggle from "../../../ui/ThemeToggle";
import { useMessage } from "../../../hooks/useMessage";
import api from "../../../utils/api";
import { User, Bell, Lock } from "lucide-react";

export default function Settings() {
  const { setMessage } = useMessage();
  const [profile, setProfile] = useState({
    name: "Admin User",
    email: "admin@smartedu360.com",
  });
  const [passwords, setPasswords] = useState({ current: "", new: "" });
  const [notifications, setNotifications] = useState(true);
  const [saving, setSaving] = useState(false);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await api.put("users/me/", profile);
      setMessage({ type: "success", text: "Profile updated successfully!" });
    } catch {
      setMessage({ type: "error", text: "Failed to update profile." });
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!passwords.current || !passwords.new)
      return setMessage({ type: "error", text: "All password fields required." });

    try {
      setSaving(true);
      await api.post("users/change-password/", passwords);
      setMessage({ type: "success", text: "Password updated successfully!" });
      setPasswords({ current: "", new: "" });
    } catch {
      setMessage({ type: "error", text: "Password change failed." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 space-y-8"
    >
      <div>
        <h2 className="text-2xl font-bold text-primary">Settings</h2>
        <p className="text-gray-500 dark:text-gray-400">
          Manage your account, preferences, and app theme.
        </p>
      </div>

      {/* Profile Settings */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white dark:bg-[#1F2937] p-6 rounded-2xl shadow"
      >
        <div className="flex items-center gap-2 mb-4">
          <User className="text-blue-500" />
          <h3 className="text-lg font-semibold text-textBody dark:text-gray-200">
            Profile Information
          </h3>
        </div>
        <form onSubmit={handleProfileUpdate} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent"
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2 rounded-lg bg-primary text-white hover:bg-accent transition"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </motion.div>

      {/* Notification Preferences */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white dark:bg-[#1F2937] p-6 rounded-2xl shadow"
      >
        <div className="flex items-center gap-2 mb-4">
          <Bell className="text-green-500" />
          <h3 className="text-lg font-semibold text-textBody dark:text-gray-200">
            Notification Preferences
          </h3>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-700 dark:text-gray-300">
            Receive email alerts for new updates and emergencies
          </span>
          <label className="relative inline-flex cursor-pointer items-center">
            <input
              type="checkbox"
              checked={notifications}
              onChange={() => setNotifications(!notifications)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
          </label>
        </div>
      </motion.div>

      {/* Password Section */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white dark:bg-[#1F2937] p-6 rounded-2xl shadow"
      >
        <div className="flex items-center gap-2 mb-4">
          <Lock className="text-red-500" />
          <h3 className="text-lg font-semibold text-textBody dark:text-gray-200">
            Change Password
          </h3>
        </div>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
              Current Password
            </label>
            <input
              type="password"
              value={passwords.current}
              onChange={(e) =>
                setPasswords({ ...passwords, current: e.target.value })
              }
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
              New Password
            </label>
            <input
              type="password"
              value={passwords.new}
              onChange={(e) =>
                setPasswords({ ...passwords, new: e.target.value })
              }
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent"
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2 rounded-lg bg-primary text-white hover:bg-accent transition"
          >
            {saving ? "Updating..." : "Update Password"}
          </button>
        </form>
      </motion.div>

      {/* Theme Toggle */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white dark:bg-[#1F2937] p-6 rounded-2xl shadow flex items-center justify-between"
      >
        <div>
          <h3 className="text-lg font-semibold text-textBody dark:text-gray-200">
            App Theme
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Switch between light and dark mode.
          </p>
        </div>
        <ThemeToggle />
      </motion.div>
    </motion.div>
  );
}
