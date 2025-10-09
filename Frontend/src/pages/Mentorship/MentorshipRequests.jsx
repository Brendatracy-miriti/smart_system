import React, { useContext } from "react";
import { motion } from "framer-motion";
import { DataContext } from "../../context/DataContext";

export default function MentorshipRequests() {
  const { data, updateMentorshipStatus } = useContext(DataContext);
  const currentUser = JSON.parse(localStorage.getItem("eg_current_user") || "null");
  const myRequests = (data.mentorships || []).filter((m) => m.teacherId === currentUser?.id);

  const studentsById = (id) => (data.users || []).find((u) => u.id === id);

  return (
    <motion.div className="p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2 className="text-2xl font-bold text-primary">Mentorship Requests</h2>
      <p className="text-gray-500 dark:text-gray-400">Manage incoming mentorship requests</p>

      <div className="mt-4 space-y-3">
        {myRequests.length === 0 && <p className="text-gray-500">No requests yet.</p>}
        {myRequests.map((r) => {
          const student = studentsById(r.studentId);
          return (
            <div key={r.id} className="bg-white dark:bg-[#1F2937] p-4 rounded-lg shadow flex items-center justify-between">
              <div>
                <div className="font-semibold text-primary">{student?.name || "Student"}</div>
                <div className="text-sm text-gray-500">Requested: {new Date(r.createdAt).toLocaleDateString()}</div>
              </div>
              <div className="flex gap-2">
                {r.status === "pending" ? (
                  <>
                    <button onClick={() => updateMentorshipStatus(r.id, "approved")} className="px-3 py-1 bg-green-600 text-white rounded">Approve</button>
                    <button onClick={() => updateMentorshipStatus(r.id, "rejected")} className="px-3 py-1 bg-red-600 text-white rounded">Reject</button>
                  </>
                ) : (
                  <span className={`px-3 py-1 rounded ${r.status === "approved" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{r.status}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
