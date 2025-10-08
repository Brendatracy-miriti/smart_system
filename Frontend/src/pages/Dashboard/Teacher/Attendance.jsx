import React, { useState } from "react";
import { motion } from "framer-motion";
import TableCard from "../../../ui/TableCard";

export default function Attendance() {
  const [attendance, setAttendance] = useState([
    { name: "John Doe", status: "Present" },
    { name: "Jane Wanjiru", status: "Absent" },
  ]);

  const toggleStatus = (idx) => {
    setAttendance((prev) =>
      prev.map((row, i) =>
        i === idx ? { ...row, status: row.status === "Present" ? "Absent" : "Present" } : row
      )
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="p-6 space-y-6"
    >
      <h2 className="text-2xl font-bold text-primary">Class Attendance</h2>
      <TableCard
        title="Today's Attendance"
        columns={["Student", "Status", "Action"]}
        data={attendance.map((a, idx) => ({
          Student: a.name,
          Status: (
            <span
              className={`px-2 py-1 rounded-full text-xs ${
                a.status === "Present"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {a.status}
            </span>
          ),
          Action: (
            <button
              onClick={() => toggleStatus(idx)}
              className="px-3 py-1 text-sm rounded-md bg-primary text-white hover:bg-accent"
            >
              Toggle
            </button>
          ),
        }))}
      />
    </motion.div>
  );
}
