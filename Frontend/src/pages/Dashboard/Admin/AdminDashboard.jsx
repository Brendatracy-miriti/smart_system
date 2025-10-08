import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, FileText, Truck, DollarSign } from "lucide-react";
import StatCard from "../../../ui/StatCard";
import FundChart from "../../../ui/FundChart";
import api from "../../../utils/api";
import { useMessage } from "../../../hooks/useMessage";
import Sidebar from "./Sidebar";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState({
    students: 0,
    teachers: 0,
    buses: 0,
    fundsTotal: 0,
  });
  const [trendData, setTrendData] = useState([]); // [{month:'Jan', income:100, expense:50}]
  const { setMessage } = useMessage();

  useEffect(() => {
    let mounted = true;

    const fetchOverview = async () => {
      setLoading(true);
      try {
        const [studentsRes, teachersRes, transportRes, fundsRes] = await Promise.all([
          api.get("students/"),
          api.get("teachers/"),
          api.get("transport/"),
          api.get("funds/"),
        ]);

        if (!mounted) return;

        const students = Array.isArray(studentsRes.data) ? studentsRes.data.length : 0;
        const teachers = Array.isArray(teachersRes.data) ? teachersRes.data.length : 0;
        const buses = Array.isArray(transportRes.data)
          ? new Set(transportRes.data.map((t) => t.bus_id)).size
          : 0;

        const fundsTotal = Array.isArray(fundsRes.data)
          ? fundsRes.data.reduce((s, r) => s + (Number(r.amount) || 0), 0)
          : 0;

        setCounts({ students, teachers, buses, fundsTotal });

        // Trend by month from funds data
        if (Array.isArray(fundsRes.data) && fundsRes.data.length) {
          const map = {};
          fundsRes.data.forEach((f) => {
            const d = new Date(f.date || f.created || f.timestamp);
            if (isNaN(d)) return;
            const label = d.toLocaleString("default", { month: "short" });
            map[label] = (map[label] || 0) + (Number(f.amount) || 0);
          });
          const trend = Object.keys(map).map((k) => ({
            month: k,
            income: map[k],
            expense: map[k] * 0.6, // mock expense for chart balance
          }));
          setTrendData(trend);
        } else {
          setTrendData([]);
        }

        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
        setMessage({
          type: "error",
          text: "Could not fetch admin overview. Please check your backend connection.",
        });
      }
    };

    fetchOverview();
    return () => {
      mounted = false;
    };
  }, [setMessage]);

  return (
    <div className="flex">
      <Sidebar />
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex-1 p-6 space-y-8"
      >
        {/* Header */}
        <div>
          <h2 className="text-3xl font-bold text-primary mb-2">Admin Dashboard</h2>
          <p className="text-gray-500 dark:text-gray-400">
            Overview of the Edu-Guardian system — live stats & performance summary.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Students"
            value={loading ? "..." : counts.students}
            change={4.2}
            icon={Users}
            color="blue-500"
          />
          <StatCard
            title="Teachers"
            value={loading ? "..." : counts.teachers}
            change={2.1}
            icon={FileText}
            color="green-500"
          />
          <StatCard
            title="Buses"
            value={loading ? "..." : counts.buses}
            change={-1.3}
            icon={Truck}
            color="cyan-500"
          />
          <StatCard
            title="Funds (KSh)"
            value={loading ? "..." : counts.fundsTotal.toLocaleString()}
            change={5.6}
            icon={DollarSign}
            color="emerald-500"
          />
        </div>

        {/* Middle Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Funds Chart */}
          <div className="lg:col-span-2">
            <FundChart data={trendData} />
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-[#1F2937] p-5 rounded-2xl shadow space-y-4">
            <h3 className="text-lg font-semibold text-[#111827] dark:text-gray-100">
              Quick Actions
            </h3>
            <button className="w-full py-2 px-3 rounded-lg bg-primary text-white hover:bg-accent transition">
              Create Fund Record
            </button>
            <button className="w-full py-2 px-3 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
              Export Reports
            </button>
            <button className="w-full py-2 px-3 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
              View Dropout Alerts
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
