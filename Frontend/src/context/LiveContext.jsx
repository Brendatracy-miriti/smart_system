import React, { createContext, useContext, useState, useEffect } from "react";
import { getStudents, getParents, getUsers } from "../utils/localData";

// Central live data store using localStorage — replaces backend API calls
const LiveContext = createContext();

export const LiveProvider = ({ children }) => {
  // initialize by reading both the standard keys and the eg_ localData stores
  const [data, setData] = useState({
    users: JSON.parse(localStorage.getItem("users")) || getUsers() || [],
    students: JSON.parse(localStorage.getItem("students")) || getStudents() || [],
    parents: JSON.parse(localStorage.getItem("parents")) || getParents() || [],
    assignments: JSON.parse(localStorage.getItem("assignments")) || [],
    grades: JSON.parse(localStorage.getItem("grades")) || [],
    attendance: JSON.parse(localStorage.getItem("attendance")) || [],
    timetable: JSON.parse(localStorage.getItem("timetable")) || [],
    messages: JSON.parse(localStorage.getItem("messages")) || [],
  });

  useEffect(() => {
    // persist both canonical keys and eg_ keys so localData and contexts stay in sync
    try {
      localStorage.setItem("users", JSON.stringify(data.users || []));
      localStorage.setItem("students", JSON.stringify(data.students || []));
      localStorage.setItem("parents", JSON.stringify(data.parents || []));

      // also update the eg_ prefixed keys used by localData for compatibility
      localStorage.setItem("eg_users", JSON.stringify(data.users || []));
      localStorage.setItem("eg_students", JSON.stringify(data.students || []));
      localStorage.setItem("eg_parents", JSON.stringify(data.parents || []));

      localStorage.setItem("assignments", JSON.stringify(data.assignments || []));
      localStorage.setItem("grades", JSON.stringify(data.grades || []));
      localStorage.setItem("attendance", JSON.stringify(data.attendance || []));
      localStorage.setItem("timetable", JSON.stringify(data.timetable || []));
      localStorage.setItem("messages", JSON.stringify(data.messages || []));
    } catch (e) {
      // ignore storage errors
    }

    // notify other parts of the app that localStorage changed
    window.dispatchEvent(new Event("storage"));
  }, [data]);

  // listen for storage events (or synthetic storage events dispatched elsewhere) so we refresh
  useEffect(() => {
    const onStorage = () => {
      try {
        setData({
          users: JSON.parse(localStorage.getItem("users")) || getUsers() || [],
          students: JSON.parse(localStorage.getItem("students")) || getStudents() || [],
          parents: JSON.parse(localStorage.getItem("parents")) || getParents() || [],
          assignments: JSON.parse(localStorage.getItem("assignments")) || [],
          grades: JSON.parse(localStorage.getItem("grades")) || [],
          attendance: JSON.parse(localStorage.getItem("attendance")) || [],
          timetable: JSON.parse(localStorage.getItem("timetable")) || [],
          messages: JSON.parse(localStorage.getItem("messages")) || [],
        });
      } catch (e) {}
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Provide both a flattened shape (so consumers can do `const { timetables } = useLive()`)
  // and the raw `data` object for advanced access.
  const refreshFn = () => {
    setData({
      users: JSON.parse(localStorage.getItem("users")) || getUsers() || [],
      students: JSON.parse(localStorage.getItem("students")) || getStudents() || [],
      parents: JSON.parse(localStorage.getItem("parents")) || getParents() || [],
      assignments: JSON.parse(localStorage.getItem("assignments")) || [],
      grades: JSON.parse(localStorage.getItem("grades")) || [],
      attendance: JSON.parse(localStorage.getItem("attendance")) || [],
      timetable: JSON.parse(localStorage.getItem("timetable")) || [],
      messages: JSON.parse(localStorage.getItem("messages")) || [],
    });
  };

  return (
    <LiveContext.Provider value={{
      // flattened keys for convenience
      ...(data || {}),
      // full access
      data,
      setData,
      refresh: refreshFn,
    }}>
      {children}
    </LiveContext.Provider>
  );
};

export const useLive = () => useContext(LiveContext);
