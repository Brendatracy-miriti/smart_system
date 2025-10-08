import React, { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import FundTable from "../../../ui/FundTable";
import FundFormModal from "../../../ui/FundFormModal";
import FundChart from "../../../ui/FundChart";
import api from "../../../utils/api";
import { useMessage } from "../../../hooks/useMessage";

export default function Funds() {
  const [funds, setFunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingFund, setEditingFund] = useState(null);
  const { setMessage } = useMessage();

  const fetchFunds = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("funds/");
      setFunds(res.data || []);
    } catch {
      setMessage({ type: "error", text: "Failed to fetch fund records." });
    } finally {
      setLoading(false);
    }
  }, [setMessage]);

  const handleSave = async (data) => {
    try {
      if (editingFund) {
        await api.put(`funds/${editingFund.id}/`, data);
        setMessage({ type: "success", text: "Fund record updated!" });
      } else {
        await api.post("funds/", data);
        setMessage({ type: "success", text: "Fund record added!" });
      }
      setShowModal(false);
      setEditingFund(null);
      fetchFunds();
    } catch {
      setMessage({ type: "error", text: "Failed to save fund record." });
    }
  };

  const handleDelete = async (fund) => {
    if (!window.confirm(`Delete fund "${fund.title}"?`)) return;
    try {
      await api.delete(`funds/${fund.id}/`);
      setMessage({ type: "success", text: "Fund deleted successfully." });
      fetchFunds();
    } catch {
      setMessage({ type: "error", text: "Failed to delete fund." });
    }
  };

  useEffect(() => {
    fetchFunds();
  }, [fetchFunds]);

  // Prepare data for chart
  const chartData = funds.map((f) => ({
    month: new Date(f.date || f.created_at).toLocaleString("default", { month: "short" }),
    income: f.category === "income" ? f.amount : 0,
    expense: f.category === "expense" ? f.amount : 0,
  }));

  const totalIncome = funds
    .filter((f) => f.category === "income")
    .reduce((s, f) => s + Number(f.amount), 0);
  const totalExpense = funds
    .filter((f) => f.category === "expense")
    .reduce((s, f) => s + Number(f.amount), 0);
  const balance = totalIncome - totalExpense;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="p-6 space-y-6"
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-primary">Funds Management</h2>
          <p className="text-gray-500 dark:text-gray-400">
            Track income and expenditure across all school activities.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="py-2 px-4 rounded-lg bg-primary text-white hover:bg-accent transition"
        >
          + Add Fund Record
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-[#1F2937] p-4 rounded-2xl shadow">
          <h4 className="text-gray-500 text-sm">Total Income</h4>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            KSh {totalIncome.toLocaleString()}
          </p>
        </div>
        <div className="bg-white dark:bg-[#1F2937] p-4 rounded-2xl shadow">
          <h4 className="text-gray-500 text-sm">Total Expense</h4>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">
            KSh {totalExpense.toLocaleString()}
          </p>
        </div>
        <div className="bg-white dark:bg-[#1F2937] p-4 rounded-2xl shadow">
          <h4 className="text-gray-500 text-sm">Balance</h4>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            KSh {balance.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Chart */}
      <FundChart data={chartData} />

      {/* Table */}
      <FundTable funds={funds} loading={loading} onEdit={setEditingFund} onDelete={handleDelete} />

      {/* Modal */}
      <FundFormModal
        show={showModal || !!editingFund}
        editingFund={editingFund}
        onClose={() => {
          setShowModal(false);
          setEditingFund(null);
        }}
        onSave={handleSave}
      />
    </motion.div>
  );
}
