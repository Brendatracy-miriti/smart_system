import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, FileText, Truck, DollarSign } from "lucide-react";
import StatCard from "../../../ui/StatCard";
import FundChart from "../../../ui/FundChart";
import api from "../../../utils/api";
import { useMessage } from "../../../hooks/useMessage";

import { AlertTriangle, PieChart as PieChartIcon } from "lucide-react";
import { useContext, useMemo } from "react";
import { DataContext } from "../../../context/DataContext";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState({
    students: 0,
    teachers: 0,
    buses: 0,
    fundsTotal: 0,
  });

  const { getAtRiskStudents } = useContext(DataContext);
  const atRisk = getAtRiskStudents();

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

  const { students, calculateRisk } = useContext(DataContext);

// group by course
const riskByCourse = useMemo(() => {
  const map = {};
  students.forEach((s) => {
    const course = s.course || "Unknown";
    const risk = calculateRisk(s);
    if (!map[course]) map[course] = { course, safe: 0, risk: 0 };
    if (risk === "At-Risk") map[course].risk += 1;
    else map[course].safe += 1;
  });
  return Object.values(map);
}, [students, calculateRisk]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="p-6 space-y-8"
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

        <div className="flex items-center justify-between mb-2">
          <div className="text-gray-500 dark:text-gray-400 text-sm">
            Total Students: <span className="font-semibold">{students.length}</span>
          </div>
          <div className="text-gray-500 dark:text-gray-400 text-sm">
            At-Risk: <span className="text-red-500 font-semibold">
              {students.filter(s => calculateRisk(s) === "At-Risk").length}
            </span>
          </div>
        </div>


        <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl shadow">
        <h3 className="text-lg font-semibold flex items-center gap-2 text-red-600">
          <AlertTriangle size={20} /> At-Risk Students
        </h3>
        {atRisk.length ? (
          <table className="mt-3 w-full text-sm">
            <thead>
              <tr className="text-gray-500 dark:text-gray-400">
                <th className="text-left py-1">Name</th>
                <th className="text-left py-1">Course</th>
                <th className="text-left py-1">Attendance</th>
                <th className="text-left py-1">Score</th>
              </tr>
            </thead>
            <tbody>
              {atRisk.map((s) => (
                <tr key={s.id} className="border-t border-gray-100 dark:border-gray-800">
                  <td className="py-1">{s.name}</td>
                  <td>{s.course}</td>
                  <td>{s.attendanceRate}%</td>
                  <td>{s.avgScore}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500 mt-2">No at-risk students detected.</p>
        )}
      </div>;

      <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl shadow mt-6">
      <h3 className="text-lg font-semibold flex items-center gap-2 mb-4 text-primary">
        <PieChartIcon size={20} /> Student Risk Analytics
      </h3>
      {riskByCourse.length ? (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={riskByCourse}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="course" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1F2937",
                borderRadius: "0.5rem",
                color: "#f3f4f6",
              }}
            />
            <Bar dataKey="safe" stackId="a" fill="#10B981" name="Safe Students" />
            <Bar dataKey="risk" stackId="a" fill="#EF4444" name="At-Risk Students" />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <p className="text-gray-500">No student data available for analytics.</p>
      )}
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
  );
}
