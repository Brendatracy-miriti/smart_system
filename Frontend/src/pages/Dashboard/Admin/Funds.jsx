import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useData } from "../../../context/DataContext";
import { useTheme } from "../../../context/ThemeContext";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

const COLORS = ["#10B981", "#38BDF8", "#1E3A8A", "#F59E0B", "#EF4444"];

export default function Funds() {
  const { data, addFund } = useData();
  const { theme } = useTheme();
  const funds = data.funds || [];
  const [form, setForm] = useState({ source: "", amount: "", note: "" });

  const total = useMemo(() => funds.reduce((s, f) => s + (Number(f.amount) || 0), 0), [funds]);

  const bySource = useMemo(() => {
    const map = {};
    funds.forEach((f) => {
      map[f.source] = (map[f.source] || 0) + (Number(f.amount) || 0);
    });
    return Object.entries(map).map(([key, value]) => ({ name: key, value }));
  }, [funds]);

  const monthly = useMemo(() => {
    const m = {};
    funds.forEach((f) => {
      const d = new Date(f.date || f.createdAt || f.timestamp || Date.now());
      const label = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      m[label] = (m[label] || 0) + (Number(f.amount) || 0);
    });
    return Object.entries(m).map(([name, value]) => ({ name, value }));
  }, [funds]);

  const submit = (e) => {
    e.preventDefault();
    if (!form.source || !form.amount) return alert("Fill source and amount");
    addFund({ id: Date.now(), source: form.source, amount: Number(form.amount), note: form.note, date: new Date().toISOString() });
    setForm({ source: "", amount: "", note: "" });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-primary">Funds Management</h2>
          <p className="text-gray-500 dark:text-gray-400">Track fund inflow and visualize where money comes from.</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500">Total</div>
          <div className="text-2xl font-bold text-emerald-500">KSh {total.toLocaleString()}</div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
  <div className="col-span-2 bg-white dark:bg-gray-800 p-4 rounded-2xl shadow">
          <h3 className="font-semibold mb-3">Monthly inflows</h3>
          <div style={{ height: 240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthly}>
                <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke={theme === 'dark' ? '#9ca3af' : '#374151'} />
                <YAxis stroke={theme === 'dark' ? '#9ca3af' : '#374151'} />
                <Tooltip contentStyle={{ backgroundColor: theme === 'dark' ? '#0b1220' : '#fff', color: theme === 'dark' ? '#f3f4f6' : '#111827' }} />
                <Bar dataKey="value" fill={theme === 'dark' ? '#38BDF8' : '#1E3A8A'} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

  <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow">
          <h3 className="font-semibold mb-3">By source</h3>
          <div style={{ height: 240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={bySource} dataKey="value" nameKey="name" outerRadius={80} label>
                  {bySource.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: theme === 'dark' ? '#0b1220' : '#fff', color: theme === 'dark' ? '#f3f4f6' : '#111827' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

  <form onSubmit={submit} className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow space-y-3">
        <div className="grid sm:grid-cols-3 gap-3">
          <input placeholder="Source" value={form.source} onChange={(e) => setForm((p) => ({ ...p, source: e.target.value }))} className="p-2 border rounded bg-transparent" />
          <input placeholder="Amount" value={form.amount} onChange={(e) => setForm((p) => ({ ...p, amount: e.target.value }))} className="p-2 border rounded bg-transparent" />
          <input placeholder="Note (optional)" value={form.note} onChange={(e) => setForm((p) => ({ ...p, note: e.target.value }))} className="p-2 border rounded bg-transparent" />
        </div>
        <button type="submit" className="px-4 py-2 bg-primary text-white rounded">Add Fund</button>
      </form>

  <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow">
        <h3 className="font-semibold mb-2">Recent</h3>
        {funds.length ? (
          <ul className="divide-y divide-gray-100 dark:divide-gray-800">
            {funds.slice().reverse().map((f) => (
              <li key={f.id} className="py-2 flex justify-between">
                <div>
                  <div className="font-medium">{f.source}</div>
                  <div className="text-sm text-gray-500">{f.note}</div>
                </div>
                <div className="text-emerald-500 font-semibold">KSh {Number(f.amount).toLocaleString()}</div>
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
