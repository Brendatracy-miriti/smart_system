import React, { createContext, useContext, useEffect, useState } from "react";

const DataContext = createContext();

export function DataProvider({ children }) {
  const [data, setData] = useState({
    users: JSON.parse(localStorage.getItem("users") || "[]"),
    assignments: JSON.parse(localStorage.getItem("assignments") || "[]"),
    submissions: JSON.parse(localStorage.getItem("submissions") || "[]"),
    buses: JSON.parse(localStorage.getItem("buses") || "[]"),
  });

  useEffect(() => {
    Object.entries(data).forEach(([k, v]) => {
      localStorage.setItem(k, JSON.stringify(v || []));
    });
    window.dispatchEvent(new Event("storage"));
  }, [data]);

  const addAssignment = (a) =>
    setData((p) => ({ ...p, assignments: [...p.assignments, a] }));

  const addSubmission = (s) =>
    setData((p) => ({ ...p, submissions: [...p.submissions, s] }));

  const updateUser = (id, patch) => {
    setData((p) => ({
      ...p,
      users: p.users.map((u) => (u.id === id ? { ...u, ...patch } : u)),
    }));
    const cur = JSON.parse(localStorage.getItem("eg_current_user") || "null");
    if (cur?.id === id)
      localStorage.setItem("eg_current_user", JSON.stringify({ ...cur, ...patch }));
  };

  const refresh = () =>
    setData({
      users: JSON.parse(localStorage.getItem("users") || "[]"),
      assignments: JSON.parse(localStorage.getItem("assignments") || "[]"),
      submissions: JSON.parse(localStorage.getItem("submissions") || "[]"),
      buses: JSON.parse(localStorage.getItem("buses") || "[]"),
    });

  return (
    <DataContext.Provider
      value={{ data, setData, addAssignment, addSubmission, updateUser, refresh }}
    >
      {children}
    </DataContext.Provider>
  );
}
export const useData = () => useContext(DataContext);
