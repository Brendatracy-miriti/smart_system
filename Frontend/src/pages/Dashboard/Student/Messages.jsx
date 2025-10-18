import React from "react";
import { motion } from "framer-motion";
import MessageCard from "../../../ui/MessageCard";
import { useData } from "../../../context/DataContext";
import { useAuth } from "../../../context/AuthContext";

export default function Messages() {
  const { data } = useData();
  const { current: user } = useAuth();
  const userRole = user?.role || "student";
  const messages = (data.messages || []).filter((m) =>
    Array.isArray(m.receiverRole) ? m.receiverRole.includes(userRole) || m.receiverRole.includes("All") : m.receiverRole === userRole || m.receiverRole === "All"
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
      <h2 className="text-2xl font-bold text-blue-600 mb-4">Messages</h2>

      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6">
        {messages.length === 0 ? (
          <p className="text-gray-500">No messages yet.</p>
        ) : (
          messages.map((m) => <MessageCard key={m.id} sender={m.senderRole} message={m.content} date={m.timestamp} />)
        )}
      </div>
    </motion.div>
  );
}
