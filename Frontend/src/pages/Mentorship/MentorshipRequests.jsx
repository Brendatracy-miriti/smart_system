import React, { useContext } from "react";
import { motion } from "framer-motion";
import { DataContext } from "../../context/DataContext";
import { useAuth } from "../../context/AuthContext";

export default function MentorshipRequests() {
  const { mentorships, students, updateMentorshipStatus } =
    useContext(DataContext);
  const { currentUser } = useAuth();

  const myRequests = mentorships.filter(
    (m) => m.teacherId === currentUser?.id
  );

  const handleAction = (id, status) => {
    updateMentorshipStatus(id, status);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6"
    >
      <h2 className="text-2xl font-bold text-primary mb-4">
        Mentorship Requests
      </h2>

      {myRequests.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">
          No mentorship requests yet.
        </p>
      ) : (
        <div className="space-y-4">
          {myRequests.map((req) => {
            const student = students.find((s) => s.id === req.studentId);
            return (
              <div
                key={req.id}
                className="bg-white dark:bg-[#1F2937] p-5 rounded-xl shadow flex items-center justify-between"
              >
                <div>
                  <h3 className="font-semibold text-primary">
                    {student?.name || "Unknown Student"}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Status: {req.status}
                  </p>
                </div>

                {req.status === "pending" && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAction(req.id, "approved")}
                      className="px-3 py-1 bg-green-600 text-white rounded-lg"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleAction(req.id, "rejected")}
                      className="px-3 py-1 bg-red-600 text-white rounded-lg"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
