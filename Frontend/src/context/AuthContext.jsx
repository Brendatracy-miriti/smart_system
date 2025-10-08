import React, { createContext, useContext, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  addUser, findUserByEmail, addStudent, addParent, addTeacher, updateUser
} from "../utils/localData";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [current, setCurrent] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("eg_current_user") || "null");
    } catch { return null; }
  });

  const signup = async ({ name, email, password, role, extra = {} }) => {
    if (findUserByEmail(email)) throw new Error("Email already taken");
    const user = { id: uuidv4(), name, email, password, role, avatarBase64: extra.avatar || null };
    addUser(user);
    // create role profile
    if (role === "student") {
      addStudent({ id: uuidv4(), userId: user.id, admission_number: extra.admission || "", course: extra.course || "", attendance_rate: 0, average_score: 0, courses_count: extra.course ? 1 : 0, completed_assignments: 0, gpa: null, email });
    } else if (role === "parent") {
      addParent({ id: uuidv4(), userId: user.id, childStudentId: extra.childStudentId || null, email });
    } else if (role === "teacher") {
      addTeacher({ id: uuidv4(), userId: user.id, courses: extra.courses || [], email });
    }
    localStorage.setItem("eg_current_user", JSON.stringify(user));
    setCurrent(user);
    return user;
  };

  const login = async ({ email, password }) => {
    const u = findUserByEmail(email);
    if (!u) throw new Error("No account for this email");
    if (u.password !== password) throw new Error("Invalid password");
    localStorage.setItem("eg_current_user", JSON.stringify(u));
    setCurrent(u);
    return u;
  };

  const logout = () => {
    localStorage.removeItem("eg_current_user");
    setCurrent(null);
  };

  const updateAvatar = (base64) => {
    if (!current) return;
    updateUser(current.id, { avatarBase64: base64 });
    const updated = { ...current, avatarBase64: base64 };
    localStorage.setItem("eg_current_user", JSON.stringify(updated));
    setCurrent(updated);
  };

  return (
    <AuthContext.Provider value={{ current, signup, login, logout, updateAvatar }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
