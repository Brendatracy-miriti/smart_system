import React, { useState } from "react";
import { motion } from "framer-motion";
import TableCard from "../../../ui/TableCard";

export default function Assignments() {
  const [assignments] = useState([
    { title: "Algebra Basics", due: "2025-10-10", submissions: "34/40" },
    { title: "Geometry Quiz", due: "2025-10-12", submissions: "28/40" },
  ]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="p-6 space-y-6"
    >
      <h2 className="text-2xl font-bold text-primary">Assignments</h2>
      <TableCard
        title="Uploaded Assignments"
        columns={["Title", "Due Date", "Submissions"]}
        data={assignments.map((a) => ({
          Title: a.title,
          "Due Date": a.due,
          Submissions: a.submissions,
        }))}
      />
      <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-accent">
        Upload New Assignment
      </button>
    </motion.div>
  );
}
