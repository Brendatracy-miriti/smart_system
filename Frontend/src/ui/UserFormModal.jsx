import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function UserFormModal({ show, onClose, onSave, editingUser }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "student",
    is_active: true,
    admission_number: "",
    course: "",
    childStudentId: "",
  });

  useEffect(() => {
    if (editingUser) setForm(editingUser);
  }, [editingUser]);

  if (!show) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white dark:bg-[#1F2937] p-6 rounded-2xl shadow-lg w-full max-w-md"
      >
        <h3 className="text-xl font-bold text-primary mb-4">
          {editingUser ? "Edit User" : "Add New User"}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              type="text"
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Role</label>
            <select
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
              <option value="parent">Parent</option>
            </select>
          </div>
          {form.role === "student" && (
            <>
              <div>
                <label className="block text-sm font-medium mb-1">Admission Number</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent"
                  value={form.admission_number}
                  onChange={(e) => setForm({ ...form, admission_number: e.target.value })}
                  placeholder="e.g. ADM0001"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Course</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent"
                  value={form.course}
                  onChange={(e) => setForm({ ...form, course: e.target.value })}
                  placeholder="e.g. Mathematics"
                />
              </div>
            </>
          )}

          {form.role === "parent" && (
            <div>
              <label className="block text-sm font-medium mb-1">Child Student ID</label>
              <input
                type="text"
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent"
                value={form.childStudentId}
                onChange={(e) => setForm({ ...form, childStudentId: e.target.value })}
                placeholder="e.g. ADM0001"
              />
            </div>
          )}

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
            />
            <label>Active</label>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-accent"
            >
              {editingUser ? "Save Changes" : "Create"}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
