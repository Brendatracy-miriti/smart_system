import React, { useContext } from "react";
import { motion } from "framer-motion";
import { DataContext } from "../../context/DataContext";
import { useAuth } from "../../context/AuthContext";

export default function MentorshipList() {
  const { teachers, mentorships, requestMentorship } = useContext(DataContext);
  const { currentUser } = useAuth();

  const handleRequest = (teacherId) => {
    if (!currentUser) return alert("You must be logged in.");
    requestMentorship(currentUser.id, teacherId);
  };

  const userMentorships = mentorships.filter(
    (m) => m.studentId === currentUser?.id
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 space-y-6"
    >
      <h2 className="text-2xl font-bold text-primary">Find a Mentor</h2>
      <p className="text-gray-500 dark:text-gray-400">
        Connect with teachers for guidance and mentorship.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teachers.map((teacher) => {
          const existing = userMentorships.find(
            (m) => m.teacherId === teacher.id
          );
          return (
            <div
              key={teacher.id}
              className="bg-white dark:bg-[#1F2937] p-5 rounded-2xl shadow"
            >
              <div className="flex items-center gap-4">
                <img
                  src={teacher.photo || "https://i.pravatar.cc/100"}
                  alt={teacher.name}
                  className="w-16 h-16 rounded-full border-4 border-[#38BDF8]"
                />
                <div>
                  <h3 className="font-semibold text-primary">{teacher.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {teacher.courses?.join(", ") || "General Studies"}
                  </p>
                </div>
              </div>
              <div className="mt-4">
                {existing ? (
                  <span
                    className={`px-3 py-1 text-sm rounded-lg ${
                      existing.status === "approved"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {existing.status === "approved"
                      ? "Approved"
                      : "Request Pending"}
                  </span>
                ) : (
                  <button
                    onClick={() => handleRequest(teacher.id)}
                    className="w-full mt-2 py-2 rounded-lg text-white font-semibold hover:opacity-90"
                    style={{ backgroundColor: "#1E3A8A" }}
                  >
                    Request Mentorship
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
