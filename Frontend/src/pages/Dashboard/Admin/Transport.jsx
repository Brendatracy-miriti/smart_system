import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import BusTable from "../../../ui/BusTable";
import TransportLogList from "../../../ui/TransportLogList";
import { useMessage } from "../../../hooks/useMessage";
import { useData } from "../../../context/DataContext";

export default function Transport() {
  const [buses, setBuses] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { setMessage } = useMessage();
  const { data, addBus, upsertBus, setData } = useData();

  useEffect(() => {
    // load from DataContext/localStorage
    const localBuses = Array.isArray(data?.buses) ? data.buses : [];
    const localLogs = Array.isArray(data?.transportLogs) ? data.transportLogs : [];
    setBuses(localBuses);
    setLogs(localLogs);
    setLoading(false);
  }, [data]);

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
