import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../../../utils/api";
import { useMessage } from "../../../context/MessageContext";

export default function ParentDashboard() {
  const [loading, setLoading] = useState(true);
  const [child, setChild] = useState(null);
  const [transportLogs, setTransportLogs] = useState([]);
  const { setMessage } = useMessage();

  useEffect(() => {
    let mounted = true;

    const fetchParentData = async () => {
      setLoading(true);
      try {
        const [childRes, logsRes] = await Promise.all([
          api.get("my/child/"),
          api.get("transport/my_child/"),
        ]);

        if (!mounted) return;
        setChild(childRes.data || null);
        setTransportLogs(Array.isArray(logsRes.data) ? logsRes.data : []);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setMessage({ type: "error", text: "Could not fetch parent data." });
        setLoading(false);
      }
    };

    fetchParentData();
    return () => { mounted = false; };
  }, [setMessage]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="p-6 space-y-6"
    >
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-primary mb-2">Parent Dashboard</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Monitor your child’s academic and transport activity.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Child Info & Transport */}
        <div className="lg:col-span-2 bg-white dark:bg-[#071027] p-5 rounded-2xl shadow-sm space-y-6">
          <section>
            <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-100 mb-3">
              My Child
            </h3>

            {loading ? (
              <p className="text-gray-500">Loading child info...</p>
            ) : child ? (
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <p className="text-lg font-medium">
                  {child.user?.full_name || child.name}
                </p>
                <p className="text-sm text-gray-500">
                  Admission: {child.admission_number}
                </p>
                <div className="mt-3 text-sm space-y-1">
                  <p>
                    Average Score:{" "}
                    <span className="font-semibold">
                      {child.average_score ?? "N/A"}
                    </span>
                  </p>
                  <p>
                    Attendance:{" "}
                    <span className="font-semibold">
                      {child.attendance_rate ?? "N/A"}%
                    </span>
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">No child linked to this account yet.</p>
            )}
          </section>

          <section>
            <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-100 mb-2">
              Bus Tracking
            </h3>

            {transportLogs.length ? (
              <div className="space-y-2">
                {transportLogs.map((log, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-md border border-gray-200 dark:border-gray-700"
                  >
                    <p className="font-medium text-sm text-gray-800 dark:text-gray-100">
                      {log.status}
                    </p>
                    <p className="text-xs text-gray-500">
                      Bus: {log.bus_id} |{" "}
                      {new Date(log.timestamp).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No transport logs yet for your child.</p>
            )}
          </section>
        </div>

        {/* Notifications */}
        <div className="bg-white dark:bg-[#071027] p-5 rounded-2xl shadow-sm">
          <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-100 mb-3">
            Notifications
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            You’ll receive real-time updates here when your child’s bus
            activity or performance changes.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
