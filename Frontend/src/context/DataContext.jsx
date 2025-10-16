import React, { createContext, useContext, useEffect, useState } from "react";

const DataContext = createContext();

export { DataContext };

export const DataProvider = ({ children }) => {
  const [data, setData] = useState({
    users: JSON.parse(localStorage.getItem("users") || localStorage.getItem("eg_users") || "[]"),
    assignments: JSON.parse(localStorage.getItem("assignments") || localStorage.getItem("eg_assignments") || "[]"),
    submissions: JSON.parse(localStorage.getItem("submissions") || localStorage.getItem("eg_submissions") || "[]"),
    buses: JSON.parse(localStorage.getItem("buses") || localStorage.getItem("eg_transport") || "[]"),
    funds: JSON.parse(localStorage.getItem("funds") || "[]"),
    mentorships: JSON.parse(localStorage.getItem("mentorships") || localStorage.getItem("eg_mentorships") || "[]"),
    messages: JSON.parse(localStorage.getItem("messages") || localStorage.getItem("eg_notifications") || "[]"),
    timetable: JSON.parse(localStorage.getItem("timetable") || localStorage.getItem("eg_timetables") || "[]"),
    attendance: JSON.parse(localStorage.getItem("attendance") || localStorage.getItem("eg_attendance") || "[]"),
    grades: JSON.parse(localStorage.getItem("grades") || localStorage.getItem("eg_grades") || "[]"),
  });

  useEffect(() => {
    try {
      // persist canonical keys
      Object.entries(data).forEach(([k, v]) => {
        localStorage.setItem(k, JSON.stringify(v || []));
      });
      // persist eg_ prefixed keys for compatibility with utils/localData.js
      try {
        localStorage.setItem("eg_users", JSON.stringify(data.users || []));
        localStorage.setItem("eg_students", JSON.stringify(data.students || [] || []));
        localStorage.setItem("eg_parents", JSON.stringify(data.parents || []));
        localStorage.setItem("eg_assignments", JSON.stringify(data.assignments || []));
        localStorage.setItem("eg_submissions", JSON.stringify(data.submissions || []));
        localStorage.setItem("eg_transport", JSON.stringify(data.buses || []));
        localStorage.setItem("eg_notifications", JSON.stringify(data.messages || []));
        localStorage.setItem("eg_timetables", JSON.stringify(data.timetable || []));
        localStorage.setItem("eg_attendance", JSON.stringify(data.attendance || []));
        localStorage.setItem("eg_grades", JSON.stringify(data.grades || []));
      } catch (e) {
        // ignore eg_ write errors
      }
      window.dispatchEvent(new Event("storage"));
    } catch (err) {
      // ignore storage errors
    }
  }, [data]);

  // helpers
  const addUser = (user) => {
    const u = { is_active: true, ...user };
    setData((p) => ({ ...p, users: [...p.users, u] }));
    return u;
  };

  const updateUser = (id, patch) =>
    setData((p) => ({
      ...p,
      users: p.users.map((u) => (u.id === id ? { ...u, ...patch } : u)),
    }));

  const addAssignment = (a) => setData((p) => ({ ...p, assignments: [...p.assignments, a] }));

  const addSubmission = (s) => setData((p) => ({ ...p, submissions: [...p.submissions, s] }));

  const addMessage = (m) => setData((p) => ({ ...p, messages: [...p.messages, m] }));

  const addBus = (b) => setData((p) => ({ ...p, buses: [...p.buses, b] }));

  const upsertBus = (b) =>
    setData((p) => {
      const exists = p.buses.find((x) => x.id === b.id || x.busId === b.busId);
      if (exists) {
        return { ...p, buses: p.buses.map((x) => (x.id === exists.id || x.busId === exists.busId ? { ...x, ...b } : x)) };
      }
      return { ...p, buses: [...p.buses, b] };
    });

  const addFund = (f) => setData((p) => ({ ...p, funds: [...p.funds, f] }));

  const updateFund = (id, patch) =>
    setData((p) => ({ ...p, funds: p.funds.map((x) => (x.id === id ? { ...x, ...patch } : x)) }));

  const deleteFund = (id) =>
    setData((p) => ({ ...p, funds: p.funds.filter((x) => x.id !== id) }));

  const requestMentorship = (studentId, teacherId) =>
    setData((p) => ({ ...p, mentorships: [...p.mentorships, { id: Date.now(), studentId, teacherId, status: "pending", createdAt: new Date().toISOString() }] }));

  const addMentorshipSession = (session) =>
    setData((p) => ({ ...p, mentorships: [...p.mentorships, session] }));

  const updateMentorshipStatus = (id, status) =>
    setData((p) => ({ ...p, mentorships: p.mentorships.map((m) => (m.id === id ? { ...m, status } : m)) }));

  const refresh = () =>
    setData({
      users: JSON.parse(localStorage.getItem("users") || localStorage.getItem("eg_users") || "[]"),
      assignments: JSON.parse(localStorage.getItem("assignments") || localStorage.getItem("eg_assignments") || "[]"),
      submissions: JSON.parse(localStorage.getItem("submissions") || localStorage.getItem("eg_submissions") || "[]"),
      buses: JSON.parse(localStorage.getItem("buses") || localStorage.getItem("eg_transport") || "[]"),
      funds: JSON.parse(localStorage.getItem("funds") || "[]"),
      mentorships: JSON.parse(localStorage.getItem("mentorships") || localStorage.getItem("eg_mentorships") || "[]"),
      messages: JSON.parse(localStorage.getItem("messages") || localStorage.getItem("eg_notifications") || "[]"),
      timetable: JSON.parse(localStorage.getItem("timetable") || localStorage.getItem("eg_timetables") || "[]"),
      attendance: JSON.parse(localStorage.getItem("attendance") || localStorage.getItem("eg_attendance") || "[]"),
      grades: JSON.parse(localStorage.getItem("grades") || localStorage.getItem("eg_grades") || "[]"),
    });

  // Risk calculation helpers
  const calculateRisk = (student) => {
    const attendanceRisk = 100 - (student.attendanceRate || 0);
    const gradeRisk = 70 - (student.avgScore || 0);
    const score = (attendanceRisk * 0.5) + (gradeRisk * 0.5);
    return score > 25 ? "At-Risk" : "Safe";
  };

  const getAtRiskStudents = () => {
    return data.users
      .filter((u) => u.role === "student")
      .map((s) => ({ ...s, risk: calculateRisk(s) }))
      .filter((s) => s.risk === "At-Risk");
  };

  return (
    <DataContext.Provider
      value={{
        data,
        setData,
        addUser,
        updateUser,
        addAssignment,
        addSubmission,
        addMessage,
        addBus,
        upsertBus,
        addFund,
        updateFund,
        deleteFund,
        requestMentorship,
        updateMentorshipStatus,
        refresh,
        calculateRisk,
        getAtRiskStudents,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
