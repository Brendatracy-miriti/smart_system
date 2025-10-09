import React, { useState } from "react";
import { motion } from "framer-motion";
import { Users, MessageCircle, Heart } from "lucide-react";

export default function Mentorship() {
  const [sessions, setSessions] = useState([]);
  const [topic, setTopic] = useState("");
  const [note, setNote] = useState("");

  const addSession = (e) => {
    e.preventDefault();
    if (!topic) return;
    setSessions([
      ...sessions,
      { id: Date.now(), topic, note, date: new Date().toLocaleDateString() },
    ]);
    setTopic("");
    setNote("");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 space-y-6"
    >
      <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
        <Heart className="text-rose-500" /> Mentorship & Guidance
      </h2>
      <p className="text-gray-500 dark:text-gray-400">
        Support and guide students emotionally and academically.
      </p>

      {/* New Session Form */}
      <form onSubmit={addSession} className="space-y-4 bg-white dark:bg-gray-900 p-5 rounded-2xl shadow">
        <input
          placeholder="Mentorship Topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="w-full p-3 border rounded-lg dark:border-gray-700 bg-transparent"
        />
        <textarea
          placeholder="Notes / Summary"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          className="w-full p-3 border rounded-lg dark:border-gray-700 bg-transparent"
        />
        <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-accent transition">
          Add Session
        </button>
      </form>

      {/* Sessions List */}
      <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl shadow space-y-3">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <Users size={18} /> Previous Sessions
        </h3>
        {sessions.length ? (
          <ul className="space-y-2">
            {sessions.map((s) => (
              <li
                key={s.id}
                className="p-3 border border-gray-100 dark:border-gray-700 rounded-lg"
              >
                <p className="font-semibold">{s.topic}</p>
                <p className="text-sm text-gray-500">{s.note}</p>
                <p className="text-xs text-gray-400">{s.date}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No sessions yet.</p>
        )}
      </div>
    </motion.div>
  );
}
