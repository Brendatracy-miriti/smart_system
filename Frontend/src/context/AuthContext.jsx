import React, { createContext, useContext, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  addUser, findUserByEmail, addStudent, addParent, addTeacher, updateUser, ensureAdmin, getUsers, getStudents
} from "../utils/localData";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [current, setCurrent] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("eg_current_user") || "null");
    } catch { return null; }
  });

  useEffect(() => {
    // Seed default admin user if none exists
    ensureAdmin({ id: uuidv4(), name: "Admin", email: "Admin", password: "AdminSystem", role: "admin", avatarBase64: null });
  }, []);

  const signup = async ({ name, email, password, role, extra = {} }) => {
    // disallow creating admin accounts via signup form
    if ((role || "").toLowerCase() === "admin") {
      throw new Error("Admin accounts cannot be created via signup. Please use the login page with the admin credentials.");
    }
    if (findUserByEmail(email)) throw new Error("Email already taken");
    const user = { id: uuidv4(), name, email, password, role, avatarBase64: extra.avatar || null };
    addUser(user);
    // create role profile
    if (role === "student") {
      addStudent({ id: uuidv4(), userId: user.id, admission_number: extra.admission || "", course: extra.course || "", attendance_rate: 0, average_score: 0, courses_count: extra.course ? 1 : 0, completed_assignments: 0, gpa: null, email });
    } else if (role === "parent") {
      // try to resolve the provided child reference (admission number / id / username) to the canonical student id
      let childId = null;
      try {
        const q = (extra.childStudentId || "").toString().trim();
        if (q) {
          const students = getStudents();
          const found = students.find((s) => (s.admission_number && s.admission_number === q) || s.id === q || (s.username && s.username === q) || s.userId === q);
          if (found) childId = found.id;
          else {
            // fallback: check users list for a student user and attempt to find student profile by userId
            const users = getUsers();
            const u = users.find((u) => u.role === "student" && ((u.admission_number && u.admission_number === q) || u.id === q || (u.username && u.username === q)));
            if (u) {
              const linked = students.find((s) => s.userId === u.id);
              if (linked) childId = linked.id;
            }
          }
        }
      } catch (e) {
        // ignore resolution errors - we'll store null if not found
      }

      addParent({ id: uuidv4(), userId: user.id, childStudentId: childId, email });
    } else if (role === "teacher") {
      addTeacher({ id: uuidv4(), userId: user.id, courses: extra.courses || [], email });
    }
    localStorage.setItem("eg_current_user", JSON.stringify(user));
    setCurrent(user);
    return user;
  };

  // login accepts either an email or a username (identifier)
  const login = async ({ email, password, identifier }) => {
    // ensure default admin exists (covers fresh installs / race conditions)
    ensureAdmin({ id: uuidv4(), name: "Admin", email: "Admin", password: "AdminSystem", role: "admin", avatarBase64: null });

    const idRaw = (email || identifier || "").trim();
    if (!idRaw) throw new Error("Missing login identifier");
    const id = idRaw.toLowerCase();

    // search users case-insensitively by email, username or name
    const all = getUsers();
    let u = all.find((x) => (x.email || "").toLowerCase() === id);
    if (!u) {
      u = all.find((x) => (x.username || "").toLowerCase() === id || (x.name || "").toLowerCase() === id);
    }

    if (!u) throw new Error("No account for this identifier");
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
