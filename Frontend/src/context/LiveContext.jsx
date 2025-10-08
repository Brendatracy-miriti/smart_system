import React, { createContext, useContext, useEffect, useState } from "react";
import {
  getUsers,
  getStudents,
  getTeachers,
  getParents,
  getAssignments,
  getSubmissions,
  getAttendance,
  getTimetables,
  getTransport,
  getNotifications,
  getGrades,
} from "../utils/localData";

const LiveContext = createContext();

export function LiveProvider({ children }) {
  const [users, setUsers] = useState([]);
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [parents, setParents] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [timetables, setTimetables] = useState([]);
  const [transport, setTransport] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [grades, setGrades] = useState([]);

  const refresh = () => {
    setUsers(getUsers());
    setStudents(getStudents());
    setTeachers(getTeachers());
    setParents(getParents());
    setAssignments(getAssignments());
    setSubmissions(getSubmissions());
    setAttendance(getAttendance());
    setTimetables(getTimetables());
    setTransport(getTransport());
    setNotifications(getNotifications());
    setGrades(getGrades());
  };

  useEffect(() => {
    refresh();
    // also listen to storage events (other tabs)
    const onStorage = (e) => {
      if (e.key && e.key.startsWith("eg_")) refresh();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return (
    <LiveContext.Provider value={{
      users, students, teachers, parents, assignments, submissions, attendance, timetables, transport, notifications, grades, refresh
    }}>
      {children}
    </LiveContext.Provider>
  );
}

export const useLive = () => useContext(LiveContext);
