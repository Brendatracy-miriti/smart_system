import React, { createContext, useContext, useState } from "react";
import { DataContext } from "./DataContext";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const { createUser, findUserByEmail, createStudentProfile, createParentProfile, createTeacherProfile } = useContext(DataContext);
  const [current, setCurrent] = useState(() => {
    try {
      const raw = localStorage.getItem("eduguardian_auth");
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  });

  const signup = async ({ name, email, password, role, extra }) => {
    // extra contains role specific fields (course, admission, childStudentId, courses for teacher)
    if (findUserByEmail(email)) throw new Error("Email already in use");
    const user = createUser({ name, email, password, role, avatarBase64: extra?.avatar || null });
    // create role profile
    if (role === "student") {
      const student = createStudentProfile({ userId: user.id, admission_number: extra.admission, course: extra.course });
      // optionally create class mapping later
    } else if (role === "parent") {
      createParentProfile({ userId: user.id, childStudentId: extra.childStudentId });
    } else if (role === "teacher") {
      createTeacherProfile({ userId: user.id, courses: extra.courses || [] });
    }

    // auto-login
    setCurrent(user);
    localStorage.setItem("eduguardian_auth", JSON.stringify(user));
    return user;
  };

  const login = async ({ email, password }) => {
    const user = findUserByEmail(email);
    if (!user) throw new Error("User not found");
    if (user.password !== password) throw new Error("Invalid password");
    setCurrent(user);
    localStorage.setItem("eduguardian_auth", JSON.stringify(user));
    return user;
  };

  const logout = () => {
    setCurrent(null);
    localStorage.removeItem("eduguardian_auth");
  };

  return (
    <AuthContext.Provider value={{ current, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
