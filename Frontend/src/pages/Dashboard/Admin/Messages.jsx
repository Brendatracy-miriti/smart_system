import React, { useState } from "react";
import { motion } from "framer-motion";
import MessageCard from "../../../ui/MessageCard";
import { useData } from "../../../context/DataContext";

export default function Messages() {
  const { data, addMessage } = useData();
  const [showCompose, setShowCompose] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [message, setMessage] = useState("");

  const roles = ["Teacher", "Student", "Parent", "All"];

  const handleRoleChange = (role) => {
    if (role === "All") {
      setSelectedRoles(["All"]);
    } else {
      setSelectedRoles((prev) => {
        const newRoles = prev.includes(role)
          ? prev.filter((r) => r !== role)
          : [...prev.filter((r) => r !== "All"), role];
        return newRoles.length === 0 ? ["All"] : newRoles;
      });
    }
  };

  const messages = data.messages || [];

  const send = () => {
    if (!message) return alert("Enter message");
    if (selectedRoles.length === 0) return alert("Select at least one recipient role");
    const m = {
      id: Date.now(),
      sender: JSON.parse(localStorage.getItem("eg_current_user") || "null")?.name || "Admin",
      to: selectedRoles,
      message,
      date: new Date().toLocaleString(),
    };
    addMessage(m);
    setMessage("");
    setSelectedRoles([]);
    setShowCompose(false);
    window.dispatchEvent(new Event("storage"));
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
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Recipients:</label>
            <div className="flex flex-wrap gap-2">
              {roles.map((role) => (
                <label key={role} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedRoles.includes(role)}
                    onChange={() => handleRoleChange(role)}
                    className="mr-2"
                  />
                  {role}
                </label>
              ))}
            </div>
          </div>
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Write message..." className="w-full p-2 border rounded mb-2" />
          <div className="flex justify-end">
            <button onClick={send} className="px-4 py-2 bg-green-600 text-white rounded">Send</button>
          </div>
        </div>
      )}

      {messages.length === 0 ? (
        <p className="text-gray-500">No messages yet.</p>
      ) : (
        messages.map((m) => <MessageCard key={m.id} sender={m.sender} message={m.message} date={m.date} />)
      )}
    </motion.div>
  );
}
