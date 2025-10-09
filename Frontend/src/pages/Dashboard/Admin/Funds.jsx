import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PlusCircle, Download, BarChart3 } from "lucide-react";
import { useMessage } from "../../../context/MessageContext";
import { useData } from "../../../context/DataContext";

export default function Funds() {
  const { funds, addFund } = useData();
  const { setMessage } = useMessage();

  const [amount, setAmount] = useState("");
  const [source, setSource] = useState("");
  const [note, setNote] = useState("");

  const handleAddFund = (e) => {
    e.preventDefault();
    if (!amount || !source) {
      setMessage({ type: "error", text: "Please fill all required fields" });
      return;
    }
    addFund({
      id: Date.now(),
      source,
      note,
      amount: parseFloat(amount),
      date: new Date().toISOString(),
    });
    setMessage({ type: "success", text: "Fund added successfully" });
    setAmount("");
    setSource("");
    setNote("");
  };

  const total = funds.reduce((sum, f) => sum + (Number(f.amount) || 0), 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 space-y-6"
    >
      <h2 className="text-2xl font-bold text-primary">Funds Management</h2>
      <p className="text-gray-500 dark:text-gray-400">
        Add, view and export school funds
      </p>

      {/* Total Summary */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-md flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Total Funds</h3>
          <p className="text-3xl font-bold text-emerald-500">
            KSh {total.toLocaleString()}
          </p>
        </div>
        <BarChart3 size={42} className="text-emerald-400" />
      </div>

      {/* Add Fund Form */}
      <form
        onSubmit={handleAddFund}
        className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow space-y-4"
      >
        <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
          <PlusCircle size={18} /> Add Fund Record
        </h3>
        <div className="grid sm:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Source"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="p-3 border rounded-lg dark:border-gray-700 bg-transparent"
          />
          <input
            type="number"
            placeholder="Amount (KSh)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="p-3 border rounded-lg dark:border-gray-700 bg-transparent"
          />
          <input
            type="text"
            placeholder="Note (optional)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="p-3 border rounded-lg dark:border-gray-700 bg-transparent"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-accent transition"
        >
          Add Fund
        </button>
      </form>

      {/* List */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-md">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold">Recent Transactions</h3>
          <button className="flex items-center gap-2 text-sm border px-3 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition">
            <Download size={14} /> Export CSV
          </button>
        </div>
        {funds.length ? (
          <ul className="divide-y divide-gray-100 dark:divide-gray-700">
            {funds.map((f) => (
              <li
                key={f.id}
                className="py-3 flex justify-between text-sm text-gray-600 dark:text-gray-300"
              >
                <span>{f.source}</span>
                <span className="font-medium text-emerald-500">
                  +KSh {f.amount.toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No fund records yet.</p>
        )}
      </div>
    </motion.div>
  );
}
