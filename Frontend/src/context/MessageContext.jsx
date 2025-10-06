import React, { createContext, useContext, useState, useEffect } from "react";

const MessageContext = createContext();

export const MessageProvider = ({ children }) => {
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => setMessage(null), 3500);
    return () => clearTimeout(t);
  }, [message]);

  return (
    <MessageContext.Provider value={{ message, setMessage }}>
      {children}
      {message && (
        <div
          className={`fixed top-6 right-6 z-50 max-w-sm px-4 py-3 rounded-lg shadow-lg transform
            ${
              message.type === "error"
                ? "bg-error text-white"
                : "bg-success text-white"
            }`}
        >
          <div className="font-medium">{message.title || ""}</div>
          <div className="text-sm">{message.text}</div>
        </div>
      )}
    </MessageContext.Provider>
  );
};

export const useMessage = () => useContext(MessageContext);
