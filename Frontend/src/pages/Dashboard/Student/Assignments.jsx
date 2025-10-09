import React, { useState } from "react";
import { useData } from "../../../context/DataContext";
import { useMessage } from "../../../context/MessageContext";

export default function StudentAssignments() {
  const { data, addSubmission, refresh } = useData();
  const { setMessage } = useMessage();
  const student = JSON.parse(localStorage.getItem("eg_current_user") || "null");
  const [answer, setAnswer] = useState("");
  const [selected, setSelected] = useState(null);

  const submit = () => {
    if (!selected) return setMessage({ type: "error", text: "Select assignment" });
    const sub = {
      id: Date.now(),
      studentId: student.id,
      assignmentId: selected.id,
      answer,
      submittedAt: new Date().toISOString(),
      grade: null,
    };
    addSubmission(sub);
    refresh();
    setAnswer("");
    setSelected(null);
    setMessage({ type: "success", text: "Submission sent" });
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-bold text-primary">My Assignments</h2>

      <div className="grid gap-3">
        {data.assignments.map((a) => (
          <div
            key={a.id}
            className={`p-3 rounded shadow cursor-pointer ${
              selected?.id === a.id
                ? "bg-blue-50 dark:bg-blue-900/40"
                : "bg-white dark:bg-[#071027]"
            }`}
            onClick={() => setSelected(a)}
          >
            <h3 className="font-semibold">{a.title}</h3>
            <p className="text-sm">{a.description}</p>
            <p className="text-xs text-gray-400">
              Deadline: {a.deadline || "N/A"}
            </p>
          </div>
        ))}
      </div>

      {selected && (
        <div className="bg-white dark:bg-[#071027] p-4 rounded-xl shadow space-y-3">
          <h3 className="font-semibold">{selected.title}</h3>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Write your answer…"
            className="w-full p-2 border rounded"
          />
          <button
            onClick={submit}
            className="bg-primary text-white px-4 py-2 rounded"
          >
            Submit
          </button>
        </div>
      )}
    </div>
  );
}
