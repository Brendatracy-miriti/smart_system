import React, { useContext, useState } from "react";
import { motion } from "framer-motion";
import { DataContext } from "../../../context/DataContext";
import { getStudents } from "../../../utils/localData";

export default function ProfileSettings() {
  const { data, updateUser } = useContext(DataContext);
  const currentUser = JSON.parse(localStorage.getItem("eg_current_user") || "null");

  const [form, setForm] = useState({
    name: currentUser?.name || "",
    email: currentUser?.email || "",
    avatar: currentUser?.avatar || "",
    childStudentId: currentUser?.childStudentId || "",
  });
  const [passwords, setPasswords] = useState({
    current: "",
    newPassword: "",
    confirm: "",
  });

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((p) => ({ ...p, avatar: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!currentUser) return alert("Not logged in");
    updateUser(currentUser.id, { ...form });
    const updated = { ...currentUser, ...form };
    localStorage.setItem("eg_current_user", JSON.stringify(updated));
    alert("Profile updated successfully!");
  };

  const handleChangePassword = () => {
    if (!currentUser) return alert("Not logged in");
    if (passwords.newPassword.length < 4) return alert("New password must be at least 4 characters");
    if (passwords.newPassword !== passwords.confirm) return alert("New password and confirm do not match");
    // verify current password
    if (currentUser.password && passwords.current !== currentUser.password) return alert("Current password is incorrect");

    // update in DataContext users and eg_current_user
    updateUser(currentUser.id, { password: passwords.newPassword });
    const updated = { ...currentUser, password: passwords.newPassword };
    localStorage.setItem("eg_current_user", JSON.stringify(updated));
    // clear fields
    setPasswords({ current: "", newPassword: "", confirm: "" });
    alert("Password changed successfully");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 space-y-6 bg-white dark:bg-[#071027] rounded-2xl shadow"
    >
      <h2 className="text-2xl font-bold text-primary">Profile Settings</h2>
      <p className="text-gray-500 dark:text-gray-400 text-sm">Manage your personal information.</p>

      <div className="flex flex-col items-center gap-4">
        <img
          src={form.avatar || "https://i.pravatar.cc/100"}
          alt="avatar"
          className="w-24 h-24 rounded-full object-cover border-4 border-blue-100"
        />
        <input type="file" accept="image/*" onChange={handleFile} className="text-sm text-gray-500" />
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium mb-1">Full Name</label>
          <input
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            className="w-full p-3 border rounded-lg bg-transparent dark:border-gray-600 focus:ring-2 focus:ring-accent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            value={form.email}
            onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
            className="w-full p-3 border rounded-lg bg-transparent dark:border-gray-600 focus:ring-2 focus:ring-accent"
          />
        </div>

        {currentUser?.role === "parent" && (
          <div>
            <label className="block text-sm font-medium mb-1">Link Child (Admission Number)</label>
            <input
              value={form.childStudentId}
              onChange={(e) => setForm((p) => ({ ...p, childStudentId: e.target.value }))}
              placeholder="e.g. ADM0001"
              className="w-full p-3 border rounded-lg bg-transparent dark:border-gray-600 focus:ring-2 focus:ring-accent"
            />
            <p className="text-xs text-gray-500 mt-1">Enter the child's admission number to link their data.</p>
          </div>
        )}

        <button
          onClick={handleSave}
          className="w-full py-3 rounded-lg text-white font-semibold transition"
          style={{ backgroundColor: "#1E3A8A" }}
        >
          Save Changes
        </button>
      </div>

      <div className="mt-6 bg-white dark:bg-[#071027] p-4 rounded-2xl shadow">
        <h3 className="text-lg font-semibold">Change Password</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">Update your account password.</p>
        <div className="space-y-3 mt-3">
          <input
            type="password"
            placeholder="Current password"
            value={passwords.current}
            onChange={(e) => setPasswords((p) => ({ ...p, current: e.target.value }))}
            className="w-full p-2 border rounded"
          />
          <input
            type="password"
            placeholder="New password"
            value={passwords.newPassword}
            onChange={(e) => setPasswords((p) => ({ ...p, newPassword: e.target.value }))}
            className="w-full p-2 border rounded"
          />
          <input
            type="password"
            placeholder="Confirm new password"
            value={passwords.confirm}
            onChange={(e) => setPasswords((p) => ({ ...p, confirm: e.target.value }))}
            className="w-full p-2 border rounded"
          />
          <button onClick={handleChangePassword} className="bg-primary text-white px-4 py-2 rounded">
            Change Password
          </button>
        </div>
      </div>
    </motion.div>
  );
}
