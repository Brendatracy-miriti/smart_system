import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [username, setUsername] = useState("");

  useEffect(() => {
    // Load messages live
    const q = query(collection(db, "messages"), orderBy("createdAt"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = [];
      snapshot.forEach((doc) => {
        msgs.push({ id: doc.id, ...doc.data() });
      });
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !username.trim()) return;

    await addDoc(collection(db, "messages"), {
      username,
      text: newMessage,
      createdAt: serverTimestamp(),
    });

    setNewMessage("");
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = timestamp.toDate();
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div
      className="chat-container"
      style={{
        maxWidth: "400px",
        margin: "auto",
        marginTop: "20px",
        border: "1px solid #ccc",
        borderRadius: "10px",
        padding: "15px",
      }}
    >
      <h2 style={{ textAlign: "center" }}>Edu-Guardian Live Chat</h2>

      {/* Username input */}
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Enter your name..."
        style={{
          width: "100%",
          padding: "8px",
          marginBottom: "10px",
          borderRadius: "5px",
          border: "1px solid #ddd",
        }}
      />

      <div
        className="chat-box"
        style={{
          height: "300px",
          overflowY: "auto",
          border: "1px solid #eee",
          padding: "10px",
          marginBottom: "10px",
          backgroundColor: "#fafafa",
        }}
      >
        {messages.map((msg) => (
          <div key={msg.id} style={{ marginBottom: "8px" }}>
            <strong>{msg.username || "Anonymous"}:</strong> {msg.text}
            <div style={{ fontSize: "0.8em", color: "gray" }}>
              {formatTime(msg.createdAt)}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSend} style={{ display: "flex", gap: "8px" }}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          style={{ flex: 1, padding: "8px" }}
        />
        <button type="submit" style={{ padding: "8px 12px" }}>
          Send
        </button>
      </form>
    </div>
  );
}


