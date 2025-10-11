import React, { createContext, useContext, useEffect, useState } from "react";

const DataContext = createContext();

export { DataContext };

export const DataProvider = ({ children }) => {
  const [data, setData] = useState({
    users: JSON.parse(localStorage.getItem("users") || "[]"),
    assignments: JSON.parse(localStorage.getItem("assignments") || "[]"),
    submissions: JSON.parse(localStorage.getItem("submissions") || "[]"),
    buses: JSON.parse(localStorage.getItem("buses") || "[]"),
    funds: JSON.parse(localStorage.getItem("funds") || "[]"),
    mentorships: JSON.parse(localStorage.getItem("mentorships") || "[]"),
    messages: JSON.parse(localStorage.getItem("messages") || "[]"),
    timetable: JSON.parse(localStorage.getItem("timetable") || "[]"),
    attendance: JSON.parse(localStorage.getItem("attendance") || "[]"),
    grades: JSON.parse(localStorage.getItem("grades") || "[]"),
  });

  useEffect(() => {
    Object.entries(data).forEach(([k, v]) => {
      localStorage.setItem(k, JSON.stringify(v || []));
    });
    window.dispatchEvent(new Event("storage"));
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

  const updateMentorshipStatus = (id, status) =>
    setData((p) => ({ ...p, mentorships: p.mentorships.map((m) => (m.id === id ? { ...m, status } : m)) }));

  const refresh = () =>
    setData({
      users: JSON.parse(localStorage.getItem("users") || "[]"),
      assignments: JSON.parse(localStorage.getItem("assignments") || "[]"),
      submissions: JSON.parse(localStorage.getItem("submissions") || "[]"),
      buses: JSON.parse(localStorage.getItem("buses") || "[]"),
      funds: JSON.parse(localStorage.getItem("funds") || "[]"),
      mentorships: JSON.parse(localStorage.getItem("mentorships") || "[]"),
      messages: JSON.parse(localStorage.getItem("messages") || "[]"),
      timetable: JSON.parse(localStorage.getItem("timetable") || "[]"),
      attendance: JSON.parse(localStorage.getItem("attendance") || "[]"),
      grades: JSON.parse(localStorage.getItem("grades") || "[]"),
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
