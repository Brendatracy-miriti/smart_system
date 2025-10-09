import React, { useContext } from "react";
import { motion } from "framer-motion";
import { DataContext } from "../../context/DataContext";
import { useNavigate } from "react-router-dom";

export default function MentorshipList() {
  const { data, requestMentorship } = useContext(DataContext);
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("eg_current_user") || "null");

  const teachers = (data.users || []).filter((u) => u.role === "teacher");

  const myRequests = (data.mentorships || []).filter((m) => m.studentId === currentUser?.id);

  const handleRequest = (teacherId) => {
    if (!currentUser) return navigate("/login");
    requestMentorship(currentUser.id, teacherId);
    alert("Request sent");
  };

  return (
    <motion.div className="p-6 space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2 className="text-2xl font-bold text-primary">Find a Mentor</h2>
      <p className="text-gray-500 dark:text-gray-400">Request a mentorship with a teacher.</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {teachers.map((t) => {
          const existing = myRequests.find((r) => r.teacherId === t.id);
          return (
            <div key={t.id} className="bg-white dark:bg-[#1F2937] p-4 rounded-2xl shadow">
              <div className="flex items-center gap-3">
                <img src={t.avatar || t.photo || "https://i.pravatar.cc/100"} alt={t.name} className="w-14 h-14 rounded-full object-cover border-2" />
                <div>
                  <div className="font-semibold text-primary">{t.name}</div>
                  <div className="text-sm text-gray-500">{(t.courses || []).join(", ") || "General"}</div>
                </div>
              </div>

              <div className="mt-3">
                {existing ? (
                  <span className={`px-3 py-1 rounded-lg text-sm ${existing.status === "approved" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                    {existing.status}
                  </span>
                ) : (
                  <button onClick={() => handleRequest(t.id)} className="w-full mt-3 py-2 rounded-lg text-white" style={{ backgroundColor: "#1E3A8A" }}>
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
