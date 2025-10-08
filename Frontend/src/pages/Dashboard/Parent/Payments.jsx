import React from "react";
import { motion } from "framer-motion";
import TableCard from "../../../ui/TableCard";

export default function Payments() {
  const payments = [
    { Date: "2025-09-05", Amount: "KSh 15,000", Status: "Confirmed" },
    { Date: "2025-06-10", Amount: "KSh 12,000", Status: "Pending" },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="p-6">
      <h2 className="text-2xl font-bold text-primary mb-4">Payment History</h2>
      <TableCard title="Fees Payments" columns={["Date", "Amount", "Status"]} data={payments} />
    </motion.div>
  );
}
