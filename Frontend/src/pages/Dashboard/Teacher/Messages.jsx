import React, { useState } from "react";
import { motion } from "framer-motion";
import MessageCard from "../../../ui/MessageCard";
import { useData } from "../../../context/DataContext";
import { useAuth } from "../../../context/AuthContext";
import { useMessage } from "../../../context/MessageContext";

export default function Messages() {
  const { data, sendMessage } = useData();
  const { current: user } = useAuth();
  const { setMessage } = useMessage();
  const [showCompose, setShowCompose] = useState(false);
  const [receiverRole, setReceiverRole] = useState("");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");

  const userRole = user?.role || "teacher";
  const messages = (data.messages || []).filter((m) =>
    Array.isArray(m.receiverRole) ? m.receiverRole.includes(userRole) || m.receiverRole.includes("All") : m.receiverRole === userRole || m.receiverRole === "All"
  );

  const send = () => {
    if (!content) return alert("Enter message");
    sendMessage({
      senderRole: userRole,
      receiverRole: receiverRole || "All",
      subject: subject || "Message",
      content,
    });
    setMessage({ type: "success", text: "Message sent successfully!" });
    setContent("");
    setSubject("");
    setReceiverRole("");
    setShowCompose(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="p-6"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-primary">Messages & Announcements</h2>
        <button onClick={() => setShowCompose((s) => !s)} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-accent">
          {showCompose ? "Close" : "Compose Message"}
        </button>
      </div>

      {showCompose && (
        <div className="bg-white dark:bg-[#1F2937] p-4 rounded-2xl shadow mb-4">
          <input value={receiverRole} onChange={(e) => setReceiverRole(e.target.value)} placeholder="To (role, e.g., student, parent, All)" className="w-full p-2 border rounded mb-2" />
          <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject" className="w-full p-2 border rounded mb-2" />
          <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Write message..." className="w-full p-2 border rounded mb-2" />
          <div className="flex justify-end">
            <button onClick={send} className="px-4 py-2 bg-green-600 text-white rounded">Send</button>
          </div>
        </div>
      )}

      {messages.length === 0 ? (
        <p className="text-gray-500">No messages yet.</p>
      ) : (
        messages.map((m) => <MessageCard key={m.id} sender={m.senderRole} message={m.content} date={m.timestamp} />)
      )}
    </motion.div>
  );
}
