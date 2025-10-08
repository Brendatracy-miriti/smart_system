import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import BusTable from "../../../ui/BusTable";
import TransportLogList from "../../../ui/TransportLogList";
import api from "../../../utils/api";
import { useMessage } from "../../../hooks/useMessage";

export default function Transport() {
  const [buses, setBuses] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { setMessage } = useMessage();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [busRes, logRes] = await Promise.all([
          api.get("transport/"),
          api.get("transport/logs/"),
        ]);
        setBuses(busRes.data || []);
        setLogs(logRes.data || []);
      } catch {
        setMessage({ type: "error", text: "Could not fetch transport data." });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [setMessage]);

  const handleView = (bus) => {
    setMessage({
      type: "info",
      text: `Opening map for bus ${bus.plate || bus.id}...`,
    });
    // later: navigate to /map/:bus_id or open modal with live map
  };

  const handleSOS = (bus) => {
    setMessage({
      type: "warning",
      text: `SOS alert sent for bus ${bus.plate || bus.id}!`,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="p-6 space-y-6"
    >
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-primary">Transport Management</h2>
          <p className="text-gray-500 dark:text-gray-400">
            Monitor buses, drivers, and live movement logs.
          </p>
        </div>
        <button
          onClick={() => setMessage({ type: "info", text: "Add Bus modal coming soon!" })}
          className="py-2 px-4 rounded-lg bg-primary text-white hover:bg-accent transition"
        >
          + Add Bus
        </button>
      </div>

      <BusTable buses={buses} loading={loading} onView={handleView} onSOS={handleSOS} />

      <TransportLogList logs={logs} />
    </motion.div>
  );
}
