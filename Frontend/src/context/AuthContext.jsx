import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMessage } from "../hooks/useMessage";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const { setMessage } = useMessage();

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("smartedu_user"));
    if (savedUser) setUser(savedUser);
  }, []);

  const login = (username, password) => {
    // Admin special login
    if (username === "Admin" && password === "AdminSystem") {
      const loggedUser = { username, role: "admin" };
      localStorage.setItem("smartedu_user", JSON.stringify(loggedUser));
      setUser(loggedUser);
      setMessage({ type: "success", text: "Welcome back, Admin!" });
      navigate("/admin");
      return;
    }

    // Non-admin login (read from localStorage)
    const registeredUsers = JSON.parse(localStorage.getItem("smartedu_users")) || [];
    const found = registeredUsers.find(
      (u) => u.username === username && u.password === password
    );
    if (found) {
      localStorage.setItem("smartedu_user", JSON.stringify(found));
      setUser(found);
      setMessage({ type: "success", text: `Welcome back, ${found.role}!` });
      navigate(`/${found.role}`);
    } else {
      setMessage({ type: "error", text: "Invalid credentials!" });
    }
  };

  const logout = () => {
    localStorage.removeItem("smartedu_user");
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};


