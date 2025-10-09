import React, { createContext, useContext, useState, useEffect } from "react";

// Central live data store using localStorage — replaces backend API calls
const LiveContext = createContext();

export const LiveProvider = ({ children }) => {
  const [data, setData] = useState({
    users: JSON.parse(localStorage.getItem("users")) || [],
    assignments: JSON.parse(localStorage.getItem("assignments")) || [],
    grades: JSON.parse(localStorage.getItem("grades")) || [],
    attendance: JSON.parse(localStorage.getItem("attendance")) || [],
    timetable: JSON.parse(localStorage.getItem("timetable")) || [],
    messages: JSON.parse(localStorage.getItem("messages")) || [],
  });

  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(data.users));
    localStorage.setItem("assignments", JSON.stringify(data.assignments));
    localStorage.setItem("grades", JSON.stringify(data.grades));
    localStorage.setItem("attendance", JSON.stringify(data.attendance));
    localStorage.setItem("timetable", JSON.stringify(data.timetable));
    localStorage.setItem("messages", JSON.stringify(data.messages));
  }, [data]);

  return (
    <LiveContext.Provider value={{ data, setData }}>
      {children}
    </LiveContext.Provider>
  );
};

export const useLive = () => useContext(LiveContext);
