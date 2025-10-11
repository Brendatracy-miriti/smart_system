import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Bell, Trash2, CheckCircle2, AlertTriangle, Bus, DollarSign, Send } from "lucide-react";
import api from "../../../utils/api";
import { useMessage } from "../../../hooks/useMessage";
import { pushNotification, getNotifications } from "../../../utils/localData";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const { setMessage } = useMessage();

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      try {
        const res = await api.get("notifications/");
        setNotifications(res.data || []);
      } catch {
        // fallback to local storage
        const local = getNotifications();
        setNotifications(local || []);
      }
    } catch (err) {
      setMessage({ type: "error", text: "Failed to fetch notifications." });
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      try {
        await api.post("notifications/mark-all-read/");
        fetchNotifications();
      } catch {
        // fallback to local storage: mark all as read
        const local = getNotifications().map((n) => ({ ...n, read: true }));
        localStorage.setItem("eg_notifications", JSON.stringify(local));
        setNotifications(local);
      }
      setMessage({ type: "success", text: "All notifications marked as read." });
    } catch {
      setMessage({ type: "error", text: "Could not mark all as read." });
    }
  };

  const handleDelete = async (id) => {
    try {
      try {
        await api.delete(`notifications/${id}/`);
      } catch {
        // fallback: remove from local
        const local = getNotifications().filter((n) => n.id !== id);
        // write back
        // eslint-disable-next-line no-undef
        localStorage.setItem("eg_notifications", JSON.stringify(local));
      }
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      setMessage({ type: "success", text: "Notification deleted." });
    } catch {
      setMessage({ type: "error", text: "Failed to delete notification." });
    }
  };

  // compose
  const [compose, setCompose] = useState({ title: "", message: "", type: "system" });
  const handlePost = async () => {
    if (!compose.title.trim() || !compose.message.trim()) {
      setMessage({ type: "error", text: "Please enter title and message." });
      return;
    }

    const payload = {
      title: compose.title,
      message: compose.message,
      type: compose.type,
    };

    try {
      const res = await api.post("notifications/", payload);
      // assume API returns created object
      setNotifications((prev) => [res.data, ...prev]);
      setMessage({ type: "success", text: "Notification posted." });
      setCompose({ title: "", message: "", type: "system" });
    } catch {
      // fallback to local storage
      const saved = pushNotification({ title: payload.title, message: payload.message, type: payload.type, createdAt: new Date().toISOString() });
      setNotifications((prev) => [saved, ...prev]);
      setMessage({ type: "success", text: "Notification saved locally (offline mode)." });
      setCompose({ title: "", message: "", type: "system" });
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const filtered =
    filter === "all"
      ? notifications
      : notifications.filter((n) => n.type === filter);

  const iconMap = {
    transport: <Bus className="text-blue-500" size={20} />,
    fund: <DollarSign className="text-green-500" size={20} />,
    emergency: <AlertTriangle className="text-red-500" size={20} />,
    system: <Bell className="text-yellow-500" size={20} />,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 space-y-6"
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-primary">Notifications Center</h2>
          <p className="text-gray-500 dark:text-gray-400">
            Stay updated with important alerts from all departments.
          </p>
        </div>

        <div className="flex gap-3 items-center">
          <button
            onClick={handleMarkAllRead}
            className="py-2 px-3 rounded-lg bg-primary text-white hover:bg-accent transition"
          >
            Mark all as read
          </button>

          {/* Compose quick post */}
          <div className="flex items-center gap-2">
            <input
              value={compose.title}
              onChange={(e) => setCompose((s) => ({ ...s, title: e.target.value }))}
              placeholder="Title"
              className="px-3 py-2 rounded-lg border bg-white dark:bg-gray-800"
            />
            <select
              value={compose.type}
              onChange={(e) => setCompose((s) => ({ ...s, type: e.target.value }))}
              className="px-2 py-2 rounded-lg border bg-white dark:bg-gray-800"
            >
              <option value="system">System</option>
              <option value="transport">Transport</option>
              <option value="fund">Fund</option>
              <option value="emergency">Emergency</option>
            </select>
            <button
              onClick={handlePost}
              className="py-2 px-3 rounded-lg bg-green-600 text-white hover:bg-green-700 transition flex items-center gap-2"
            >
              <Send size={16} />
              Post
            </button>
          </div>
        </div>
      </div>

      {/* Filter buttons */}
      <div className="flex flex-wrap gap-3">
        {["all", "transport", "fund", "emergency", "system"].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-4 py-2 rounded-lg border ${
              filter === type
                ? "bg-primary text-white border-primary"
                : "bg-transparent border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300"
            }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {/* Notification list */}
  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-5">
        {loading ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-6">
            Loading notifications...
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-6">
            No notifications found.
          </div>
        ) : (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {filtered.map((n) => (
              <motion.li
                key={n.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition ${
                  n.read ? "opacity-75" : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1">{iconMap[n.type] || <Bell size={20} />}</div>
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-100">
                      {n.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{n.message}</p>
                    <span className="text-xs text-gray-400">
                      {new Date(n.createdAt || n.created_at || n.created_at).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="flex gap-3 items-center">
                  {!n.read && (
                    <button
                      onClick={async () => {
                        await api.post(`notifications/${n.id}/mark-read/`);
                        fetchNotifications();
                      }}
                      className="text-green-500 hover:text-green-600"
                    >
                      <CheckCircle2 size={18} />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(n.id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </motion.li>
            ))}
          </ul>
        )}
      </div>
    </motion.div>
  );
}
