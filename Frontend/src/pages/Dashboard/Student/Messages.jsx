import React from "react";
import { motion } from "framer-motion";
import MessageCard from "../../../ui/MessageCard";
import { useData } from "../../../context/DataContext";

export default function Messages() {
  const { data } = useData();
  const messages = data.messages || [];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
      <h2 className="text-2xl font-bold text-blue-600 mb-4">Messages</h2>

      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6">
        {messages.length === 0 ? (
          <p className="text-gray-500">No messages yet.</p>
        ) : (
          messages.map((m) => <MessageCard key={m.id} sender={m.sender} message={m.message} date={m.date} />)
        )}
      </div>
    </motion.div>
  );
}
