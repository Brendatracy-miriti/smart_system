import React from "react";
import { motion } from "framer-motion";
import MessageCard from "../../../ui/MessageCard";

export default function Messages() {
  const messages = [
    { sender: "Class Teacher", message: "John was punctual today!", date: "Oct 7, 2025" },
    { sender: "School Admin", message: "Midterm exams start next week.", date: "Oct 6, 2025" },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="p-6">
      <h2 className="text-2xl font-bold text-primary mb-4">Messages</h2>
      {messages.map((m, i) => (
        <MessageCard key={i} {...m} />
      ))}
    </motion.div>
  );
}
