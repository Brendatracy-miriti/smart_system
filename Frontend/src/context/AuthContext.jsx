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

    // If student, also add to students array
    if (newUser.role === "student") {
      const { addStudent } = await import("../utils/localData");
      addStudent({
        id: newUser.id,
        userId: newUser.id,
        name: newUser.name,
        email: newUser.email,
        admission_number: newUser.admission_number,
        course: newUser.course,
        attendance_rate: 80,
        average_score: 70,
        courses_count: 1,
        completed_assignments: 0,
        gpa: 0,
      });
    }

    // If teacher, add to teachers array
    if (newUser.role === "teacher") {
      const { addTeacher } = await import("../utils/localData");
      addTeacher({
        id: newUser.id,
        userId: newUser.id,
        name: newUser.name,
        email: newUser.email,
        courses: newUser.courses || [],
      });
    }

    // If parent, add to parents array
    if (newUser.role === "parent") {
      const { addParent } = await import("../utils/localData");
      addParent({
        id: newUser.id,
        userId: newUser.id,
        name: newUser.name,
        email: newUser.email,
        childStudentId: newUser.childStudentId || null,
      });
    }

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
