import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import api from "../../../utils/api";
import { useMessage } from "../../../context/MessageContext";

export default function Messages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const { setMessage } = useMessage();

  useEffect(() => {
    let mounted = true;
    const fetchMessages = async () => {
      try {
        const res = await api.get("student/messages/");
        if (!mounted) return;
        setMessages(res.data || []);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setMessage({ type: "error", text: "Failed to fetch messages." });
        setLoading(false);
      }
    };
    fetchMessages();
    return () => (mounted = false);
  }, [setMessage]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
      <h2 className="text-2xl font-bold text-blue-600 mb-4">Messages</h2>

      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6">
        {loading ? (
          <p className="text-gray-500">Loading messages...</p>
        ) : messages.length ? (
          <ul className="space-y-3">
            {messages.map((m) => (
              <li key={m.id} className="p-4 border rounded-lg border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-3 mb-1">
                  <MessageCircle className="text-blue-500" size={18} />
                  <p className="font-medium text-gray-800 dark:text-gray-200">{m.title}</p>
                </div>
                <p className="text-sm text-gray-500">{m.content}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(m.created_at).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No messages available.</p>
        )}
      </div>
    </motion.div>
  );
}
