import React from "react";
import { motion } from "framer-motion";
import TableCard from "../../../ui/TableCard";

export default function Timetable() {
  const data = [
    { Day: "Monday", Subject: "Math", Time: "8:00 - 9:30" },
    { Day: "Tuesday", Subject: "Science", Time: "10:00 - 11:30" },
    { Day: "Wednesday", Subject: "ICT", Time: "9:00 - 10:30" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="p-6"
    >
      <h2 className="text-2xl font-bold text-primary mb-4">Lesson Timetable</h2>
      <TableCard title="Weekly Schedule" columns={["Day", "Subject", "Time"]} data={data} />
    </motion.div>
  );
}
