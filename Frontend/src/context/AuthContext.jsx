import React, { createContext, useContext, useState, useEffect } from "react";
import { addUser, findUserByEmail, getUsers } from "../utils/localData";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [current, setCurrent] = useState(null);

  useEffect(() => {
    // Check for stored user on mount
    const storedUser = localStorage.getItem("eg_current_user");
    if (storedUser) {
      try {
        setCurrent(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem("eg_current_user");
      }
    }
  }, []);

  const signup = async (userData) => {
    // Add user to localData
    const newUser = addUser(userData);
    setCurrent(newUser);
    localStorage.setItem("eg_current_user", JSON.stringify(newUser));
    return newUser;
  };

  const login = async ({ identifier, password }) => {
    // Find user by email, name, or username (case-insensitive)
    if (!identifier) throw new Error("Invalid credentials");
    const id = String(identifier).trim().toLowerCase();
    const all = getUsers();
    let user = all.find((u) => (u.email && u.email.toLowerCase() === id) || (u.name && u.name.toLowerCase() === id) || (u.username && u.username.toLowerCase() === id));

    if (user && user.password === password.trim()) {
      setCurrent(user);
      localStorage.setItem("eg_current_user", JSON.stringify(user));
      return user;
    }
    throw new Error("Invalid credentials");
  };

  const logout = () => {
    setCurrent(null);
    localStorage.removeItem("eg_current_user");
  };

  const updateAvatar = (base64) => {
    if (!current) return;
    const updated = { ...current, profile_picture: base64 };
    localStorage.setItem("eg_current_user", JSON.stringify(updated));
    setCurrent(updated);
  };

  return (
    <AuthContext.Provider value={{ current, signup, login, logout, updateAvatar }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
