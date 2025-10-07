import React, { useEffect, useState } from "react";
import { Users, FileText, Truck, DollarSign } from "lucide-react";
import StatCard from "../../components/StatCard";
import AreaSpark from "../../components/AreaSpark";
import { motion } from "framer-motion";
import api from "../../utils/api";
import { useMessage } from "../../context/MessageContext";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState({
    students: 0,
    teachers: 0,
    buses: 0,
    fundsTotal: 0,
  });
  const [trendData, setTrendData] = useState([]); // expects [{label:'Jan', value:100}, ...]
  const { setMessage } = useMessage();

  useEffect(() => {
    let mounted = true;
    const fetchOverview = async () => {
      setLoading(true);
      try {
        const [studentsRes, teachersRes, transportRes, fundsRes] =
          await Promise.all([
            api.get("students/"),
            api.get("teachers/"),
            api.get("transport/"),
            api.get("funds/"),
          ]);

        if (!mounted) return;

        const students = Array.isArray(studentsRes.data) ? studentsRes.data.length : 0;
        const teachers = Array.isArray(teachersRes.data) ? teachersRes.data.length : 0;
        const buses = Array.isArray(transportRes.data) ? new Set(transportRes.data.map(t => t.bus_id)).size : 0;

        // funds total sum if fundsRes.data is array of {amount: number}
        const fundsTotal = Array.isArray(fundsRes.data)
          ? fundsRes.data.reduce((s, r) => s + (Number(r.amount) || 0), 0)
          : 0;

        setCounts({ students, teachers, buses, fundsTotal });

        // Create simple trend from students count over last 6 months mock-ish from response date if available
        // BUT since no dummy data requirement, we attempt to map funds by month if available
        if (Array.isArray(fundsRes.data) && fundsRes.data.length) {
          // aggregate funds by month label
          const map = {};
          fundsRes.data.forEach((f) => {
            const d = new Date(f.date || f.created || f.timestamp);
            if (isNaN(d)) return;
            const label = d.toLocaleString("default", { month: "short" });
            map[label] = (map[label] || 0) + (Number(f.amount) || 0);
          });
          const trend = Object.keys(map).map((k) => ({ label: k, value: map[k] }));
          setTrendData(trend);
        } else {
          setTrendData([]); // no data yet
        }

        setLoading(false);
      } catch (err) {
        setLoading(false);
        setMessage({ type: "error", text: "Could not fetch admin overview. Check backend." });
        console.error(err);
      }
    };

    fetchOverview();
    return () => { mounted = false; };
  }, [setMessage]);

  return (
    <div>
      <motion.h2
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold text-primary mb-4"
      >
        Admin Overview
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <StatCard
          title="Students"
          value={loading ? "..." : counts.students}
          subtitle="Total registered students"
          icon={<Users size={20} />}
        />
        <StatCard
          title="Teachers"
          value={loading ? "..." : counts.teachers}
          subtitle="Active teachers"
          icon={<FileText size={20} />}
        />
        <StatCard
          title="Buses"
          value={loading ? "..." : counts.buses}
          subtitle="Tracked buses"
          icon={<Truck size={20} />}
        />
        <StatCard
          title="Funds (KSh)"
          value={loading ? "..." : counts.fundsTotal.toLocaleString()}
          subtitle="Total recorded funds"
          icon={<DollarSign size={20} />}
        />
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-[#071027] p-5 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-textBody dark:text-gray-200">Funds trend</h3>
            <div className="text-sm text-gray-500 dark:text-gray-400">Last 6 months</div>
          </div>

          <AreaSpark data={trendData} color="#10B981" />
        </div>

        <div className="bg-white dark:bg-[#071027] p-5 rounded-2xl shadow-sm">
          <h3 className="font-semibold text-textBody dark:text-gray-200 mb-2">Quick actions</h3>
          <div className="flex flex-col gap-3">
            <button className="py-2 px-3 rounded-lg bg-primary text-white hover:bg-accent">
              Create Fund Record
            </button>
            <button className="py-2 px-3 rounded-lg border border-gray-200 dark:border-gray-700">
              Export Reports
            </button>
            <button className="py-2 px-3 rounded-lg border border-gray-200 dark:border-gray-700">
              View Dropout Alerts
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
