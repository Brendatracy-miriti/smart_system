import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function FundFormModal({ show, onClose, onSave, editingFund }) {
  const [form, setForm] = useState({
    title: "",
    category: "income",
    amount: "",
    date: "",
  });

  useEffect(() => {
    if (editingFund) setForm(editingFund);
  }, [editingFund]);

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
          {editingFund ? "Edit Fund Record" : "Add New Fund"}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Amount (KSh)</label>
            <input
              type="number"
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Date</label>
            <input
              type="date"
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              required
            />
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
              {editingFund ? "Save Changes" : "Create"}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
