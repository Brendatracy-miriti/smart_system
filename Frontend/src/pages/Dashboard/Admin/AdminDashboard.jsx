import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import { motion } from "framer-motion";
import { Users, FileText, Truck, DollarSign } from "lucide-react";
import StatCard from "../../../ui/StatCard";
import FundChart from "../../../ui/FundChart";
import FundTable from "../../../ui/FundTable";
import { useMessage } from "../../../hooks/useMessage";
import { useData } from "../../../context/DataContext";

import { AlertTriangle, PieChart as PieChartIcon } from "lucide-react";
import { useContext, useMemo } from "react";
import { DataContext } from "../../../context/DataContext";
import { useTheme } from "../../../context/ThemeContext";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export default function AdminDashboard() {
  const [showCreateFund, setShowCreateFund] = useState(false);
  const [fundTitle, setFundTitle] = useState("");
  const [fundAmount, setFundAmount] = useState("");
  const [fundCategory, setFundCategory] = useState("");
  const [fundDate, setFundDate] = useState("");
  const [showDropoutModal, setShowDropoutModal] = useState(false);
  const [financeFunds, setFinanceFunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState({
    students: 0,
    teachers: 0,
    buses: 0,
    fundsTotal: 0,
  });

  const dataCtx = useContext(DataContext);
  const getAtRiskStudents = typeof dataCtx?.getAtRiskStudents === "function" ? dataCtx.getAtRiskStudents : () => [];
  const atRisk = Array.isArray(getAtRiskStudents()) ? getAtRiskStudents() : [];

  const [trendData, setTrendData] = useState([]); // [{month:'Jan', income:100, expense:50}]
  const { setMessage } = useMessage();
  const { data } = useData();
  const { theme } = useTheme();

  const handleCreateFund = () => setShowCreateFund(true);

  const downloadCSV = (filename, csv) => {
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const handleExportReports = () => {
    try {
      // export funds and users as separate CSV files
      const funds = Array.isArray(data?.funds) ? data.funds : [];
      const users = Array.isArray(data?.users) ? data.users : [];

      const fundsCsv = Papa.unparse(funds);
      const usersCsv = Papa.unparse(users.map(u => ({ id: u.id, name: u.name || u.username || u.email, role: u.role, is_active: u.is_active })));

      downloadCSV("funds.csv", fundsCsv);
      downloadCSV("users.csv", usersCsv);
      setMessage({ type: "success", text: "Reports exported (funds.csv & users.csv)" });
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "Could not export reports" });
    }
  };

  const handleViewDropout = () => setShowDropoutModal(true);

  useEffect(() => {
    // compute counts and trend locally from DataContext/localStorage
    setLoading(true);
    try {
      const studentsArr = Array.isArray(data?.users) ? data.users.filter((u) => u.role === "student") : [];
      const teachersArr = Array.isArray(data?.users) ? data.users.filter((u) => u.role === "teacher") : [];
      const busesArr = Array.isArray(data?.buses) ? data.buses : [];
      const fundsArr = Array.isArray(data?.funds) ? data.funds : [];

      const students = studentsArr.length;
      const teachers = teachersArr.length;
      const buses = new Set(busesArr.map((t) => t.busId || t.id)).size;

      const fundsTotal = fundsArr.reduce((s, r) => s + (Number(r.amount) || 0), 0);

      setCounts({ students, teachers, buses, fundsTotal });

      if (fundsArr.length) {
        const map = {};
        fundsArr.forEach((f) => {
          const d = new Date(f.date || f.createdAt || f.created_at || f.timestamp || f.created || Date.now());
          if (isNaN(d)) return;
          const label = d.toLocaleString("default", { month: "short" });
          map[label] = (map[label] || 0) + (Number(f.amount) || 0);
        });
        const trend = Object.keys(map).map((k) => ({ month: k, income: map[k], expense: map[k] * 0.6 }));
        setTrendData(trend);
      } else {
        setTrendData([]);
      }

      // Load finance_data.csv and parse for FundTable
      fetch("/Data/finance_data.csv")
        .then(res => res.text())
        .then(csv => {
          Papa.parse(csv, {
            header: true,
            complete: (results) => {
              const funds = results.data.map((row, idx) => ({
                id: idx + 1,
                title: row.month,
                category: row.flag,
                amount: row.actual_spent,
                date: row.month,
              }));
              setFinanceFunds(funds);
            }
          });
        });

      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
      setMessage({ type: "error", text: "Could not build admin overview from local data." });
    }
  }, [data, setMessage]);

  const students = Array.isArray(dataCtx?.students) ? dataCtx.students : [];
  const calculateRisk = typeof dataCtx?.calculateRisk === "function" ? dataCtx.calculateRisk : () => "Safe";

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
      </div>

  <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl shadow mt-6">
      <h3 className="text-lg font-semibold flex items-center gap-2 mb-4 text-primary">
        <PieChartIcon size={20} /> Student Risk Analytics
      </h3>
      {riskByCourse.length ? (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={riskByCourse}>
            <CartesianGrid strokeDasharray="3 3" stroke={theme === "dark" ? "#111827" : "#e5e7eb"} />
            <XAxis dataKey="course" stroke={theme === "dark" ? "#9ca3af" : "#9ca3af"} />
            <YAxis stroke={theme === "dark" ? "#9ca3af" : "#9ca3af"} />
            <Tooltip
              contentStyle={{
                backgroundColor: theme === "dark" ? "#1F2937" : "#ffffff",
                borderRadius: "0.5rem",
                color: theme === "dark" ? "#f3f4f6" : "#111827",
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
            {/* Finance Data Table */}
            <div className="mt-6">
              <FundTable funds={financeFunds} loading={loading} />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow space-y-4">
            <h3 className="text-lg font-semibold text-[#111827] dark:text-gray-100">
              Quick Actions
            </h3>
              <button onClick={handleCreateFund} className="w-full py-2 px-3 rounded-lg bg-primary text-white hover:bg-accent transition">
                Create Fund Record
              </button>
              <button onClick={handleExportReports} className="w-full py-2 px-3 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                Export Reports
              </button>
              <button onClick={handleViewDropout} className="w-full py-2 px-3 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                View Dropout Alerts
              </button>
          </div>
        </div>
          {/* Create Fund Modal */}
          {showCreateFund && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
              <div className="bg-white dark:bg-gray-900 rounded-lg p-6 w-11/12 max-w-md shadow-lg">
                <h4 className="text-lg font-semibold mb-3">Create Fund Record</h4>
                <div className="space-y-3">
                  <input value={fundTitle} onChange={(e) => setFundTitle(e.target.value)} placeholder="Title" className="w-full px-3 py-2 rounded border" />
                  <input value={fundAmount} onChange={(e) => setFundAmount(e.target.value)} placeholder="Amount" type="number" className="w-full px-3 py-2 rounded border" />
                  <input value={fundCategory} onChange={(e) => setFundCategory(e.target.value)} placeholder="Category" className="w-full px-3 py-2 rounded border" />
                  <input value={fundDate} onChange={(e) => setFundDate(e.target.value)} placeholder="Date" type="date" className="w-full px-3 py-2 rounded border" />
                </div>
                <div className="mt-4 flex gap-3 justify-end">
                  <button onClick={() => setShowCreateFund(false)} className="px-4 py-2 rounded-lg border">Cancel</button>
                  <button
                    onClick={() => {
                      // validate
                      const amount = Number(fundAmount || 0);
                      if (!fundTitle || !amount) {
                        setMessage({ type: "error", text: "Please provide title and amount" });
                        return;
                      }
                      const newFund = {
                        id: Date.now(),
                        title: fundTitle,
                        amount: amount,
                        category: fundCategory || "general",
                        date: fundDate || new Date().toISOString(),
                      };
                      // use dataCtx to add fund
                      if (typeof dataCtx?.addFund === "function") dataCtx.addFund(newFund);
                      setMessage({ type: "success", text: "Fund record created" });
                      // reset
                      setFundTitle("");
                      setFundAmount("");
                      setFundCategory("");
                      setFundDate("");
                      setShowCreateFund(false);
                    }}
                    className="px-4 py-2 rounded-lg bg-primary text-white"
                  >
                    Create
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Dropout Alerts Modal */}
          {showDropoutModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
              <div className="bg-white dark:bg-gray-900 rounded-lg p-6 w-11/12 max-w-2xl shadow-lg">
                <div className="flex justify-between items-start">
                  <h4 className="text-lg font-semibold mb-3">Dropout / At-Risk Alerts</h4>
                  <button onClick={() => setShowDropoutModal(false)} className="text-sm text-gray-500">Close</button>
                </div>
                {atRisk.length ? (
                  <table className="w-full text-sm mt-2">
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
                  <p className="text-gray-500">No at-risk students detected.</p>
                )}
              </div>
            </div>
          )}
    </motion.div>
  );
}
