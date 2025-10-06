import React, { createContext, useContext, useState } from "react";
import api from "../utils/api";
import { useMessage } from "./MessageContext";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const { setMessage } = useMessage();

  const login = async (email, password) => {
    try {
      const res = await api.post("auth/login/", { email, password }); // adjust endpoint
      // expect token or user
      setUser(res.data.user || res.data);
      setMessage({ type: "success", text: "Umeingia vizuri" });
      return res.data;
    } catch (err) {
      const errText =
        err?.response?.data?.detail || err?.response?.data?.error || "Login failed";
      setMessage({ type: "error", text: errText });
      throw err;
    }
  };

  const signup = async (payload) => {
    try {
      const res = await api.post("auth/register/", payload); // adjust endpoint
      setUser(res.data.user || res.data);
      setMessage({ type: "success", text: "Account imejengwa, welcome!" });
      return res.data;
    } catch (err) {
      const errText =
        err?.response?.data?.detail ||
        JSON.stringify(err?.response?.data) ||
        "Signup failed";
      setMessage({ type: "error", text: errText });
      throw err;
    }
  };

  const logout = () => {
    setUser(null);
    setMessage({ type: "success", text: "Logged Out" });
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
