import React from "react";
import { motion } from "framer-motion";
import MessageCard from "../../../ui/MessageCard";

export default function Messages() {
  const messages = [
    {
      sender: "Principal",
      message: "Staff meeting scheduled on Friday 10am.",
      date: "Oct 7, 2025",
    },
    {
      sender: "Parent – Jane W.",
      message: "Could you share John’s assignment progress?",
      date: "Oct 6, 2025",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="p-6"
    >
      <h2 className="text-2xl font-bold text-primary mb-4">Messages & Announcements</h2>
      {messages.map((m, i) => (
        <MessageCard key={i} {...m} />
      ))}
      <button className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-accent">
        Compose Message
      </button>
    </motion.div>
  );
}
