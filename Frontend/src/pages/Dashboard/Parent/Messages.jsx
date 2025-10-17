import React from "react";
import { motion } from "framer-motion";
import MessageCard from "../../../ui/MessageCard";
import { useData } from "../../../context/DataContext";

export default function Messages() {
  const { data } = useData();
  const userRole = JSON.parse(localStorage.getItem("eg_current_user") || "null")?.role || "parent";
  const messages = (data.messages || []).filter((m) =>
    Array.isArray(m.to) ? m.to.includes(userRole) || m.to.includes("All") : m.to === userRole || m.to === "All"
  );

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="p-6">
      <h2 className="text-2xl font-bold text-primary mb-4">Messages</h2>
      {messages.length === 0 ? (
        <p className="text-gray-500">No messages yet.</p>
      ) : (
        messages.map((m) => <MessageCard key={m.id} sender={m.sender} message={m.message} date={m.date} />)
      )}
    </motion.div>
  );
}
