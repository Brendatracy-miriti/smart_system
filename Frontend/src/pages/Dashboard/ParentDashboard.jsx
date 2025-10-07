// src/pages/Dashboard/ParentDashboard.jsx
import React, { useEffect, useState } from "react";
import { MapPin, UserCheck } from "lucide-react";
import AreaSpark from "../../components/AreaSpark";
import api from "../../utils/api";
import { useMessage } from "../../context/MessageContext";
import { motion } from "framer-motion";

export default function ParentDashboard() {
  const [loading, setLoading] = useState(true);
  const [child, setChild] = useState(null);
  const [transportLogs, setTransportLogs] = useState([]);
  const { setMessage } = useMessage();

  useEffect(() => {
    let mounted = true;
    const fetchParent = async () => {
      setLoading(true);
      try {
        // adjust endpoints as needed. Assume backend can return parent->child relation
        const childRes = await api.get("my/child/"); // e.g. returns child object
        const logsRes = await api.get("transport/my_child/"); // logs for that child
        if (!mounted) return;
        setChild(childRes.data || null);
        setTransportLogs(Array.isArray(logsRes.data) ? logsRes.data : []);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
        setMessage({ type: "error", text: "Could not fetch parent data" });
      }
    };

    fetchParent();
    return () => { mounted = false; };
  }, [setMessage]);

  return (
    <div>
      <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-2xl font-bold text-primary mb-4">
        Parent Dashboard
      </motion.h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-[#071027] p-5 rounded-2xl shadow-sm">
          <h3 className="font-semibold text-textBody dark:text-gray-200 mb-3">My child</h3>

          {loading ? (
            <div className="text-gray-500">Loading child info...</div>
          ) : child ? (
            <div className="p-4 border rounded-lg border-gray-100 dark:border-gray-700">
              <div className="font-medium text-lg">{child.user?.full_name || child.user?.username || child.name}</div>
              <div className="text-sm text-gray-500">Admission: {child.admission_number}</div>
              <div className="mt-3">
                <div className="text-sm text-gray-500">Average score: <span className="font-semibold">{child.average_score ?? "N/A"}</span></div>
                <div className="text-sm text-gray-500">Attendance: <span className="font-semibold">{child.attendance_rate ?? "N/A"}%</span></div>
              </div>
            </div>
          ) : (
            <div className="text-gray-500">No child linked to this account yet.</div>
          )}

          <div className="mt-6">
            <h4 className="font-semibold text-textBody dark:text-gray-200 mb-2">Bus tracking</h4>
            {transportLogs.length ? (
              <div className="space-y-2">
                {transportLogs.map((l, i) => (
                  <div key={i} className="p-2 rounded-md border border-gray-100 dark:border-gray-700">
                    <div className="text-sm font-medium">{l.status}</div>
                    <div className="text-xs text-gray-500">{new Date(l.timestamp).toLocaleString()}</div>
                    <div className="text-xs text-gray-500">Bus: {l.bus_id}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-500">No transport logs yet for your child.</div>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-[#071027] p-5 rounded-2xl shadow-sm">
          <h4 className="font-semibold text-textBody dark:text-gray-200 mb-3">Notifications</h4>
          <div className="text-sm text-gray-500">You’ll get real-time updates here when the bus is tracked or an alert is issued.</div>
        </div>
      </div>
    </div>
  );
}
